import React, { useEffect } from "react";
import { useIDE } from "../ide/IDEContext";
import { RUNNABLE } from "../ide/types";
import TitleBar from "./TitleBar";
import ActivityBar from "./ActivityBar";
import SideBar from "./SideBar";
import EditorTabs from "./EditorTabs";
import EditorPane from "./EditorPane";
import Terminal from "./Terminal";
import StatusBar from "./StatusBar";
import CommandPalette from "./CommandPalette";

const IDE: React.FC = () => {
  const {
    sidebarVisible, setSidebarVisible,
    terminalOpen, setTerminalOpen,
    mobileMenuOpen, setMobileMenuOpen,
    palette, setPalette,
    activeTab, getFile, runFile,
  } = useIDE();

  // global keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;

      if (mod && e.shiftKey && e.key.toLowerCase() === "p") {
        e.preventDefault();
        setPalette(palette === "commands" ? null : "commands");
      } else if (mod && !e.shiftKey && e.key.toLowerCase() === "p") {
        e.preventDefault();
        setPalette(palette === "files" ? null : "files");
      } else if (mod && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setSidebarVisible((v) => !v);
      } else if (e.ctrlKey && e.key === "`") {
        e.preventDefault();
        setTerminalOpen((v) => !v);
      } else if (mod && e.key === "Enter") {
        const f = activeTab ? getFile(activeTab) : undefined;
        if (f && !f.page && RUNNABLE.includes(f.language)) {
          e.preventDefault();
          runFile(f.path);
        }
      } else if (e.key === "Escape" && palette) {
        setPalette(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [palette, setPalette, setSidebarVisible, setTerminalOpen, activeTab, getFile, runFile]);

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-ide-editor font-sans">
      <TitleBar />

      <div className="flex min-h-0 flex-1">
        {/* activity bar — always visible on desktop, hidden on small screens */}
        <div className="hidden h-full sm:block">
          <ActivityBar />
        </div>

        {/* sidebar (desktop inline) */}
        <div className="hidden h-full lg:block">
          {sidebarVisible && <SideBar />}
        </div>

        {/* sidebar (mobile/tablet overlay) */}
        {mobileMenuOpen && (
          <div className="absolute inset-0 z-40 flex lg:hidden">
            <div className="flex h-full">
              <div className="h-full sm:hidden">
                <ActivityBar />
              </div>
              <SideBar />
            </div>
            <div
              className="h-full flex-1 bg-black/50"
              onClick={() => setMobileMenuOpen(false)}
            />
          </div>
        )}

        {/* editor + terminal column */}
        <div className="flex min-w-0 flex-1 flex-col">
          <EditorTabs />
          <div className="min-h-0 flex-1">
            <EditorPane />
          </div>
          {terminalOpen && <Terminal />}
        </div>
      </div>

      <StatusBar />
      <CommandPalette />
    </div>
  );
};

export default IDE;
