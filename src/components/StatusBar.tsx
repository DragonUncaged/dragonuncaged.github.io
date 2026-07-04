import React from "react";
import { useIDE } from "../ide/IDEContext";
import { languageLabel } from "../ide/types";
import { BranchIcon, ErrorIcon, WarningIcon, BellIcon, TerminalIcon, SpinnerIcon } from "./Icons";

const StatusBar: React.FC = () => {
  const { activeTab, getFile, cursor, running, setTerminalOpen, terminalOpen } = useIDE();
  const file = activeTab ? getFile(activeTab) : undefined;

  return (
    <div className="flex h-6 shrink-0 items-center gap-1 bg-ide-statusbar px-2 text-[11.5px] font-medium text-white/95 select-none">
      <span className="flex items-center gap-1 rounded-sm px-1.5 py-px hover:bg-white/15" title="Checked out: main — always shippable">
        <BranchIcon className="h-3.5 w-3.5" />
        main
      </span>
      <span className="flex items-center gap-1 rounded-sm px-1.5 py-px hover:bg-white/15" title="No problems detected">
        <ErrorIcon className="h-3.5 w-3.5" /> 0
        <WarningIcon className="ml-0.5 h-3.5 w-3.5" /> 0
      </span>
      {running && (
        <span className="flex items-center gap-1.5 rounded-sm px-1.5 py-px" title={`Running ${running}`}>
          <SpinnerIcon className="h-3 w-3" />
          running {running.split("/").pop()}
        </span>
      )}

      <button
        className="ml-auto flex items-center gap-1 rounded-sm px-1.5 py-px hover:bg-white/15"
        onClick={() => setTerminalOpen((v) => !v)}
        title="Toggle terminal (Ctrl+`)"
      >
        <TerminalIcon className="h-3.5 w-3.5" />
        {terminalOpen ? "hide" : "show"} terminal
      </button>
      {file && !file.page && (
        <span className="hidden rounded-sm px-1.5 py-px hover:bg-white/15 sm:block">
          Ln {cursor.line}, Col {cursor.col}
        </span>
      )}
      <span className="hidden rounded-sm px-1.5 py-px hover:bg-white/15 md:block">UTF-8</span>
      {file && (
        <span className="rounded-sm px-1.5 py-px hover:bg-white/15">
          {file.page ? "Rendered View" : languageLabel(file.language)}
        </span>
      )}
      <span className="hidden items-center gap-1 rounded-sm px-1.5 py-px hover:bg-white/15 sm:flex" title="Open to work!">
        <span className="h-2 w-2 animate-pulse-dot rounded-full bg-[#b8e6a3]" />
        open to work
      </span>
      <BellIcon className="h-3.5 w-3.5" />
    </div>
  );
};

export default StatusBar;
