import React from "react";
import { profile } from "../../data/portfolio";

const links = [
  { cmd: "mail", label: profile.email, href: `mailto:${profile.email}` },
  { cmd: "github", label: "github.com/DragonUncaged", href: profile.github },
  { cmd: "linkedin", label: "linkedin.com/in/ankitrao", href: profile.linkedin },
  {
    cmd: "codechef",
    label: "codechef.com/users/dragonuncaged",
    href: profile.codechef,
  },
];

/** Styled like the shell script it pretends to be. */
const ContactPage: React.FC = () => (
  <div className="h-full overflow-y-auto">
    <div className="mx-auto max-w-3xl px-6 py-12 sm:px-10 lg:py-16">
      <h1 className="animate-fade-up border-b border-ide-border pb-4 text-4xl font-bold text-ide-text">
        <span className="mr-3 font-mono text-2xl font-normal text-ide-accent">
          $_
        </span>
        Contact
      </h1>

      <div className="animate-fade-up stagger-1 mt-8 border border-ide-border bg-ide-sidebar/60 p-5 font-mono text-sm leading-7 sm:p-6">
        <p className="text-syn-comment">#!/bin/bash</p>
        <p className="text-syn-comment">
          # I'm currently open to new opportunities —
        </p>
        <p className="text-syn-comment">
          # full stack roles, interesting freelance work, or just a good
          conversation.
        </p>
        <p className="mt-4">
          <span className="text-syn-keyword">if</span>{" "}
          <span className="text-syn-punct">[[</span>{" "}
          <span className="text-syn-variable">$YOUR_IDEA</span>{" "}
          <span className="text-syn-punct">==</span>{" "}
          <span className="text-syn-string">"worth building"</span>{" "}
          <span className="text-syn-punct">]];</span>{" "}
          <span className="text-syn-keyword">then</span>
        </p>
        {links.map((l) => (
          <p key={l.cmd} className="pl-6">
            <span className="text-syn-func">{l.cmd.padEnd(9, " ")}</span>
            <a
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="text-syn-string underline-offset-4 hover:text-ide-accent hover:underline"
            >
              "{l.label}"
            </a>
          </p>
        ))}
        <p>
          <span className="text-syn-keyword">fi</span>
          <span className="ml-3 text-syn-comment"># response time: usually &lt; 24h</span>
        </p>
      </div>

      <div className="animate-fade-up stagger-3 mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <a
          href={`mailto:${profile.email}?subject=Hello Ankit!`}
          className="group relative border border-ide-accent bg-ide-accent/10 px-8 py-3.5 font-mono text-ide-accent transition-colors hover:bg-ide-accent hover:text-white"
        >
          ./say-hello.sh
          <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
            →
          </span>
        </a>
        <p className="text-sm text-ide-faint">
          …or just email{" "}
          <span className="font-mono text-ide-muted">{profile.email}</span>
        </p>
      </div>
    </div>
  </div>
);

export default ContactPage;
