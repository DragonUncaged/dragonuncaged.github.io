import { VFile } from "./types";

/**
 * Portfolio "pages" — rendered as designed views, pinned in the explorer.
 * Their `content` is what `cat` prints in the terminal.
 */
export const pageFiles: VFile[] = [
  {
    path: "portfolio/welcome.tsx",
    language: "typescript",
    page: "welcome",
    readOnly: true,
    content: `// Ankit Rao — Full Stack Developer
// Welcome to my portfolio. Open a file from the explorer,
// or type \`help\` in the terminal below.`,
  },
  {
    path: "portfolio/about.md",
    language: "markdown",
    page: "about",
    readOnly: true,
    content: `# About Me
Full stack developer at Even Healthcare. B.Tech CS, Chandigarh University.
I build fast, polished web apps with React, Node.js and Python.`,
  },
  {
    path: "portfolio/resume.json",
    language: "json",
    page: "resume",
    readOnly: true,
    content: `{
  "education": "Chandigarh University — B.Tech CS (2020–2024)",
  "work": "Even Healthcare — Full Stack Developer (Feb 2025 – Present)"
}`,
  },
  {
    path: "portfolio/projects.js",
    language: "javascript",
    page: "projects",
    readOnly: true,
    content: `// CodeSpace · Draw · Chat App · Document Chatbot
// Open this file in the editor to explore them.`,
  },
  {
    path: "portfolio/contact.sh",
    language: "shell",
    page: "contact",
    readOnly: true,
    content: `#!/bin/bash
echo "email    → emailforreal.ankit@gmail.com"
echo "github   → github.com/DragonUncaged"
echo "linkedin → linkedin.com/in/ankitrao"`,
  },
];

/**
 * Playground seeds — editable, runnable, restorable via \`reset\`.
 */
export const seedFiles: VFile[] = [
  {
    path: "playground/hello.c",
    language: "c",
    seed: true,
    content: `#include <stdio.h>

/*
 * Yes, this actually compiles.
 * Press ▶ Run (or Ctrl/Cmd+Enter) — the code is sent to a
 * real GCC toolchain and the output lands in the terminal.
 */
int main(void) {
    for (int i = 3; i > 0; i--) {
        printf("Compiling in %d...\\n", i);
    }
    printf("Hello from C, inside a portfolio!\\n");
    return 0;
}
`,
  },
  {
    path: "playground/fibonacci.py",
    language: "python",
    seed: true,
    content: `# Runs on a full CPython interpreter (Pyodide/WebAssembly),
# right here in your browser. No server involved.

def fib():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

f = fib()
print("First 10 Fibonacci numbers:")
print(", ".join(str(next(f)) for _ in range(10)))
`,
  },
  {
    path: "playground/queries.sql",
    language: "sql",
    seed: true,
    content: `-- Real SQLite (compiled to WebAssembly), preloaded with this portfolio.
--
--   projects(id, name, description, language, url)
--   project_tech(project_id, tech)
--   skills(id, name)
--   experience(id, company, role, period, location)
--   education(id, institution, degree, period, location)
--   profile(key, value)
--
-- Ctrl/Cmd+Space autocompletes table and column names as you type.
-- Or type .schema in the terminal to print this from the live database.
-- Tables you CREATE stick around between runs.

SELECT name, language, url FROM projects;

-- Which stacks show up across more than one project?
SELECT tech, COUNT(*) AS used_in
FROM project_tech
GROUP BY tech
HAVING used_in > 1
ORDER BY used_in DESC;

SELECT p.name, GROUP_CONCAT(t.tech, ', ') AS stack
FROM projects p
JOIN project_tech t ON t.project_id = p.id
GROUP BY p.id;
`,
  },
  {
    path: "playground/hello.js",
    language: "javascript",
    seed: true,
    content: `// Executed in a sandboxed Web Worker — go ahead, edit me.
// Try Ctrl/Cmd+Enter to run.

const stack = ["React", "Node.js", "TypeScript", "Python"];

console.log("Ankit's toolbox:");
for (const tool of stack) {
  console.log("  ✓ " + tool);
}

const sum = [...Array(101).keys()].reduce((a, b) => a + b, 0);
console.log("Bonus: sum of 0..100 =", sum);
`,
  },
];

export const defaultOpenTabs = ["portfolio/welcome.tsx"];
