import React from "react";
import { useIDE } from "../../ide/IDEContext";
import { profile, projects } from "../../data/portfolio";
import FileIcon from "../FileIcon";
import { RunIcon, TerminalIcon, PlusIcon, ChevronRight, ExternalIcon } from "../Icons";

const WelcomePage: React.FC = () => {
  const { openFile, runFile, setTerminalOpen, requestNewFile } = useIDE();

  const startActions = [
    {
      icon: <PlusIcon className="h-4 w-4" />,
      label: "New file…",
      hint: "create & run .c / .py / .js / .sql",
      onClick: requestNewFile,
    },
    {
      icon: <RunIcon className="h-4 w-4" />,
      label: "Run playground/hello.c",
      hint: "compiles with real GCC",
      onClick: () => runFile("playground/hello.c"),
    },
    {
      icon: <TerminalIcon className="h-4 w-4" />,
      label: "Open the terminal",
      hint: "try `help` or `neofetch`",
      onClick: () => setTerminalOpen(true),
    },
  ];

  const walkthroughs = [
    {
      file: "portfolio/about.md",
      title: "About me",
      desc: "Who I am, what I build, and the tools I reach for.",
    },
    {
      file: "portfolio/resume.json",
      title: "Resume",
      desc: "Education, experience and strengths — as structured data.",
    },
    {
      file: "portfolio/projects.js",
      title: "Projects",
      desc: "Things I've shipped: editors, whiteboards, chatbots.",
    },
    {
      file: "portfolio/contact.sh",
      title: "Contact",
      desc: "Currently open to new opportunities. Say hello.",
    },
  ];

  return (
    <div className="welcome-grid h-full overflow-y-auto">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:gap-12 sm:px-10 sm:py-12 lg:grid-cols-[1.4fr,1fr] lg:py-20">
        {/* left column — hero + start + recent */}
        <div className="min-w-0">
          <p className="animate-fade-up font-mono text-sm text-ide-accent">
            {"// Hi, my name is"}
          </p>
          <h1 className="animate-fade-up stagger-1 mt-2 text-4xl font-bold tracking-tight text-ide-text sm:mt-3 sm:text-5xl lg:text-6xl">
            Ankit Rao
            <span className="text-ide-accent">.</span>
          </h1>
          <p className="stagger-2 mt-3 overflow-hidden font-mono text-sm text-ide-muted sm:text-lg lg:text-xl">
            <span className="typing">
              <span className="text-syn-punct">$</span> whoami → {profile.role}
            </span>
          </p>
          <p className="animate-fade-up stagger-3 mt-5 max-w-xl text-sm leading-relaxed text-ide-muted sm:mt-6 sm:text-base">
            {profile.tagline} This portfolio is itself a small IDE — browse the
            files on the left, or create a{" "}
            <span className="font-mono text-syn-func">.c</span>,{" "}
            <span className="font-mono text-syn-type">.py</span> or{" "}
            <span className="font-mono text-syn-keyword">.js</span> file and
            run it right here in your browser.
          </p>

          <div className="animate-fade-up stagger-4 mt-8">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-ide-faint">
              Start
            </h2>
            <div className="space-y-1">
              {startActions.map((a) => (
                <button
                  key={a.label}
                  onClick={a.onClick}
                  className="group flex w-full items-center gap-3 border border-ide-border bg-ide-sidebar/70 px-3 py-3 text-left transition-all hover:-translate-y-px hover:border-ide-accentDim sm:px-4"
                >
                  <span className="shrink-0 text-ide-accent">{a.icon}</span>
                  <span className="min-w-0 truncate font-mono text-[13px] text-ide-text sm:text-sm">
                    {a.label}
                  </span>
                  <span className="ml-auto hidden shrink-0 text-xs text-ide-faint lg:block">
                    {a.hint}
                  </span>
                  <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-ide-faint transition-transform group-hover:translate-x-0.5 group-hover:text-ide-accent lg:ml-0" />
                </button>
              ))}
            </div>
          </div>

          <div className="animate-fade-up stagger-5 mt-8">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-ide-faint">
              Recent · shipped projects
            </h2>
            <div className="space-y-1 font-mono text-sm">
              {projects.map((p) => (
                <a
                  key={p.name}
                  href={p.live}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-2 px-1 py-1.5 text-ide-muted hover:text-ide-accent"
                >
                  <FileIcon path={`x.${p.language}`} />
                  <span className="min-w-0 truncate">
                    {p.name.toLowerCase().replace(/\s+/g, "-")}
                  </span>
                  <span className="hidden shrink-0 text-ide-faint group-hover:text-ide-faint sm:inline">
                    ~/projects
                  </span>
                  <ExternalIcon className="touch-always-visible h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* right column — walkthroughs */}
        <div className="animate-fade-up stagger-3 min-w-0">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-ide-faint">
            Walkthroughs
          </h2>
          <div className="space-y-3">
            {walkthroughs.map((w) => (
              <button
                key={w.file}
                onClick={() => openFile(w.file)}
                className="group block w-full border border-ide-border bg-ide-sidebar/70 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-ide-accentDim hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
              >
                <div className="flex items-center gap-1.5">
                  <FileIcon path={w.file} />
                  <span className="min-w-0 truncate font-mono text-xs text-ide-faint group-hover:text-ide-accent">
                    {w.file}
                  </span>
                </div>
                <p className="mt-2 font-medium text-ide-text">{w.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-ide-muted">{w.desc}</p>
              </button>
            ))}
          </div>

          <div className="mt-6 hidden border border-dashed border-ide-border p-4 font-mono text-xs leading-relaxed text-ide-faint lg:block">
            <p className="text-syn-comment">{"/*"}</p>
            <p className="text-syn-comment">
              &nbsp;* Pro tip: press <span className="text-ide-text">⌘P</span> to
              quick-open files,
            </p>
            <p className="text-syn-comment">
              &nbsp;* <span className="text-ide-text">⌘⇧P</span> for the command
              palette,
            </p>
            <p className="text-syn-comment">
              &nbsp;* <span className="text-ide-text">⌃`</span> to toggle the
              terminal.
            </p>
            <p className="text-syn-comment">{" */"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
