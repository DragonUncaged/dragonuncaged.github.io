import React from "react";
import { profile, resume } from "../../data/portfolio";

/* Tiny helpers to render syntax-colored JSON with a line-number gutter. */
const Key: React.FC<{ k: string; last?: boolean }> = ({ k }) => (
  <>
    <span className="text-syn-variable">"{k}"</span>
    <span className="text-syn-punct">: </span>
  </>
);
const Str: React.FC<{ v: string; comma?: boolean }> = ({ v, comma }) => (
  <>
    <span className="text-syn-string">"{v}"</span>
    {comma && <span className="text-syn-punct">,</span>}
  </>
);
const P: React.FC<{ c: string }> = ({ c }) => (
  <span className="text-syn-punct">{c}</span>
);

const ResumePage: React.FC = () => {
  const rows: { indent: number; node: React.ReactNode }[] = [];
  const push = (indent: number, node: React.ReactNode) =>
    rows.push({ indent, node });

  push(0, <P c="{" />);
  push(1, (
    <>
      <Key k="name" />
      <Str v={profile.name} comma />
    </>
  ));
  push(1, (
    <>
      <Key k="role" />
      <Str v={profile.role} comma />
    </>
  ));
  push(1, (
    <>
      <Key k="status" />
      <span className="text-syn-string">"open_to_opportunities"</span>
      <span className="text-syn-punct">,</span>
      <span className="ml-3 text-syn-comment">{"// 🟢 actively interviewing"}</span>
    </>
  ));

  // education
  push(1, (
    <>
      <Key k="education" />
      <P c="[{" />
    </>
  ));
  const edu = resume.education[0];
  push(2, <><Key k="institution" /><Str v={edu.institution} comma /></>);
  push(2, <><Key k="degree" /><Str v={edu.degree} comma /></>);
  push(2, <><Key k="period" /><Str v={edu.period} /></>);
  push(1, <P c="}]," />);

  // experience
  push(1, (
    <>
      <Key k="experience" />
      <P c="[{" />
    </>
  ));
  const job = resume.experience[0];
  push(2, <><Key k="company" /><Str v={job.company} comma /></>);
  push(2, <><Key k="role" /><Str v={job.role} comma /></>);
  push(2, <><Key k="period" /><Str v={job.period} comma /></>);
  push(2, <><Key k="location" /><Str v={job.location} comma /></>);
  push(2, <><Key k="highlights" /><P c="[" /></>);
  job.highlights.forEach((h, i) =>
    push(3, <Str v={h} comma={i < job.highlights.length - 1} />)
  );
  push(2, <P c="]" />);
  push(1, <P c="}]," />);

  // strengths
  push(1, <><Key k="strengths" /><P c="[" /></>);
  resume.strengths.forEach((s, i) =>
    push(2, <Str v={s} comma={i < resume.strengths.length - 1} />)
  );
  push(1, <P c="]" />);
  push(0, <P c="}" />);

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-10 lg:py-16">
        <div className="animate-fade-up flex items-end justify-between border-b border-ide-border pb-4">
          <h1 className="text-4xl font-bold text-ide-text">
            <span className="mr-3 font-mono text-2xl font-normal text-ide-accent">
              {"{}"}
            </span>
            Resume
          </h1>
          <span className="hidden font-mono text-xs text-ide-faint sm:block">
            schema: human/v1 · validated ✓
          </span>
        </div>

        <div className="animate-fade-up stagger-2 mt-8 overflow-x-auto border border-ide-border bg-ide-sidebar/50 py-4 font-mono text-[13px] leading-6">
          {rows.map((row, i) => (
            <div
              key={i}
              className="flex whitespace-pre px-0 hover:bg-ide-hover/60"
            >
              <span className="w-12 shrink-0 select-none pr-4 text-right text-ide-faint/60">
                {i + 1}
              </span>
              <span style={{ paddingLeft: row.indent * 20 }}>{row.node}</span>
            </div>
          ))}
        </div>

        <div className="animate-fade-up stagger-3 mt-8 flex flex-wrap gap-3">
          <a
            href={`mailto:${profile.email}?subject=Opportunity for Ankit`}
            className="border border-ide-accent bg-ide-accent/10 px-5 py-2.5 font-mono text-sm text-ide-accent transition-colors hover:bg-ide-accent hover:text-white"
          >
            $ mail --to ankit
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="border border-ide-border px-5 py-2.5 font-mono text-sm text-ide-muted transition-colors hover:border-ide-accentDim hover:text-ide-text"
          >
            $ open linkedin ↗
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResumePage;
