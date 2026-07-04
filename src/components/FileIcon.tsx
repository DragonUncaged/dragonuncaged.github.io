import React from "react";
import { languageFromPath } from "../ide/types";

/** Seti-style colored file glyphs, rendered as tiny typographic badges. */
const badges: Record<string, { label: string; color: string }> = {
  javascript: { label: "JS", color: "#e8c95c" },
  typescript: { label: "TS", color: "#519aba" },
  python: { label: "PY", color: "#519aba" },
  c: { label: "C", color: "#b180d7" },
  cpp: { label: "C+", color: "#519aba" },
  markdown: { label: "M↓", color: "#519aba" },
  json: { label: "{}", color: "#e8c95c" },
  shell: { label: "$_", color: "#89d185" },
  plaintext: { label: "≡", color: "#8d8778" },
};

const FileIcon: React.FC<{ path: string; className?: string }> = ({
  path,
  className = "",
}) => {
  const badge = badges[languageFromPath(path)] || badges.plaintext;
  return (
    <span
      className={`inline-flex w-6 shrink-0 items-center justify-center font-mono text-[10px] font-bold leading-none ${className}`}
      style={{ color: badge.color }}
      aria-hidden
    >
      {badge.label}
    </span>
  );
};

export default FileIcon;
