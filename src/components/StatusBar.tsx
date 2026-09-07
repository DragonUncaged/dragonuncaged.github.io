import React from "react";
import { useIDE } from "../ide/IDEContext";
import { languageLabel } from "../ide/types";
import { BranchIcon, ErrorIcon, WarningIcon, BellIcon, TerminalIcon, SpinnerIcon } from "./Icons";

const StatusBar: React.FC = () => {
  const { activeTab, getFile, cursor, running, setTerminalOpen, terminalOpen } = useIDE();
  const file = activeTab ? getFile(activeTab) : undefined;

  return (
    <div className="px-safe pb-safe flex shrink-0 items-center gap-0.5 overflow-hidden whitespace-nowrap bg-ide-statusbar px-1.5 text-[11.5px] font-medium text-white/95 select-none sm:gap-1 sm:px-2">
      <span className="flex shrink-0 items-center gap-1 rounded-sm px-1 py-1 hover:bg-white/15 sm:px-1.5 sm:py-px" title="Checked out: main — always shippable">
        <BranchIcon className="h-3.5 w-3.5 shrink-0" />
        main
      </span>
      <span className="flex shrink-0 items-center gap-1 rounded-sm px-1 py-1 hover:bg-white/15 sm:px-1.5 sm:py-px" title="No problems detected">
        <ErrorIcon className="h-3.5 w-3.5 shrink-0" /> 0
        <WarningIcon className="ml-0.5 h-3.5 w-3.5 shrink-0" /> 0
      </span>
      {running && (
        <span className="flex min-w-0 items-center gap-1.5 rounded-sm px-1.5 py-px" title={`Running ${running}`}>
          <SpinnerIcon className="h-3 w-3 shrink-0" />
          <span className="truncate">running {running.split("/").pop()}</span>
        </span>
      )}

      <button
        className="ml-auto flex shrink-0 items-center gap-1 rounded-sm px-2 py-1 hover:bg-white/15 sm:px-1.5 sm:py-px"
        onClick={() => setTerminalOpen((v) => !v)}
        title="Toggle terminal (Ctrl+`)"
        aria-label={`${terminalOpen ? "Hide" : "Show"} terminal`}
      >
        <TerminalIcon className="h-3.5 w-3.5 shrink-0" />
        {/* label is the first thing to drop — the icon already says it */}
        <span className="hidden sm:inline">
          {terminalOpen ? "hide" : "show"} terminal
        </span>
      </button>
      {file && !file.page && (
        <span className="hidden shrink-0 rounded-sm px-1.5 py-px hover:bg-white/15 md:block">
          Ln {cursor.line}, Col {cursor.col}
        </span>
      )}
      <span className="hidden shrink-0 rounded-sm px-1.5 py-px hover:bg-white/15 lg:block">UTF-8</span>
      {file && (
        <span className="shrink-0 rounded-sm px-1 py-1 hover:bg-white/15 sm:px-1.5 sm:py-px">
          {file.page ? (
            <>
              <span className="sm:hidden">Preview</span>
              <span className="hidden sm:inline">Rendered View</span>
            </>
          ) : (
            languageLabel(file.language)
          )}
        </span>
      )}
      <span className="hidden shrink-0 items-center gap-1 rounded-sm px-1.5 py-px hover:bg-white/15 md:flex" title="Open to work!">
        <span className="h-2 w-2 animate-pulse-dot rounded-full bg-[#b8e6a3]" />
        open to work
      </span>
      <BellIcon className="h-3.5 w-3.5 shrink-0" />
    </div>
  );
};

export default StatusBar;
