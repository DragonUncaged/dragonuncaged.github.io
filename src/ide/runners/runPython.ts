import type { RunIO } from "./index";

const PYODIDE_VERSION = "v0.25.1";
const PYODIDE_BASE = `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/`;
const TIMEOUT_MS = 15000;

/**
 * Pyodide lives in a worker: a `while True:` loop burns a background thread
 * instead of freezing the tab, and terminate() is a real kill switch
 */
const WORKER_SRC = `
  let py = null;
  self.onmessage = async (e) => {
    const msg = e.data;

    if (msg.type === "init") {
      try {
        importScripts(msg.base + "pyodide.js");
        py = await loadPyodide({ indexURL: msg.base });
        py.setStdout({ batched: (t) => postMessage({ type: "stdout", text: t }) });
        py.setStderr({ batched: (t) => postMessage({ type: "stderr", text: t }) });
        postMessage({
          type: "ready",
          version: py.runPython("import sys; sys.version.split()[0]"),
        });
      } catch (err) {
        postMessage({ type: "fatal", text: String((err && err.message) || err) });
      }
      return;
    }

    if (msg.type === "run") {
      try {
        await py.runPythonAsync(msg.code);
        postMessage({ type: "done", code: 0 });
      } catch (err) {
        postMessage({ type: "trace", text: String((err && err.message) || err) });
        postMessage({ type: "done", code: 1 });
      }
    }
  };
`;

let workerPromise: Promise<Worker> | null = null;
let workerRef: Worker | null = null;
let workerURL: string | null = null;
/** the wasm is HTTP-cached after the first boot, so only say "downloading" once */
let bootedOnce = false;

/** drops the interpreter so the next run boots a clean one */
function killWorker() {
  if (workerRef) workerRef.terminate();
  if (workerURL) URL.revokeObjectURL(workerURL);
  workerRef = null;
  workerURL = null;
  workerPromise = null;
}

function getWorker(io: RunIO): Promise<Worker> {
  if (!workerPromise) {
    io.system(
      bootedOnce
        ? "Restarting the Python interpreter…"
        : "Downloading Python runtime (Pyodide/WebAssembly, ~10 MB, one time)…"
    );
    bootedOnce = true;
    workerPromise = new Promise<Worker>((resolve, reject) => {
      const blob = new Blob([WORKER_SRC], { type: "application/javascript" });
      workerURL = URL.createObjectURL(blob);
      const worker = new Worker(workerURL);
      workerRef = worker;

      worker.onmessage = (e) => {
        if (e.data.type === "ready") {
          io.system(`Python ${e.data.version} ready.`);
          resolve(worker);
        } else if (e.data.type === "fatal") {
          reject(new Error(e.data.text));
        }
      };
      worker.onerror = (e) => reject(new Error(e.message || "worker failed"));
      worker.postMessage({ type: "init", base: PYODIDE_BASE });
    });

    workerPromise.catch(() => killWorker()); // allow retry after a network failure
  }
  return workerPromise;
}

/** Runs Python on a CPython interpreter compiled to WebAssembly. */
export async function runPython(code: string, io: RunIO): Promise<number> {
  let worker: Worker;
  try {
    worker = await getWorker(io);
  } catch {
    io.stderr(
      "Could not download the Python runtime. Check your network connection and try again."
    );
    return 1;
  }

  return new Promise<number>((resolve) => {
    let finished = false;
    const finish = (exitCode: number) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      resolve(exitCode);
    };

    const timer = setTimeout(() => {
      io.stderr(`process killed: exceeded ${TIMEOUT_MS / 1000}s time limit`);
      io.system("the interpreter was restarted.");
      killWorker();
      finish(137);
    }, TIMEOUT_MS);

    worker.onmessage = (e) => {
      const msg = e.data;
      if (msg.type === "stdout") io.stdout(msg.text);
      else if (msg.type === "stderr") io.stderr(msg.text);
      else if (msg.type === "trace") {
        io.stderr(
          msg.text
            .split("\n")
            .filter(
              (line: string) =>
                !line.includes("pyodide/") && !line.includes("_pyodide/")
            )
            .join("\n")
            .trim()
        );
      } else if (msg.type === "done") finish(msg.code);
    };

    worker.onerror = (e) => {
      io.stderr(e.message || "Python worker crashed");
      killWorker();
      finish(1);
    };

    worker.postMessage({ type: "run", code });
  });
}
