import React from "react";
import { useIDE, SideView } from "../ide/IDEContext";
import {
  FilesIcon,
  SearchIcon,
  GitIcon,
  RunIcon,
  ExtensionsIcon,
  SettingsIcon,
  AccountIcon,
} from "./Icons";
import { profile } from "../data/portfolio";

const items: { id: SideView; icon: React.FC<any>; title: string; badge?: string }[] = [
  { id: "explorer", icon: FilesIcon, title: "Explorer" },
  { id: "search", icon: SearchIcon, title: "Search" },
  { id: "git", icon: GitIcon, title: "Source Control", badge: "∞" },
  { id: "run", icon: RunIcon, title: "Run and Debug" },
  { id: "extensions", icon: ExtensionsIcon, title: "Extensions" },
];

const ActivityBar: React.FC = () => {
  const {
    sideView,
    setSideView,
    sidebarVisible,
    setSidebarVisible,
    setPalette,
    setMobileMenuOpen,
  } = useIDE();

  const select = (id: SideView) => {
    if (sidebarVisible && sideView === id) {
      setSidebarVisible(false);
      setMobileMenuOpen(false);
    } else {
      setSideView(id);
      setSidebarVisible(true);
      // below lg the sidebar lives in an overlay
      if (window.innerWidth < 1024) setMobileMenuOpen(true);
    }
  };

  return (
    <div className="flex h-full w-12 shrink-0 flex-col items-center border-r border-ide-border bg-ide-canvas py-1 select-none">
      {items.map(({ id, icon: Icon, title, badge }) => {
        const active = sidebarVisible && sideView === id;
        return (
          <button
            key={id}
            title={title}
            onClick={() => select(id)}
            className={`relative flex h-12 w-12 items-center justify-center border-l-2 transition-colors ${
              active
                ? "border-ide-accent text-ide-text"
                : "border-transparent text-ide-faint hover:text-ide-text"
            }`}
          >
            <Icon className="h-6 w-6" strokeWidth={1.4} />
            {badge && (
              <span className="absolute bottom-2 right-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-ide-accent px-0.5 text-[9px] font-bold text-white">
                {badge}
              </span>
            )}
          </button>
        );
      })}

      <div className="mt-auto flex flex-col items-center">
        <a
          href={profile.github}
          target="_blank"
          rel="noreferrer"
          title="GitHub — @DragonUncaged"
          className="flex h-12 w-12 items-center justify-center text-ide-faint hover:text-ide-text"
        >
          <AccountIcon className="h-6 w-6" strokeWidth={1.4} />
        </a>
        <button
          title="Command Palette (⌘⇧P)"
          onClick={() => setPalette("commands")}
          className="flex h-12 w-12 items-center justify-center text-ide-faint hover:text-ide-text"
        >
          <SettingsIcon className="h-6 w-6" strokeWidth={1.4} />
        </button>
      </div>
    </div>
  );
};

export default ActivityBar;
