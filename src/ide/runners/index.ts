import { Language } from "../types";
import { runJavaScript } from "./runJS";
import { runPython } from "./runPython";
import { runC } from "./runC";

export interface RunIO {
  /** program stdout */
  stdout: (text: string) => void;
  /** program stderr / runtime errors */
  stderr: (text: string) => void;
  /** runner status messages (loading interpreter, compiling…) */
  system: (text: string) => void;
}

export interface RunResult {
  exitCode: number;
  durationMs: number;
}

export async function runCode(
  language: Language,
  code: string,
  io: RunIO
): Promise<RunResult> {
  const started = performance.now();
  let exitCode = 0;
  try {
    switch (language) {
      case "javascript":
        exitCode = await runJavaScript(code, io);
        break;
      case "python":
        exitCode = await runPython(code, io);
        break;
      case "c":
      case "cpp":
        exitCode = await runC(code, io, language);
        break;
      default:
        io.stderr(`no runner registered for language "${language}"`);
        exitCode = 1;
    }
  } catch (e: any) {
    io.stderr(String(e?.message || e));
    exitCode = 1;
  }
  return { exitCode, durationMs: Math.round(performance.now() - started) };
}
