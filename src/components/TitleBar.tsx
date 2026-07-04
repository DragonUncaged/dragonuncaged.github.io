import React from "react";
import { useIDE } from "../ide/IDEContext";
import { MenuIcon, SearchIcon } from "./Icons";
import { profile } from "../data/portfolio";

const menuItems = ["File", "Edit", "Selection", "View", "Go", "Run", "Terminal", "Help"];

const TitleBar: React.FC = () => {
  const { setPalette, setMobileMenuOpen } = useIDE();

  return (
    <div className="relative z-30 flex h-9 shrink-0 items-center border-b border-ide-border bg-ide-canvas px-3 text-[13px] text-ide-muted select-none">
      {/* traffic lights */}
      <div className="flex items-center gap-2 pr-3">
        <span className="h-3 w-3 rounded-full bg-[#f2564d]" />
        <span className="h-3 w-3 rounded-full bg-[#f5b331]" />
        <span className="h-3 w-3 rounded-full bg-[#3fc244]" />
      </div>

      {/* menus (decorative on small screens they collapse into hamburger) */}
      <button
        className="mr-2 rounded p-1 hover:bg-ide-hover hover:text-ide-text lg:hidden"
        onClick={() => setMobileMenuOpen((v) => !v)}
        aria-label="Toggle explorer"
      >
        <MenuIcon className="h-5 w-5" />
      </button>
      <div className="hidden items-center gap-0.5 lg:flex">
        {menuItems.map((m) => (
          <button
            key={m}
            className="rounded px-2 py-0.5 hover:bg-ide-hover hover:text-ide-text"
            onClick={() => setPalette("commands")}
          >
            {m}
          </button>
        ))}
      </div>

      {/* centered search pill — opens quick open */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <button
          className="hidden w-72 items-center justify-center gap-2 rounded-md border border-ide-border bg-ide-input px-3 py-[3px] text-xs text-ide-faint transition-colors hover:border-ide-accentDim hover:text-ide-muted sm:flex xl:w-96"
          onClick={() => setPalette("files")}
        >
          <SearchIcon className="h-3.5 w-3.5" />
          {profile.handle}-portfolio
          <span className="ml-2 rounded border border-ide-border px-1 font-mono text-[10px]">
            ⌘P
          </span>
        </button>
      </div>

      <span className="ml-auto font-mono text-xs text-ide-faint">
        {profile.name} — Visual Studio Code
      </span>
    </div>
  );
};

export default TitleBar;
