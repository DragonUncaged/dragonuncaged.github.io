import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { VFile, RUNNABLE, languageFromPath, fileName } from "./types";
import { pageFiles, seedFiles, defaultOpenTabs } from "./defaultFiles";
import { runCode } from "./runners";

const FILES_KEY = "vfs.files.v2";
const TABS_KEY = "vfs.tabs.v2";

export type TermKind = "out" | "err" | "sys" | "cmd" | "ok" | "accent";

export interface TermLine {
  id: number;
  kind: TermKind;
  text: string;
}

export type SideView = "explorer" | "search" | "git" | "run" | "extensions";
export type PaletteMode = "files" | "commands" | null;

interface IDEContextValue {
  // file system
  files: VFile[];
  getFile: (path: string) => VFile | undefined;
  createFile: (name: string) => string | null; // returns error message or null
  updateFile: (path: string, content: string) => void;
  deleteFile: (path: string) => boolean;
  resetPlayground: () => void;

  // tabs
  openTabs: string[];
  activeTab: string | null;
  openFile: (path: string) => void;
  closeTab: (path: string) => void;
  setActiveTab: (path: string) => void;

  // layout
  sidebarVisible: boolean;
  setSidebarVisible: (v: boolean | ((p: boolean) => boolean)) => void;
  sideView: SideView;
  setSideView: (v: SideView) => void;
  sidebarWidth: number;
  setSidebarWidth: (w: number) => void;
  terminalOpen: boolean;
  setTerminalOpen: (v: boolean | ((p: boolean) => boolean)) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean | ((p: boolean) => boolean)) => void;

  // terminal
  termLines: TermLine[];
  writeTerm: (kind: TermKind, text: string) => void;
  clearTerm: () => void;

  // execution
  running: string | null;
  runFile: (path: string) => Promise<void>;

  // command palette
  palette: PaletteMode;
  setPalette: (m: PaletteMode) => void;

  // explorer "new file" flow
  newFileSignal: number;
  requestNewFile: () => void;

  // status bar
  cursor: { line: number; col: number };
  setCursor: (c: { line: number; col: number }) => void;
}

const IDEContext = createContext<IDEContextValue | null>(null);

export function useIDE(): IDEContextValue {
  const ctx = useContext(IDEContext);
  if (!ctx) throw new Error("useIDE must be used inside <IDEProvider>");
  return ctx;
}

function loadUserFiles(): VFile[] {
  try {
    const raw = localStorage.getItem(FILES_KEY);
    if (!raw) return seedFiles.map((f) => ({ ...f }));
    const parsed = JSON.parse(raw) as VFile[];
    if (!Array.isArray(parsed)) return seedFiles.map((f) => ({ ...f }));
    return parsed
      .filter((f) => f && typeof f.path === "string")
      // re-derive language so files created before a language existed
      // (e.g. .cpp) pick up support on reload
      .map((f) => ({ ...f, language: languageFromPath(f.path) }));
  } catch {
    return seedFiles.map((f) => ({ ...f }));
  }
}

function loadTabs(userFiles: VFile[]): { tabs: string[]; active: string | null } {
  const valid = new Set([
    ...pageFiles.map((f) => f.path),
    ...userFiles.map((f) => f.path),
  ]);
  try {
    const raw = localStorage.getItem(TABS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const tabs = (parsed.tabs || []).filter((t: string) => valid.has(t));
      if (tabs.length > 0) {
        const active = valid.has(parsed.active) ? parsed.active : tabs[0];
        return { tabs, active };
      }
    }
  } catch {
    /* fall through to defaults */
  }
  return { tabs: [...defaultOpenTabs], active: defaultOpenTabs[0] };
}

export const IDEProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userFiles, setUserFiles] = useState<VFile[]>(loadUserFiles);
  const files = useMemo(() => [...pageFiles, ...userFiles], [userFiles]);
  const filesRef = useRef(files);
  filesRef.current = files;

  const initialTabs = useMemo(() => loadTabs(userFiles), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [openTabs, setOpenTabs] = useState<string[]>(initialTabs.tabs);
  const [activeTab, setActiveTabState] = useState<string | null>(
    initialTabs.active
  );

  const [sidebarVisible, setSidebarVisible] = useState<boolean>(
    () => window.innerWidth >= 1024
  );
  const [sideView, setSideView] = useState<SideView>("explorer");
  const [sidebarWidth, setSidebarWidthState] = useState<number>(() => {
    const saved = parseInt(localStorage.getItem("sideBarWidth") || "260", 10);
    return isNaN(saved) ? 260 : Math.min(Math.max(saved, 180), 480);
  });
  const [terminalOpen, setTerminalOpen] = useState<boolean>(
    () => window.innerWidth >= 768
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [termLines, setTermLines] = useState<TermLine[]>([]);
  const termId = useRef(0);
  const [running, setRunning] = useState<string | null>(null);
  const runningRef = useRef<string | null>(null);

  const [palette, setPalette] = useState<PaletteMode>(null);
  const [newFileSignal, setNewFileSignal] = useState(0);
  const [cursor, setCursor] = useState({ line: 1, col: 1 });

  // ---------- persistence ----------
  useEffect(() => {
    localStorage.setItem(FILES_KEY, JSON.stringify(userFiles));
  }, [userFiles]);

  useEffect(() => {
    localStorage.setItem(
      TABS_KEY,
      JSON.stringify({ tabs: openTabs, active: activeTab })
    );
  }, [openTabs, activeTab]);

  useEffect(() => {
    localStorage.setItem("sideBarWidth", String(sidebarWidth));
  }, [sidebarWidth]);

  // ---------- terminal ----------
  const writeTerm = useCallback((kind: TermKind, text: string) => {
    const chunks = String(text).split("\n");
    setTermLines((prev) => [
      ...prev,
      ...chunks.map((chunk) => ({ id: ++termId.current, kind, text: chunk })),
    ]);
  }, []);

  const clearTerm = useCallback(() => setTermLines([]), []);

  // ---------- file system ----------
  const getFile = useCallback(
    (path: string) => filesRef.current.find((f) => f.path === path),
    []
  );

  const openFile = useCallback((path: string) => {
    if (!filesRef.current.some((f) => f.path === path)) return;
    setOpenTabs((prev) => (prev.includes(path) ? prev : [...prev, path]));
    setActiveTabState(path);
  }, []);

  const closeTab = useCallback((path: string) => {
    setOpenTabs((prev) => {
      const idx = prev.indexOf(path);
      const next = prev.filter((p) => p !== path);
      setActiveTabState((cur) =>
        cur === path ? next[Math.min(idx, next.length - 1)] ?? null : cur
      );
      return next;
    });
  }, []);

  const setActiveTab = useCallback((path: string) => {
    setActiveTabState(path);
  }, []);

  const createFile = useCallback(
    (rawName: string): string | null => {
      const name = rawName.trim().replace(/^\/+|\/+$/g, "");
      if (!name) return "File name cannot be empty.";
      if (!/^[\w.-]+$/.test(name))
        return "Use letters, digits, dots, dashes and underscores only.";
      if (!name.includes(".") || name.startsWith(".") || name.endsWith("."))
        return "Add an extension — try .js, .py, .c or .cpp";
      const path = `playground/${name}`;
      if (filesRef.current.some((f) => f.path === path))
        return `${name} already exists.`;

      const language = languageFromPath(path);
      const templates: Record<string, string> = {
        c: `#include <stdio.h>\n\nint main(void) {\n    printf("Hello from ${name}\\n");\n    return 0;\n}\n`,
        cpp: `#include <iostream>\n\nint main() {\n    std::cout << "Hello from ${name}" << std::endl;\n    return 0;\n}\n`,
        python: `print("Hello from ${name}")\n`,
        javascript: `console.log("Hello from ${name}");\n`,
      };
      const file: VFile = {
        path,
        language,
        content: templates[language] ?? "",
      };
      setUserFiles((prev) => [...prev, file]);
      setOpenTabs((prev) => (prev.includes(path) ? prev : [...prev, path]));
      setActiveTabState(path);
      return null;
    },
    []
  );

  const updateFile = useCallback((path: string, content: string) => {
    setUserFiles((prev) =>
      prev.map((f) => (f.path === path ? { ...f, content } : f))
    );
  }, []);

  const deleteFile = useCallback(
    (path: string): boolean => {
      const file = filesRef.current.find((f) => f.path === path);
      if (!file || file.page) return false;
      setUserFiles((prev) => prev.filter((f) => f.path !== path));
      closeTab(path);
      return true;
    },
    [closeTab]
  );

  const resetPlayground = useCallback(() => {
    setUserFiles((prev) => {
      const custom = prev.filter(
        (f) => !seedFiles.some((s) => s.path === f.path) && !f.seed
      );
      return [...seedFiles.map((f) => ({ ...f })), ...custom];
    });
  }, []);

  // ---------- execution ----------
  const runFile = useCallback(
    async (path: string) => {
      const file = filesRef.current.find((f) => f.path === path);
      if (!file) {
        writeTerm("err", `run: ${path}: no such file`);
        return;
      }
      if (!RUNNABLE.includes(file.language) || file.page) {
        writeTerm(
          "err",
          `run: ${fileName(path)}: only .js, .py, .c and .cpp files are runnable`
        );
        return;
      }
      if (runningRef.current) {
        writeTerm("sys", `a process is already running (${runningRef.current})`);
        return;
      }

      setTerminalOpen(true);
      runningRef.current = path;
      setRunning(path);
      writeTerm("cmd", `run ${path}`);

      const io = {
        stdout: (t: string) => writeTerm("out", t),
        stderr: (t: string) => writeTerm("err", t),
        system: (t: string) => writeTerm("sys", t),
      };
      try {
        const { exitCode, durationMs } = await runCode(
          file.language,
          file.content,
          io
        );
        writeTerm(
          exitCode === 0 ? "ok" : "err",
          `process exited with code ${exitCode} · ${durationMs} ms`
        );
      } finally {
        runningRef.current = null;
        setRunning(null);
      }
    },
    [writeTerm]
  );

  const requestNewFile = useCallback(() => {
    setSidebarVisible(true);
    setSideView("explorer");
    setNewFileSignal((n) => n + 1);
  }, []);

  const setSidebarWidth = useCallback((w: number) => {
    setSidebarWidthState(Math.min(Math.max(w, 180), 480));
  }, []);

  const value = useMemo<IDEContextValue>(
    () => ({
      files,
      getFile,
      createFile,
      updateFile,
      deleteFile,
      resetPlayground,
      openTabs,
      activeTab,
      openFile,
      closeTab,
      setActiveTab,
      sidebarVisible,
      setSidebarVisible,
      sideView,
      setSideView,
      sidebarWidth,
      setSidebarWidth,
      terminalOpen,
      setTerminalOpen,
      mobileMenuOpen,
      setMobileMenuOpen,
      termLines,
      writeTerm,
      clearTerm,
      running,
      runFile,
      palette,
      setPalette,
      newFileSignal,
      requestNewFile,
      cursor,
      setCursor,
    }),
    [
      files,
      getFile,
      createFile,
      updateFile,
      deleteFile,
      resetPlayground,
      openTabs,
      activeTab,
      openFile,
      closeTab,
      setActiveTab,
      sidebarVisible,
      sideView,
      sidebarWidth,
      setSidebarWidth,
      terminalOpen,
      mobileMenuOpen,
      termLines,
      writeTerm,
      clearTerm,
      running,
      runFile,
      palette,
      newFileSignal,
      requestNewFile,
      cursor,
    ]
  );

  return <IDEContext.Provider value={value}>{children}</IDEContext.Provider>;
};
