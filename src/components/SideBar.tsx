import React, { useEffect, useMemo, useRef, useState } from "react";
import { useIDE } from "../ide/IDEContext";
import { fileName, RUNNABLE } from "../ide/types";
import FileIcon from "./FileIcon";
import {
  ChevronDown,
  ChevronRight,
  PlusIcon,
  TrashIcon,
  RunIcon,
  CheckIcon,
  SpinnerIcon,
} from "./Icons";
import { profile, skills } from "../data/portfolio";

/* ---------------------------------- Explorer ---------------------------------- */

const Explorer: React.FC = () => {
  const {
    files,
    openFile,
    activeTab,
    deleteFile,
    createFile,
    newFileSignal,
    runFile,
    running,
  } = useIDE();

  const [openDirs, setOpenDirs] = useState<Record<string, boolean>>({
    portfolio: true,
    playground: true,
  });
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newFileSignal > 0) {
      setOpenDirs((d) => ({ ...d, playground: true }));
      setCreating(true);
    }
  }, [newFileSignal]);

  useEffect(() => {
    if (creating) inputRef.current?.focus();
  }, [creating]);

  const dirs = useMemo(() => {
    const grouped: Record<string, typeof files> = {};
    for (const f of files) {
      const dir = f.path.split("/")[0];
      (grouped[dir] = grouped[dir] || []).push(f);
    }
    return grouped;
  }, [files]);

  const submitDraft = () => {
    if (!draft.trim()) {
      setCreating(false);
      setError(null);
      return;
    }
    const err = createFile(draft);
    if (err) {
      setError(err);
    } else {
      setDraft("");
      setError(null);
      setCreating(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-ide-faint">
        Explorer
        <button
          title="New File (in playground/)"
          className="rounded p-1 text-ide-muted hover:bg-ide-hover hover:text-ide-text"
          onClick={() => {
            setOpenDirs((d) => ({ ...d, playground: true }));
            setCreating(true);
          }}
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pb-4 text-[13px] text-ide-muted">
        <div className="px-2 pb-1 font-mono text-[11px] font-bold uppercase tracking-wider text-ide-text/80">
          <span className="px-2">{profile.handle}-portfolio</span>
        </div>

        {(["portfolio", "playground"] as const).map((dir) => (
          <div key={dir}>
            <button
              className="flex w-full items-center gap-1 px-2 py-[3px] font-medium text-ide-text/90 hover:bg-ide-hover"
              onClick={() => setOpenDirs((d) => ({ ...d, [dir]: !d[dir] }))}
            >
              {openDirs[dir] ? (
                <ChevronDown className="h-4 w-4 shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 shrink-0" />
              )}
              {dir}
              {dir === "playground" && (
                <span className="ml-1 font-normal text-ide-faint">· runnable</span>
              )}
            </button>

            {openDirs[dir] &&
              (dirs[dir] || []).map((f) => (
                <div
                  key={f.path}
                  className={`group flex cursor-pointer items-center gap-1 py-[3px] pl-7 pr-2 ${
                    activeTab === f.path
                      ? "bg-ide-active text-ide-text"
                      : "hover:bg-ide-hover"
                  }`}
                  onClick={() => openFile(f.path)}
                >
                  <FileIcon path={f.path} />
                  <span className="truncate">{fileName(f.path)}</span>
                  <span className="ml-auto hidden shrink-0 items-center gap-1 group-hover:flex">
                    {RUNNABLE.includes(f.language) && !f.page && (
                      <button
                        title="Run"
                        className="rounded p-0.5 text-ide-faint hover:bg-ide-active hover:text-[#89d185]"
                        onClick={(e) => {
                          e.stopPropagation();
                          runFile(f.path);
                        }}
                      >
                        {running === f.path ? (
                          <SpinnerIcon className="h-3.5 w-3.5" />
                        ) : (
                          <RunIcon className="h-3.5 w-3.5" />
                        )}
                      </button>
                    )}
                    {!f.page && (
                      <button
                        title="Delete"
                        className="rounded p-0.5 text-ide-faint hover:bg-ide-active hover:text-red-400"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteFile(f.path);
                        }}
                      >
                        <TrashIcon className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </span>
                </div>
              ))}

            {dir === "playground" && openDirs.playground && creating && (
              <div className="py-[2px] pl-7 pr-2">
                <div className="flex items-center gap-1">
                  <FileIcon path={draft || "x.txt"} />
                  <input
                    ref={inputRef}
                    value={draft}
                    onChange={(e) => {
                      setDraft(e.target.value);
                      setError(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") submitDraft();
                      if (e.key === "Escape") {
                        setCreating(false);
                        setDraft("");
                        setError(null);
                      }
                    }}
                    onBlur={submitDraft}
                    placeholder="name.c | name.cpp | name.py | name.js"
                    className="w-full border border-ide-accentDim bg-ide-input px-1 py-[1px] font-mono text-xs text-ide-text outline-none placeholder:text-ide-faint"
                  />
                </div>
                {error && (
                  <p className="mt-1 border border-red-900/60 bg-red-950/40 px-2 py-1 text-[11px] text-red-300">
                    {error}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}

        <p className="mt-4 px-4 text-[11px] leading-relaxed text-ide-faint">
          Tip: create a file in <span className="font-mono">playground/</span>{" "}
          with <span className="font-mono text-syn-func">+</span>, then hit{" "}
          <span className="font-mono text-[#89d185]">▶ Run</span> — C, Python
          and JavaScript all execute for real.
        </p>
      </div>

      {/* social footer */}
      <div className="border-t border-ide-border px-4 py-3">
        <div className="flex items-center justify-between font-mono text-[11px] text-ide-faint">
          {[
            { label: "github", href: profile.github },
            { label: "linkedin", href: profile.linkedin },
            { label: "codechef", href: profile.codechef },
            { label: "mail", href: `mailto:${profile.email}` },
          ].map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="hover:text-ide-accent"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ----------------------------------- Search ----------------------------------- */

const SearchPanel: React.FC = () => {
  const { files, openFile } = useIDE();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const out: { path: string; line: number; text: string }[] = [];
    for (const f of files) {
      f.content.split("\n").forEach((line, i) => {
        if (line.toLowerCase().includes(q) && out.length < 60) {
          out.push({ path: f.path, line: i + 1, text: line.trim().slice(0, 80) });
        }
      });
      if (fileName(f.path).toLowerCase().includes(q)) {
        out.unshift({ path: f.path, line: 1, text: `filename match` });
      }
    }
    return out.slice(0, 60);
  }, [query, files]);

  return (
    <div className="flex h-full flex-col">
      <div className="px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-ide-faint">
        Search
      </div>
      <div className="px-3">
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search workspace files"
          className="w-full border border-ide-border bg-ide-input px-2 py-1.5 text-[13px] text-ide-text outline-none placeholder:text-ide-faint focus:border-ide-accentDim"
        />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-1 py-2">
        {query && results.length === 0 && (
          <p className="px-3 py-2 text-xs text-ide-faint">No results found.</p>
        )}
        {results.map((r, i) => (
          <button
            key={i}
            className="flex w-full items-center gap-1 px-2 py-[3px] text-left text-xs text-ide-muted hover:bg-ide-hover"
            onClick={() => openFile(r.path)}
          >
            <FileIcon path={r.path} />
            <span className="shrink-0 text-ide-text/90">{fileName(r.path)}</span>
            <span className="shrink-0 text-ide-faint">:{r.line}</span>
            <span className="truncate text-ide-faint">— {r.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

/* ------------------------------- Source Control ------------------------------- */

const GitPanel: React.FC = () => (
  <div className="flex h-full flex-col">
    <div className="px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-ide-faint">
      Source Control
    </div>
    <div className="space-y-3 px-4 text-[13px] text-ide-muted">
      <input
        placeholder='Message (⌘Enter to commit on "main")'
        className="w-full border border-ide-border bg-ide-input px-2 py-1.5 text-xs outline-none placeholder:text-ide-faint focus:border-ide-accentDim"
        readOnly
        value=""
      />
      <div className="border border-ide-border bg-ide-input/50 p-3 font-mono text-xs leading-relaxed">
        <p className="text-[#89d185]">✓ shipped: learn react</p>
        <p className="text-[#89d185]">✓ shipped: b.tech in cs</p>
        <p className="text-[#89d185]">✓ shipped: full stack @ internshala</p>
        <p className="text-syn-func">● wip: your project here?</p>
      </div>
      <p className="text-xs leading-relaxed text-ide-faint">
        Commit history looking good. The next feature could be yours —{" "}
        <a
          className="text-ide-accent hover:underline"
          href={`mailto:${profile.email}`}
        >
          open a pull request
        </a>
        .
      </p>
    </div>
  </div>
);

/* ------------------------------------ Run ------------------------------------- */

const RunPanel: React.FC = () => {
  const { files, runFile, running } = useIDE();
  const runnable = files.filter((f) => !f.page && RUNNABLE.includes(f.language));

  return (
    <div className="flex h-full flex-col">
      <div className="px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-ide-faint">
        Run and Debug
      </div>
      <div className="space-y-1 px-3">
        {runnable.map((f) => (
          <button
            key={f.path}
            disabled={!!running}
            onClick={() => runFile(f.path)}
            className="flex w-full items-center gap-2 border border-ide-border bg-ide-input/50 px-3 py-2 text-left text-[13px] text-ide-muted transition-colors hover:border-ide-accentDim hover:text-ide-text disabled:opacity-50"
          >
            {running === f.path ? (
              <SpinnerIcon className="h-4 w-4 text-ide-accent" />
            ) : (
              <RunIcon className="h-4 w-4 text-syn-string" />
            )}
            <FileIcon path={f.path} />
            {fileName(f.path)}
          </button>
        ))}
      </div>
      <p className="mt-4 px-4 text-[11px] leading-relaxed text-ide-faint">
        JavaScript runs in a sandboxed Web Worker, Python on a WebAssembly
        CPython build, and C is compiled by real GCC via the Piston API.
      </p>
    </div>
  );
};

/* --------------------------------- Extensions --------------------------------- */

const ExtensionsPanel: React.FC = () => (
  <div className="flex h-full flex-col">
    <div className="px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-ide-faint">
      Extensions <span className="normal-case tracking-normal">· installed in Ankit</span>
    </div>
    <div className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 pb-4">
      {skills.map((s) => (
        <div
          key={s.name}
          className="flex items-center gap-3 border border-transparent px-2 py-2 hover:border-ide-border hover:bg-ide-hover"
        >
          <img src={s.logo} alt="" className="h-7 w-7 object-contain" />
          <div className="min-w-0">
            <p className="truncate text-[13px] text-ide-text">{s.name}</p>
            <p className="text-[11px] text-ide-faint">ankit-rao · production use</p>
          </div>
          <span className="ml-auto flex items-center gap-1 rounded-sm bg-ide-active px-1.5 py-0.5 text-[10px] font-medium text-[#89d185]">
            <CheckIcon className="h-3 w-3" /> Installed
          </span>
        </div>
      ))}
    </div>
  </div>
);

const panels: Record<string, React.FC> = {
  explorer: Explorer,
  search: SearchPanel,
  git: GitPanel,
  run: RunPanel,
  extensions: ExtensionsPanel,
};

/* ---------------------------------- container --------------------------------- */

const SideBar: React.FC = () => {
  const { sideView, sidebarWidth, setSidebarWidth } = useIDE();
  const Panel = panels[sideView] || Explorer;

  const startResizing = (downEvent: React.MouseEvent) => {
    downEvent.preventDefault();
    const startX = downEvent.clientX;
    const startWidth = sidebarWidth;
    const onMove = (e: MouseEvent) => {
      setSidebarWidth(startWidth + (e.clientX - startX));
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <div
      className="relative flex h-full shrink-0 border-r border-ide-border bg-ide-sidebar select-none"
      style={{ width: sidebarWidth }}
    >
      <div className="min-w-0 flex-1">
        <Panel />
      </div>
      <div
        className="absolute right-0 top-0 z-10 h-full w-1 cursor-col-resize hover:bg-ide-accent/60"
        onMouseDown={startResizing}
      />
    </div>
  );
};

export default SideBar;
