import React from "react";
import { profile, skills } from "../../data/portfolio";

/** Rendered like a VS Code markdown preview — but with honest `#` markers. */
const AboutPage: React.FC = () => (
  <div className="h-full overflow-y-auto">
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-10 sm:py-12 lg:py-16">
      <h1 className="animate-fade-up border-b border-ide-border pb-4 text-3xl font-bold text-ide-text sm:text-4xl">
        <span className="mr-2 font-mono text-xl font-normal text-ide-accent sm:mr-3 sm:text-2xl">#</span>
        About Me
      </h1>

      <div className="animate-fade-up stagger-1 mt-6 space-y-5 text-sm leading-relaxed text-ide-muted sm:mt-8 sm:text-base">
        {profile.about.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      <blockquote className="animate-fade-up stagger-2 mt-8 break-words border-l-4 border-ide-accent bg-ide-sidebar/70 px-4 py-4 font-mono text-xs leading-relaxed text-ide-muted sm:px-5 sm:text-sm">
        <span className="text-syn-comment">{"> "}</span>
        Handle: <span className="text-ide-accent">@{profile.handle}</span> — EveryWhere.
      </blockquote>

      <h2 className="animate-fade-up stagger-3 mt-10 border-b border-ide-border pb-3 text-xl font-bold text-ide-text sm:mt-12 sm:text-2xl">
        <span className="mr-3 font-mono text-lg font-normal text-ide-accent">##</span>
        Technologies I work with
      </h2>

      <div className="animate-fade-up stagger-4 mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {skills.map((s) => (
          <div
            key={s.name}
            className="group flex min-w-0 items-center gap-2 border border-ide-border bg-ide-sidebar/60 px-2.5 py-2.5 transition-all hover:-translate-y-px hover:border-ide-accentDim sm:gap-3 sm:px-3"
          >
            <img
              src={s.logo}
              alt=""
              className="h-5 w-5 shrink-0 object-contain transition-transform group-hover:scale-110 sm:h-6 sm:w-6"
            />
            <span className="truncate text-xs text-ide-muted group-hover:text-ide-text sm:text-sm">
              {s.name}
            </span>
          </div>
        ))}
      </div>

      <p className="animate-fade-up stagger-5 mt-10 break-words font-mono text-[11px] text-ide-faint sm:text-xs">
        <span className="text-syn-comment">
          {"<!-- last updated: this page is a living document -->"}
        </span>
      </p>
    </div>
  </div>
);

export default AboutPage;
