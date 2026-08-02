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
    <div className="mx-auto max-w-5xl px-6 py-12 sm:px-10 lg:py-16">
      <h1 className="animate-fade-up border-b border-ide-border pb-4 text-4xl font-bold text-ide-text">
        <span className="mr-3 font-mono text-2xl font-normal text-ide-accent">
          {"</>"}
        </span>
        Projects
      </h1>
      <p className="animate-fade-up stagger-1 mt-4 max-w-2xl leading-relaxed text-ide-muted">
        A few things I've designed, built and shipped. Every card links to a
        live deployment — click through and break things.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {projects.map((p, i) => (
          <a
            key={p.name}
            href={p.live}
            target="_blank"
            rel="noreferrer"
            className={`group animate-fade-up stagger-${i + 2} flex flex-col border border-ide-border bg-ide-sidebar/60 transition-all hover:-translate-y-1 hover:border-ide-accentDim hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)]`}
          >
            {/* faux window header */}
            <div className="flex items-center gap-2 border-b border-ide-border px-4 py-2.5">
              <FileIcon path={`${p.name}.${p.language}`} />
              <span className="font-mono text-sm text-ide-text">
                {p.name.toLowerCase().replace(/\s+/g, "-")}
              </span>
              <span
                className="ml-auto h-2.5 w-2.5 rounded-full"
                style={{ background: langDot[p.language] }}
                title={p.language}
              />
              <ExternalIcon className="h-4 w-4 text-ide-faint transition-colors group-hover:text-ide-accent" />
            </div>

            <div className="flex flex-1 flex-col px-4 py-4">
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

      <p className="animate-fade-up stagger-5 mt-10 font-mono text-sm text-ide-faint">
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
