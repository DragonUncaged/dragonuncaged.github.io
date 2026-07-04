import type { RunIO } from "./index";

const TIMEOUT_MS = 8000;

/**
 * Runs user JavaScript inside a sandboxed Web Worker.
 * console.* is forwarded to the terminal; the worker is killed on timeout.
 */
export function runJavaScript(code: string, io: RunIO): Promise<number> {
  const harness = `
    "use strict";
    const __fmt = (args) => args.map((a) => {
      if (typeof a === "string") return a;
      if (a instanceof Error) return a.stack || String(a);
      try { return JSON.stringify(a) ?? String(a); }
      catch { return String(a); }
    }).join(" ");
    ["log", "info", "debug"].forEach((m) => {
      console[m] = (...args) => postMessage({ type: "stdout", text: __fmt(args) });
    });
    ["warn", "error"].forEach((m) => {
      console[m] = (...args) => postMessage({ type: "stderr", text: __fmt(args) });
    });
    (async () => {
      try {
        await eval(${JSON.stringify(code)});
        postMessage({ type: "done", code: 0 });
      } catch (e) {
        postMessage({ type: "stderr", text: (e && e.stack) ? e.stack : String(e) });
        postMessage({ type: "done", code: 1 });
      }
    })();
  `;

  const blob = new Blob([harness], { type: "application/javascript" });
  const url = URL.createObjectURL(blob);
  const worker = new Worker(url);

  return new Promise<number>((resolve) => {
    let finished = false;
    const finish = (code: number) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve(code);
    };

    const timer = setTimeout(() => {
      io.stderr(`process killed: exceeded ${TIMEOUT_MS / 1000}s time limit`);
      finish(137);
    }, TIMEOUT_MS);

    worker.onmessage = (e) => {
      const msg = e.data;
      if (msg.type === "stdout") io.stdout(msg.text);
      else if (msg.type === "stderr") io.stderr(msg.text);
      else if (msg.type === "done") finish(msg.code);
    };
    worker.onerror = (e) => {
      io.stderr(e.message || "Uncaught error");
      finish(1);
    };
  });
}
