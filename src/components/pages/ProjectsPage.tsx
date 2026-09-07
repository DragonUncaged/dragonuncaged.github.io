import React from "react";
import { projects } from "../../data/portfolio";
import FileIcon from "../FileIcon";
import { ExternalIcon } from "../Icons";

const langDot: Record<string, string> = {
  js: "#e8c95c",
  ts: "#6a9fd8",
  py: "#8fb8a5",
};

const ProjectsPage: React.FC = () => (
  <div className="h-full overflow-y-auto">
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-10 sm:py-12 lg:py-16">
      <h1 className="animate-fade-up border-b border-ide-border pb-4 text-3xl font-bold text-ide-text sm:text-4xl">
        <span className="mr-2 font-mono text-xl font-normal text-ide-accent sm:mr-3 sm:text-2xl">
          {"</>"}
        </span>
        Projects
      </h1>
      <p className="animate-fade-up stagger-1 mt-4 max-w-2xl text-sm leading-relaxed text-ide-muted sm:text-base">
        A few things I've designed, built and shipped. Every card links to a
        live deployment — click through and break things.
      </p>

      <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-5 sm:grid-cols-2">
        {projects.map((p, i) => (
          <a
            key={p.name}
            href={p.live}
            target="_blank"
            rel="noreferrer"
            className={`group animate-fade-up stagger-${i + 2} flex flex-col border border-ide-border bg-ide-sidebar/60 transition-all hover:-translate-y-1 hover:border-ide-accentDim hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)]`}
          >
            {/* faux window header */}
            <div className="flex min-w-0 items-center gap-2 border-b border-ide-border px-3 py-2.5 sm:px-4">
              <FileIcon path={`${p.name}.${p.language}`} />
              <span className="min-w-0 truncate font-mono text-sm text-ide-text">
                {p.name.toLowerCase().replace(/\s+/g, "-")}
              </span>
              <span
                className="ml-auto h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: langDot[p.language] }}
                title={p.language}
              />
              <ExternalIcon className="h-4 w-4 shrink-0 text-ide-faint transition-colors group-hover:text-ide-accent" />
            </div>

            <div className="flex flex-1 flex-col px-3 py-4 sm:px-4">
              <p className="text-sm leading-relaxed text-ide-muted">
                {p.description}
              </p>
              <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                {p.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-sm bg-ide-active px-2 py-0.5 font-mono text-[11px] text-syn-type"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </a>
        ))}
      </div>

      <p className="animate-fade-up stagger-5 mt-10 break-words font-mono text-xs text-ide-faint sm:text-sm">
        <span className="text-syn-comment">
          {"// more experiments live at "}
        </span>
        <a
          href="https://github.com/DragonUncaged"
          target="_blank"
          rel="noreferrer"
          className="text-ide-accent hover:underline"
        >
          github.com/DragonUncaged
        </a>
      </p>
    </div>
  </div>
);

export default ProjectsPage;
