import React, { useEffect, useMemo, useRef, useState } from "react";
import { useIDE } from "../ide/IDEContext";
import { fileName, RUNNABLE } from "../ide/types";
import FileIcon from "./FileIcon";
import { profile } from "../data/portfolio";

interface Item {
  id: string;
  label: string;
  detail?: string;
  icon?: React.ReactNode;
  action: () => void;
}

const CommandPalette: React.FC = () => {
  const ide = useIDE();
  const {
    palette, setPalette, files, openFile, runFile, activeTab,
    setTerminalOpen, requestNewFile, setSidebarVisible, resetPlayground,
  } = ide;
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (palette) {
      setQuery("");
      setSelected(0);
      // let the element mount first
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [palette]);

  const items: Item[] = useMemo(() => {
    if (palette === "files") {
      return files.map((f) => ({
        id: f.path,
        label: fileName(f.path),
        detail: f.path,
        icon: <FileIcon path={f.path} />,
        action: () => openFile(f.path),
      }));
    }
    const commands: Item[] = [
      {
        id: "new",
        label: "File: New File…",
        detail: "create a runnable .c / .py / .js file",
        action: () => requestNewFile(),
      },
      {
        id: "run",
        label: "Run: Run Active File",
        detail: activeTab ? fileName(activeTab) : "no file focused",
        action: () => {
          const f = activeTab && ide.getFile(activeTab);
          if (f && !f.page && RUNNABLE.includes(f.language)) runFile(f.path);
        },
      },
      {
        id: "terminal",
        label: "View: Toggle Terminal",
        detail: "Ctrl+`",
        action: () => setTerminalOpen((v) => !v),
      },
      {
        id: "sidebar",
        label: "View: Toggle Sidebar",
        detail: "⌘B",
        action: () => setSidebarVisible((v) => !v),
      },
      {
        id: "reset",
        label: "Playground: Restore Seed Files",
        detail: "undo your experiments",
        action: () => resetPlayground(),
      },
      ...files
        .filter((f) => f.page)
        .map((f) => ({
          id: `go-${f.path}`,
          label: `Go: ${fileName(f.path)}`,
          detail: f.path,
          icon: <FileIcon path={f.path} />,
          action: () => openFile(f.path),
        })),
      {
        id: "github",
        label: "Ankit: Open GitHub Profile",
        detail: "@DragonUncaged",
        action: () => window.open(profile.github, "_blank"),
      },
      {
        id: "hire",
        label: "Ankit: Hire Me",
        detail: "opens your mail client",
        action: () => {
          window.location.href = `mailto:${profile.email}?subject=Let's work together`;
        },
      },
    ];
    return commands;
  }, [palette, files, activeTab, ide, openFile, runFile, setTerminalOpen, setSidebarVisible, requestNewFile, resetPlayground]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) =>
        i.label.toLowerCase().includes(q) ||
        (i.detail || "").toLowerCase().includes(q)
    );
  }, [items, query]);

  useEffect(() => setSelected(0), [filtered.length]);

  useEffect(() => {
    listRef.current
      ?.querySelector('[data-selected="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  if (!palette) return null;

  const choose = (item: Item) => {
    setPalette(null);
    item.action();
  };

  return (
    <div
      className="absolute inset-0 z-50"
      onMouseDown={() => setPalette(null)}
    >
      <div
        className="mx-auto mt-16 w-[560px] max-w-[92vw] overflow-hidden border border-ide-border bg-ide-sidebar shadow-[0_16px_48px_rgba(0,0,0,0.6)]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setPalette(null);
            else if (e.key === "ArrowDown") {
              e.preventDefault();
              setSelected((s) => Math.min(s + 1, filtered.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setSelected((s) => Math.max(s - 1, 0));
            } else if (e.key === "Enter" && filtered[selected]) {
              choose(filtered[selected]);
            }
          }}
          placeholder={
            palette === "files"
              ? "Search files by name…"
              : "> Type a command… (try 'hire')"
          }
          className="w-full border-b border-ide-border bg-ide-input px-4 py-3 font-mono text-sm text-ide-text outline-none placeholder:text-ide-faint"
        />
        <div ref={listRef} className="max-h-80 overflow-y-auto py-1">
          {filtered.length === 0 && (
            <p className="px-4 py-3 font-mono text-xs text-ide-faint">
              no matching results
            </p>
          )}
          {filtered.map((item, i) => (
            <button
              key={item.id}
              data-selected={i === selected}
              onMouseEnter={() => setSelected(i)}
              onClick={() => choose(item)}
              className={`flex w-full items-center gap-2 px-4 py-1.5 text-left text-[13px] ${
                i === selected
                  ? "bg-ide-accent/20 text-ide-text"
                  : "text-ide-muted"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.detail && (
                <span className="ml-auto truncate pl-4 font-mono text-[11px] text-ide-faint">
                  {item.detail}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
