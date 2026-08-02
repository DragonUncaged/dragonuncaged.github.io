import React from "react";
import { useIDE } from "../ide/IDEContext";
import { fileName, dirName } from "../ide/types";
import CodeEditor from "./CodeEditor";
import WelcomePage from "./pages/WelcomePage";
import AboutPage from "./pages/AboutPage";
import ResumePage from "./pages/ResumePage";
import ProjectsPage from "./pages/ProjectsPage";
import ContactPage from "./pages/ContactPage";
import FileIcon from "./FileIcon";
import { ChevronRight } from "./Icons";
import { profile } from "../data/portfolio";

const pageComponents: Record<string, React.FC> = {
  welcome: WelcomePage,
  about: AboutPage,
  resume: ResumePage,
  projects: ProjectsPage,
  contact: ContactPage,
};

/** Shown when every tab is closed — VS Code's empty editor state. */
const EmptyState: React.FC = () => {
  const { openFile, setPalette } = useIDE();
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 bg-ide-editor text-ide-faint select-none">
      <pre className="font-mono text-[10px] leading-tight text-ide-border sm:text-xs">
{String.raw`     _                             __
    | |                           / /
  __| |_ __ __ _  __ _  ___  _ __/ /
 / _' | '__/ _' |/ _' |/ _ \| '_ \/
| (_| | | | (_| | (_| | (_) | | | |
 \__,_|_|  \__,_|\__, |\___/|_| |_|
                  __/ |  uncaged
                 |___/`}
      </pre>
      <div className="space-y-2 text-center font-mono text-xs">
        <p>
          <button
            className="text-ide-accent hover:underline"
            onClick={() => openFile("portfolio/welcome.tsx")}
          >
            show welcome page
          </button>
        </p>
        <p>
          <button
            className="text-ide-muted hover:text-ide-text"
            onClick={() => setPalette("files")}
          >
            go to file <span className="ml-1 rounded border border-ide-border px-1">⌘P</span>
          </button>
        </p>
      </div>
    </div>
  );
};

const EditorPane: React.FC = () => {
  const { activeTab, getFile } = useIDE();
  const file = activeTab ? getFile(activeTab) : undefined;

  if (!file) return <EmptyState />;

  const Page = file.page ? pageComponents[file.page] : null;

  return (
    <div className="flex h-full min-h-0 flex-col bg-ide-editor">
      {/* breadcrumbs */}
      <div className="flex h-6 shrink-0 items-center gap-0.5 border-b border-ide-border/60 px-3 font-mono text-[11px] text-ide-faint select-none">
        <span>{profile.handle}-portfolio</span>
        <ChevronRight className="h-3 w-3" />
        <span>{dirName(file.path)}</span>
        <ChevronRight className="h-3 w-3" />
        <FileIcon path={file.path} className="!w-4" />
        <span className="text-ide-muted">{fileName(file.path)}</span>
        {file.readOnly && (
          <span className="ml-2 rounded-sm border border-ide-border px-1 text-[10px]">
            read-only · rendered view
          </span>
        )}
      </div>

      <div className="min-h-0 flex-1">
        {Page ? <Page /> : <CodeEditor file={file} />}
      </div>
    </div>
  );
};

export default EditorPane;
