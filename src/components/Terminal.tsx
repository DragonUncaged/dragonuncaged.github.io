import React, { useCallback, useEffect, useRef, useState } from "react";
import { useIDE, TermLine } from "../ide/IDEContext";
import { fileName } from "../ide/types";
import { profile, projects, skills } from "../data/portfolio";
import { CloseIcon, TrashIcon, ChevronDown } from "./Icons";

const COMMANDS = [
  "help", "ls", "cat", "open", "run", "new", "touch", "rm", "reset",
  "clear", "pwd", "cd", "whoami", "date", "echo", "history", "neofetch",
  "social", "contact", "github", "linkedin", "codechef", "codeforces",
  "mail", "sudo", "exit",
];

const BANNER = String.raw`
       __
  ____/ /________ _____ _____  ____
 / __  / ___/ __ '/ __ '/ __ \/ __ \
/ /_/ / /  / /_/ / /_/ / /_/ / / / /
\__,_/_/   \__,_/\__, /\____/_/ /_/
                /____/        u n c a g e d`;

type PanelTab = "problems" | "output" | "terminal";

const kindClass: Record<string, string> = {
  out: "text-[#cccccc]",
  err: "text-[#f14c4c]",
  sys: "italic text-ide-faint",
  ok: "text-[#89d185]",
  accent: "text-ide-accent",
  cmd: "text-ide-text",
};

// VS Code terminal ANSI palette for the prompt
const Prompt: React.FC = () => (
  <span className="shrink-0 whitespace-pre">
    <span className="text-[#23d18b]">guest</span>
    <span className="text-ide-faint">@</span>
    <span className="text-[#3b8eea]">{profile.handle}</span>
    <span className="text-[#29b8db]"> ~/portfolio</span>
    <span className="text-[#e5e510]"> &gt; </span>
  </span>
);

const URL_RE = /(https?:\/\/[^\s]+|[\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g;

/** Renders terminal text with URLs and email addresses as clickable links. */
const Linkified: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(URL_RE);
  if (parts.length === 1) return <>{text}</>;
  return (
    <>
      {parts.map((part, i) => {
        if (!part) return null;
        if (/^https?:\/\//.test(part)) {
          return (
            <a
              key={i}
              href={part}
              target="_blank"
              rel="noreferrer noopener"
              className="text-ide-accent underline decoration-ide-accent/50 underline-offset-2 hover:text-ide-accentBright hover:decoration-ide-accentBright"
            >
              {part}
            </a>
          );
        }
        if (/^[\w.+-]+@[\w-]+(?:\.[\w-]+)+$/.test(part)) {
          return (
            <a
              key={i}
              href={`mailto:${part}`}
              className="text-ide-accent underline decoration-ide-accent/50 underline-offset-2 hover:text-ide-accentBright hover:decoration-ide-accentBright"
            >
              {part}
            </a>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
};

const MIN_H = 120;
const MAX_H = () => Math.max(200, window.innerHeight - 220);

const Terminal: React.FC = () => {
  const ide = useIDE();
  const {
    termLines, writeTerm, clearTerm, setTerminalOpen,
    files, openFile, runFile, createFile, deleteFile, resetPlayground,
    running,
  } = ide;

  const [tab, setTab] = useState<PanelTab>("terminal");
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const histIdx = useRef(-1);
  const [height, setHeight] = useState<number>(() => {
    const saved = parseInt(localStorage.getItem("termHeight") || "230", 10);
    return isNaN(saved) ? 230 : saved;
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const filesRef = useRef(files);
  filesRef.current = files;
  const booted = useRef(false);

  useEffect(() => {
    localStorage.setItem("termHeight", String(height));
  }, [height]);

  // boot banner (once)
  useEffect(() => {
    if (!booted.current && termLines.length === 0) {
      booted.current = true;
      writeTerm("accent", BANNER);
      writeTerm("sys", "");
      writeTerm("sys", `Welcome to ${profile.name}'s portfolio - interactive shell`);
      writeTerm("sys", "Type `help` to see what this terminal can do - yes, it can compile C.");
      writeTerm("sys", "");
    }
  }, [termLines.length, writeTerm]);

  // autoscroll
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [termLines, tab]);

  const resolveFile = useCallback((token: string) => {
    const t = token.replace(/^\.\//, "");
    return (
      filesRef.current.find((f) => f.path === t) ||
      filesRef.current.find((f) => fileName(f.path) === t)
    );
  }, []);

  const execute = useCallback(
    (raw: string) => {
      const line = raw.trim();
      writeTerm("cmd", raw);
      if (!line) return;

      const [cmd, ...args] = line.split(/\s+/);
      const arg = args.join(" ");

      switch (cmd) {
        case "help":
          writeTerm("accent", "Available commands");
          [
            ["help", "this list"],
            ["ls [dir]", "list files"],
            ["cat <file>", "print file contents"],
            ["open <file>", "open a file in the editor"],
            ["run <file>", "execute a .js / .py / .c / .cpp file"],
            ["new <name>", "create a file in playground/ (e.g. new demo.py)"],
            ["rm <file>", "delete a playground file"],
            ["reset", "restore the playground seed files"],
            ["neofetch", "system info, developer edition"],
            ["social", "all my links, clickable"],
            ["github / linkedin / codechef", "print a clickable profile link"],
            ["whoami / date / echo / pwd / history", "the classics"],
            ["clear", "clear the terminal"],
            ["exit", "close this panel"],
          ].forEach(([c, d]) =>
            writeTerm("out", `  ${String(c).padEnd(24)} ${d}`)
          );
          writeTerm("sys", "tip: Tab completes commands and file names.");
          break;

        case "ls": {
          const dir = arg.replace(/\/$/, "");
          if (!dir) {
            writeTerm("accent", "portfolio/   playground/");
            writeTerm("out", filesRef.current.map((f) => f.path).join("\n"));
          } else {
            const items = filesRef.current.filter((f) => f.path.startsWith(dir + "/"));
            if (items.length === 0) writeTerm("err", `ls: ${arg}: no such directory`);
            else writeTerm("out", items.map((f) => fileName(f.path)).join("  "));
          }
          break;
        }

        case "cat": {
          if (!arg) return writeTerm("err", "usage: cat <file>");
          const f = resolveFile(arg);
          if (!f) return writeTerm("err", `cat: ${arg}: no such file`);
          writeTerm("out", f.content);
          if (f.page) writeTerm("sys", `(this file renders as a designed page - try \`open ${fileName(f.path)}\`)`);
          break;
        }

        case "open": {
          if (!arg) return writeTerm("err", "usage: open <file>");
          const f = resolveFile(arg);
          if (!f) return writeTerm("err", `open: ${arg}: no such file`);
          openFile(f.path);
          writeTerm("ok", `opened ${f.path}`);
          break;
        }

        case "run": {
          if (!arg) return writeTerm("err", "usage: run <file>  (e.g. run hello.c)");
          const f = resolveFile(arg);
          if (!f) return writeTerm("err", `run: ${arg}: no such file`);
          runFile(f.path);
          break;
        }

        case "new":
        case "touch": {
          if (!arg) return writeTerm("err", `usage: ${cmd} <name.ext>  (js, py, c or cpp)`);
          const name = arg.replace(/^playground\//, "");
          const err = createFile(name);
          if (err) writeTerm("err", err);
          else writeTerm("ok", `created playground/${name} - it's open in the editor. \`run ${name}\` when ready.`);
          break;
        }

        case "rm": {
          if (!arg) return writeTerm("err", "usage: rm <file>");
          const f = resolveFile(arg);
          if (!f) return writeTerm("err", `rm: ${arg}: no such file`);
          if (f.page) return writeTerm("err", `rm: ${fileName(f.path)}: permission denied - portfolio files are load-bearing`);
          deleteFile(f.path);
          writeTerm("ok", `deleted ${f.path}`);
          break;
        }

        case "reset":
          resetPlayground();
          writeTerm("ok", "playground restored to factory settings.");
          break;

        case "clear":
          clearTerm();
          break;

        case "pwd":
          writeTerm("out", "/home/guest/ankit-rao/portfolio");
          break;

        case "cd":
          writeTerm("sys", "there is no escaping this portfolio. try `open <file>` instead.");
          break;

        case "whoami":
          writeTerm("out", "you: a very welcome visitor");
          writeTerm("out", `me:  ${profile.name} - ${profile.role} @ Internshala`);
          break;

        case "date":
          writeTerm("out", new Date().toString());
          break;

        case "echo":
          writeTerm("out", arg || "");
          break;

        case "history":
          history.forEach((h, i) => writeTerm("out", `  ${i + 1}  ${h}`));
          break;

        case "neofetch": {
          const info: [string, string][] = [
            ["user", profile.handle],
            ["role", profile.role],
            ["company", "Internshala"],
            ["location", profile.location],
            ["stack", skills.slice(0, 5).map((s) => s.name.split(" ")[0]).join(", ")],
            ["editor", "this one, obviously"],
            ["shipped", `${projects.length} live projects`],
            ["theme", "Dark+ (the classic VS Code blue)"],
          ];
          writeTerm("accent", BANNER);
          info.forEach(([k, v]) =>
            writeTerm("out", `  ${k.padEnd(10)} ${v}`)
          );
          break;
        }

        case "social":
        case "contact":
          writeTerm("out", `  github     ${profile.github}`);
          writeTerm("out", `  linkedin   ${profile.linkedin}`);
          writeTerm("out", `  codechef   ${profile.codechef}`);
          writeTerm("out", `  email      ${profile.email}`);
          if (cmd === "contact") {
            openFile("portfolio/contact.sh");
            writeTerm("ok", "opened portfolio/contact.sh");
          }
          break;

        case "github":
        case "linkedin":
        case "codechef": {
          const url = profile[cmd];
          writeTerm("out", `${cmd.padEnd(10)} ${url}`);
          writeTerm("sys", "(click the link to open)");
          break;
        }

        case "codeforces":
          writeTerm("err", "codeforces: profile not linked yet - ankit is busy shipping features");
          writeTerm("out", `try instead: codechef   ${profile.codechef}`);
          break;

        case "mail":
        case "email":
          writeTerm("out", `mail       ${profile.email}`);
          writeTerm("sys", "(click the address to open your mail client)");
          break;

        case "sudo":
          if (/hire[\s-]?me/.test(arg)) {
            writeTerm("out", "[sudo] password for recruiter: ********");
            writeTerm("ok", "access granted - opening contact channel...");
            openFile("portfolio/contact.sh");
          } else {
            writeTerm("err", "guest is not in the sudoers file. this incident will be reported (to ankit).");
          }
          break;

        case "exit":
          writeTerm("sys", "closing panel - press Ctrl+` to bring it back.");
          setTimeout(() => setTerminalOpen(false), 400);
          break;

        case "python":
        case "python3":
        case "gcc":
        case "g++":
        case "node":
          writeTerm("sys", `no REPL here - put your code in a file and \`run\` it. try \`new demo.${cmd === "gcc" ? "c" : cmd === "g++" ? "cpp" : cmd.startsWith("py") ? "py" : "js"}\``);
          break;

        default:
          writeTerm("err", `zsh: command not found: ${cmd} - try \`help\``);
      }
    },
    [writeTerm, clearTerm, openFile, runFile, createFile, deleteFile, resetPlayground, resolveFile, history, setTerminalOpen]
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const value = input;
      setHistory((h) => (value.trim() ? [...h, value] : h));
      histIdx.current = -1;
      setInput("");
      execute(value);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const idx = histIdx.current;
      const next = idx === -1 ? history.length - 1 : Math.max(0, idx - 1);
      if (next >= 0) {
        histIdx.current = next;
        setInput(history[next] ?? "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx.current !== -1) {
        const next = histIdx.current + 1;
        if (next >= history.length) {
          histIdx.current = -1;
          setInput("");
        } else {
          histIdx.current = next;
          setInput(history[next]);
        }
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const parts = input.split(/\s+/);
      const last = parts[parts.length - 1] || "";
      if (!last) return;
      const pool =
        parts.length === 1
          ? COMMANDS
          : [
              ...filesRef.current.map((f) => fileName(f.path)),
              ...filesRef.current.map((f) => f.path),
            ];
      const matches = pool.filter((c) => c.startsWith(last));
      if (matches.length === 1) {
        parts[parts.length - 1] = matches[0];
        setInput(parts.join(" ") + (parts.length === 1 ? " " : ""));
      } else if (matches.length > 1) {
        writeTerm("cmd", input);
        writeTerm("sys", matches.slice(0, 12).join("   "));
      }
    } else if ((e.key === "c" && e.ctrlKey) || e.key === "Escape") {
      if (e.key === "c") writeTerm("cmd", `${input}^C`);
      setInput("");
      histIdx.current = -1;
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      clearTerm();
    }
  };

  const startResize = (down: React.MouseEvent) => {
    down.preventDefault();
    const startY = down.clientY;
    const startH = height;
    const onMove = (e: MouseEvent) => {
      const h = startH + (startY - e.clientY);
      setHeight(Math.min(Math.max(h, MIN_H), MAX_H()));
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const renderLine = (l: TermLine) => {
    if (l.kind === "cmd") {
      return (
        <div key={l.id} className="flex">
          <Prompt />
          <span className="whitespace-pre-wrap break-all text-ide-text">{l.text}</span>
        </div>
      );
    }
    return (
      <div key={l.id} className={`whitespace-pre-wrap break-all ${kindClass[l.kind]}`}>
        {l.text ? <Linkified text={l.text} /> : " "}
      </div>
    );
  };

  return (
    <div
      className="relative flex shrink-0 flex-col border-t border-ide-border bg-ide-panel"
      style={{ height }}
    >
      {/* resize handle */}
      <div
        className="absolute -top-0.5 left-0 z-10 h-1.5 w-full cursor-row-resize hover:bg-ide-accent/50"
        onMouseDown={startResize}
      />

      {/* panel header */}
      <div className="flex h-8 shrink-0 items-center gap-4 border-b border-ide-border/60 px-4 text-[11px] uppercase tracking-wider text-ide-faint select-none">
        {(["problems", "output", "terminal"] as PanelTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`border-b pb-1 pt-1.5 transition-colors ${
              tab === t
                ? "border-ide-accent text-ide-text"
                : "border-transparent hover:text-ide-muted"
            }`}
          >
            {t}
            {t === "terminal" && running && (
              <span className="ml-1.5 inline-block h-1.5 w-1.5 animate-pulse-dot rounded-full bg-ide-accent align-middle" />
            )}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1">
          <button
            title="Clear terminal"
            className="rounded p-1 hover:bg-ide-hover hover:text-ide-text"
            onClick={clearTerm}
          >
            <TrashIcon className="h-3.5 w-3.5" />
          </button>
          <button
            title="Minimize panel (Ctrl+`)"
            className="rounded p-1 hover:bg-ide-hover hover:text-ide-text"
            onClick={() => setTerminalOpen(false)}
          >
            <ChevronDown className="h-4 w-4" />
          </button>
          <button
            title="Close panel"
            className="rounded p-1 hover:bg-ide-hover hover:text-ide-text"
            onClick={() => setTerminalOpen(false)}
          >
            <CloseIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* body */}
      {tab === "terminal" ? (
        <div
          ref={scrollRef}
          className="min-h-0 flex-1 cursor-text overflow-y-auto px-4 py-2 font-mono text-[13px] leading-[1.5]"
          onClick={() => inputRef.current?.focus()}
        >
          {termLines.map(renderLine)}
          <div className="flex">
            <Prompt />
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              className="min-w-0 flex-1 bg-transparent font-mono text-[13px] text-ide-text caret-ide-accent outline-none"
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              aria-label="Terminal input"
            />
          </div>
        </div>
      ) : tab === "problems" ? (
        <div className="flex-1 overflow-y-auto px-4 py-3 font-mono text-[13px] text-ide-faint">
          <p className="text-syn-string">No problems have been detected in this developer.</p>
          <p className="mt-2">
            (Known warnings: will refactor perfectly working code at 2am; strong
            opinions about tabs vs spaces.)
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-4 py-3 font-mono text-[13px] text-ide-faint">
          <p>[portfolio] channel initialised.</p>
          <p>[portfolio] nothing to show here - run a file and watch the TERMINAL tab.</p>
        </div>
      )}
    </div>
  );
};

export default Terminal;
