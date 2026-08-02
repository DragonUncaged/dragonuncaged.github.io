# dragonuncaged portfolio

[![Live Site](https://img.shields.io/badge/Live%20Site-dragonuncaged.github.io-blue?logo=github&logoColor=white)](https://dragonuncaged.github.io)
[![GitHub Repo](https://img.shields.io/badge/GitHub-dragonuncaged--portfolio-blue?logo=github&logoColor=white)](https://github.com/DragonUncaged/dragonuncaged.github.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Built with React](https://img.shields.io/badge/React-17-blue?logo=react&logoColor=white)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org)

A developer portfolio that *is* an IDE. It looks and behaves like Visual Studio
Code — file explorer, editor tabs, Monaco editor, command palette, status bar —
and it has a working terminal that can **actually compile and run code**:

| Language | How it runs |
| -------- | ----------- |
| `.js`    | Sandboxed Web Worker, right in the browser (8s time limit) |
| `.py`    | Full CPython 3.11 via [Pyodide](https://pyodide.org) (WebAssembly, ~10 MB one-time download) |
| `.c`     | Real GCC 14.1 via the [Compiler Explorer](https://godbolt.org) public API |
| `.cpp`   | g++ 14.1, same Compiler Explorer API |

Visitors can create files in `playground/`, edit them in Monaco, and run them
with `▶ Run`, `⌘/Ctrl+Enter`, or `run <file>` in the terminal.

## Features

- **VS Code Dark+ theme** — the classic charcoal + blue, from the
  activity bar to Monaco's syntax colors
- **Interactive terminal** — `help`, `ls`, `cat`, `open`, `run`, `new`, `rm`,
  `neofetch`, `sudo hire-me`, tab-completion, command history, and clickable
  links (`github`, `linkedin`, `codechef`, `social`)
- **Portfolio pages rendered as files** — `about.md`, `resume.json`,
  `projects.js`, `contact.sh`, each with a page design that matches its
  file type
- **Command palette** — `⌘P` quick-open, `⌘⇧P` commands
- **Persistent workspace** — created files and open tabs survive reloads
  (localStorage)

## Keyboard shortcuts

| Keys | Action |
| ---- | ------ |
| `⌘/Ctrl P` | Quick-open a file |
| `⌘/Ctrl ⇧ P` | Command palette |
| `⌘/Ctrl Enter` | Run the active file |
| `Ctrl \`` | Toggle terminal |
| `⌘/Ctrl B` | Toggle sidebar |

## Getting started

```bash
npm install
npm start
```

## Deployment (GitHub Pages)

```bash
npm run deploy
```

Uses the `homepage` field in `package.json`
(`https://DragonUncaged.github.io`).

## Stack

React 17 · TypeScript · Tailwind CSS · @monaco-editor/react · Pyodide ·
Compiler Explorer API · Create React App
