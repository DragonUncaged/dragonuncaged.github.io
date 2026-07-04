import type { RunIO } from "./index";

const PYODIDE_VERSION = "v0.25.1";
const PYODIDE_BASE = `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/`;

declare global {
  interface Window {
    loadPyodide?: (opts: { indexURL: string }) => Promise<any>;
  }
}

let pyodidePromise: Promise<any> | null = null;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`failed to load ${src}`));
    document.head.appendChild(s);
  });
}

export function isPythonReady(): boolean {
  return pyReady;
}
let pyReady = false;

async function getPyodide(io: RunIO): Promise<any> {
  if (!pyodidePromise) {
    io.system("Downloading Python runtime (Pyodide/WebAssembly, ~10 MB, one time)…");
    pyodidePromise = (async () => {
      // Monaco installs a global AMD loader; Pyodide's bundled UMD deps
      // (error-stack-parser/stackframe) would try to resolve through it and
      // fetch /stackframe.js from our server. Hiding the `amd` flag makes
      // those UMD wrappers fall back to plain globals. Monaco's own modules
      // call define() without checking the flag, so it stays functional.
      const g = window as any;
      const amdFlag = g.define && g.define.amd;
      if (g.define) g.define.amd = undefined;
      try {
        if (!window.loadPyodide) {
          await loadScript(`${PYODIDE_BASE}pyodide.js`);
        }
        const py = await window.loadPyodide!({ indexURL: PYODIDE_BASE });
        pyReady = true;
        io.system(`Python ${py.runPython("import sys; sys.version.split()[0]")} ready.`);
        return py;
      } finally {
        if (g.define && amdFlag) g.define.amd = amdFlag;
      }
    })();
    pyodidePromise.catch(() => {
      // allow retry after a network failure
      pyodidePromise = null;
    });
  }
  return pyodidePromise;
}

/** Runs Python on a CPython interpreter compiled to WebAssembly. */
export async function runPython(code: string, io: RunIO): Promise<number> {
  let py: any;
  try {
    py = await getPyodide(io);
  } catch (e: any) {
    io.stderr(
      "Could not download the Python runtime. Check your network connection and try again."
    );
    return 1;
  }

  py.setStdout({ batched: (text: string) => io.stdout(text) });
  py.setStderr({ batched: (text: string) => io.stderr(text) });

  try {
    await py.runPythonAsync(code);
    return 0;
  } catch (e: any) {
    // strip pyodide-internal frames from the traceback for readability
    const msg = String(e?.message || e)
      .split("\n")
      .filter((line) => !line.includes("pyodide/") && !line.includes("_pyodide/"))
      .join("\n")
      .trim();
    io.stderr(msg);
    return 1;
  } finally {
    py.setStdout({});
    py.setStderr({});
  }
}
