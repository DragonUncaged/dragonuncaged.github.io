import React from "react";

interface IconProps {
  className?: string;
  strokeWidth?: number;
}

const base = (
  { className = "w-5 h-5", strokeWidth = 1.5 }: IconProps,
  children: React.ReactNode
) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

export const FilesIcon = (p: IconProps) =>
  base(
    p,
    <>
      <path d="M15 3H8a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7z" />
      <path d="M15 3v4h4" />
      <path d="M7 7H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h9" />
    </>
  );

export const SearchIcon = (p: IconProps) =>
  base(
    p,
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </>
  );

export const GitIcon = (p: IconProps) =>
  base(
    p,
    <>
      <circle cx="6" cy="6" r="2.4" />
      <circle cx="6" cy="18" r="2.4" />
      <circle cx="18" cy="8" r="2.4" />
      <path d="M6 8.4v7.2" />
      <path d="M15.7 9.7C13.5 11.4 8.6 11 6.4 8.6" />
    </>
  );

export const RunIcon = (p: IconProps) =>
  base(
    p,
    <>
      <polygon points="8 5 19 12 8 19 8 5" />
    </>
  );

export const ExtensionsIcon = (p: IconProps) =>
  base(
    p,
    <>
      <rect x="4" y="4" width="7" height="7" rx="1" />
      <rect x="13" y="4" width="7" height="7" rx="1" />
      <rect x="4" y="13" width="7" height="7" rx="1" />
      <rect x="13" y="13" width="7" height="7" rx="1" strokeDasharray="2 2" />
    </>
  );

export const SettingsIcon = (p: IconProps) =>
  base(
    p,
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.09a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.09a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1z" />
    </>
  );

export const AccountIcon = (p: IconProps) =>
  base(
    p,
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
    </>
  );

export const CloseIcon = (p: IconProps) =>
  base(
    p,
    <>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </>
  );

export const ChevronRight = (p: IconProps) =>
  base(p, <path d="m9 18 6-6-6-6" />);

export const ChevronDown = (p: IconProps) =>
  base(p, <path d="m6 9 6 6 6-6" />);

export const PlusIcon = (p: IconProps) =>
  base(
    p,
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  );

export const TrashIcon = (p: IconProps) =>
  base(
    p,
    <>
      <path d="M3 6h18" />
      <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
      <path d="M19 6v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </>
  );

export const TerminalIcon = (p: IconProps) =>
  base(
    p,
    <>
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </>
  );

export const BranchIcon = (p: IconProps) =>
  base(
    p,
    <>
      <circle cx="6" cy="5" r="2.2" />
      <circle cx="6" cy="19" r="2.2" />
      <circle cx="18" cy="9" r="2.2" />
      <path d="M6 7.2v9.6" />
      <path d="M18 11.2c0 3-3 4-6 4" />
    </>
  );

export const ErrorIcon = (p: IconProps) =>
  base(
    p,
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </>
  );

export const WarningIcon = (p: IconProps) =>
  base(
    p,
    <>
      <path d="M12 3 2.5 20h19z" />
      <path d="M12 9.5V14" />
      <path d="M12 17.2v.1" />
    </>
  );

export const BellIcon = (p: IconProps) =>
  base(
    p,
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </>
  );

export const MenuIcon = (p: IconProps) =>
  base(
    p,
    <>
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </>
  );

export const ExternalIcon = (p: IconProps) =>
  base(
    p,
    <>
      <path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6" />
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
    </>
  );

export const SpinnerIcon = ({ className = "w-5 h-5" }: IconProps) => (
  <svg className={`${className} animate-spin-slow`} viewBox="0 0 24 24" fill="none">
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke="currentColor"
      strokeOpacity="0.25"
      strokeWidth="2.5"
    />
    <path
      d="M21 12a9 9 0 0 0-9-9"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

export const CheckIcon = (p: IconProps) =>
  base(p, <polyline points="20 6 9 17 4 12" />);
