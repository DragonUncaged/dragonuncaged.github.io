import type { RunIO } from "./index";

// Compiler Explorer (godbolt.org) public API — real GCC 14.1 with execution.
const COMPILERS = {
  c: { id: "cg141", lang: "c", label: "GCC 14.1" },
  cpp: { id: "g141", lang: "c++", label: "g++ 14.1" },
} as const;

const ANSI_RE = new RegExp(String.fromCharCode(27) + "\\[[0-9;]*m", "g");
const stripAnsi = (s: string) => s.replace(ANSI_RE, "");

const emitLines = (
  entries: { text: string }[] | undefined,
  emit: (line: string) => void
) => {
  (entries || []).forEach((e) => emit(stripAnsi(e.text)));
};

/**
 * Compiles and runs C / C++ on Compiler Explorer's public API.
 * The browser can't compile them natively, so this one goes over the network.
 */
export async function runC(
  code: string,
  io: RunIO,
  language: "c" | "cpp" = "c"
): Promise<number> {
  const compiler = COMPILERS[language];
  io.system(`Compiling with ${compiler.label} (godbolt.org)…`);

  let res: Response;
  try {
    res = await fetch(`https://godbolt.org/api/compiler/${compiler.id}/compile`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        source: code,
        lang: compiler.lang,
        allowStoreCodeDebug: false,
        options: {
          userArguments: "-O2 -Wall",
          executeParameters: { args: [], stdin: "" },
          compilerOptions: { executorRequest: true },
          filters: { execute: true },
          tools: [],
          libraries: [],
        },
      }),
    });
  } catch {
    io.stderr(
      "Could not reach the compile service (godbolt.org). Check your network connection."
    );
    return 1;
  }

  if (!res.ok) {
    io.stderr(`compile service returned HTTP ${res.status} — try again in a moment.`);
    return 1;
  }

  const data = await res.json();
  const build = data.buildResult;

  if (build && build.code !== 0) {
    io.system(`${compiler.label} failed to compile:`);
    emitLines(build.stderr, io.stderr);
    return build.code || 1;
  }
  // compiled with warnings
  if (build) emitLines(build.stderr, io.system);

  if (data.timedOut) {
    io.stderr("process killed: execution timed out");
    return 137;
  }

  emitLines(data.stdout, io.stdout);
  emitLines(data.stderr, io.stderr);
  return typeof data.code === "number" ? data.code : 0;
}
