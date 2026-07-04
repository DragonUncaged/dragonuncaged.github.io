import React from "react";
import { profile, skills } from "../../data/portfolio";

/** Rendered like a VS Code markdown preview — but with honest `#` markers. */
const AboutPage: React.FC = () => (
  <div className="h-full overflow-y-auto">
    <div className="mx-auto max-w-3xl px-6 py-12 sm:px-10 lg:py-16">
      <h1 className="animate-fade-up border-b border-ide-border pb-4 text-4xl font-bold text-ide-text">
        <span className="mr-3 font-mono text-2xl font-normal text-ide-accent">#</span>
        About Me
      </h1>

      <div className="animate-fade-up stagger-1 mt-8 space-y-5 leading-relaxed text-ide-muted">
        {profile.about.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      <blockquote className="animate-fade-up stagger-2 mt-8 border-l-4 border-ide-accent bg-ide-sidebar/70 px-5 py-4 font-mono text-sm leading-relaxed text-ide-muted">
        <span className="text-syn-comment">{"> "}</span>
        Handle: <span className="text-ide-accent">@{profile.handle}</span> — a
        dragon is just a lizard with excellent version control.
      </blockquote>

      <h2 className="animate-fade-up stagger-3 mt-12 border-b border-ide-border pb-3 text-2xl font-bold text-ide-text">
        <span className="mr-3 font-mono text-lg font-normal text-ide-accent">##</span>
        Technologies I work with
      </h2>

      <div className="animate-fade-up stagger-4 mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {skills.map((s) => (
          <div
            key={s.name}
            className="group flex items-center gap-3 border border-ide-border bg-ide-sidebar/60 px-3 py-2.5 transition-all hover:-translate-y-px hover:border-ide-accentDim"
          >
            <img
              src={s.logo}
              alt=""
              className="h-6 w-6 object-contain transition-transform group-hover:scale-110"
            />
            <span className="truncate text-sm text-ide-muted group-hover:text-ide-text">
              {s.name}
            </span>
          </div>
        ))}
      </div>

      <p className="animate-fade-up stagger-5 mt-10 font-mono text-xs text-ide-faint">
        <span className="text-syn-comment">
          {"<!-- last updated: this page is a living document -->"}
        </span>
      </p>
    </div>
  </div>
);

export default AboutPage;
