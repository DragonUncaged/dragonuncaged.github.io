import React from "react";
import { useIDE } from "../ide/IDEContext";
import { fileName, RUNNABLE } from "../ide/types";
import FileIcon from "./FileIcon";
import { CloseIcon, RunIcon, SpinnerIcon } from "./Icons";

const EditorTabs: React.FC = () => {
  const {
    openTabs,
    activeTab,
    setActiveTab,
    closeTab,
    getFile,
    runFile,
    running,
  } = useIDE();

  const activeFile = activeTab ? getFile(activeTab) : undefined;
  const canRun =
    activeFile && !activeFile.page && RUNNABLE.includes(activeFile.language);

  return (
    <div className="flex h-9 shrink-0 items-stretch border-b border-ide-border bg-ide-tabbar select-none">
      <div className="no-scrollbar flex min-w-0 flex-1 items-stretch overflow-x-auto">
        {openTabs.map((path) => {
          const active = path === activeTab;
          return (
            <div
              key={path}
              onClick={() => setActiveTab(path)}
              className={`group flex shrink-0 cursor-pointer items-center gap-1 border-r border-ide-border px-3 text-[13px] ${
                active
                  ? "border-t-2 border-t-ide-accent bg-ide-editor text-ide-text"
                  : "border-t-2 border-t-transparent text-ide-faint hover:bg-ide-hover hover:text-ide-muted"
              }`}
            >
              <FileIcon path={path} />
              <span className="max-w-[9rem] truncate font-mono text-xs sm:max-w-none">
                {fileName(path)}
              </span>
              <button
                className={`touch-always-visible ml-1 rounded p-0.5 hover:bg-ide-active ${
                  active ? "opacity-70" : "opacity-0 group-hover:opacity-70"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(path);
                }}
                aria-label={`Close ${fileName(path)}`}
              >
                <CloseIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {canRun && (
        <button
          onClick={() => activeTab && runFile(activeTab)}
          disabled={!!running}
          title="Run current file (⌘/Ctrl+Enter)"
          aria-label="Run current file"
          className="flex shrink-0 items-center gap-1.5 border-l border-ide-border px-3 font-mono text-xs text-[#89d185] transition-colors hover:bg-ide-hover disabled:opacity-50"
        >
          {running === activeTab ? (
            <SpinnerIcon className="h-4 w-4" />
          ) : (
            <RunIcon className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">Run</span>
        </button>
      )}
    </div>
  );
};

export default EditorTabs;
