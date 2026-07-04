export type Language =
  | "javascript"
  | "typescript"
  | "python"
  | "c"
  | "cpp"
  | "markdown"
  | "json"
  | "shell"
  | "plaintext";

export type PageId = "welcome" | "about" | "resume" | "projects" | "contact";

export interface VFile {
  /** full path inside the virtual workspace, e.g. "playground/hello.py" */
  path: string;
  language: Language;
  content: string;
  /** custom-rendered portfolio page instead of a text editor */
  page?: PageId;
  readOnly?: boolean;
  /** seeded playground file (restored by `reset` in the terminal) */
  seed?: boolean;
}

export const RUNNABLE: Language[] = ["javascript", "python", "c", "cpp"];

export function fileName(path: string): string {
  return path.split("/").pop() || path;
}

export function dirName(path: string): string {
  const parts = path.split("/");
  return parts.length > 1 ? parts.slice(0, -1).join("/") : "";
}

export function languageFromPath(path: string): Language {
  const ext = path.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "js":
    case "jsx":
    case "mjs":
      return "javascript";
    case "ts":
    case "tsx":
      return "typescript";
    case "py":
      return "python";
    case "c":
    case "h":
      return "c";
    case "cpp":
    case "cc":
    case "cxx":
    case "hpp":
      return "cpp";
    case "md":
      return "markdown";
    case "json":
      return "json";
    case "sh":
      return "shell";
    default:
      return "plaintext";
  }
}

export function languageLabel(lang: Language): string {
  switch (lang) {
    case "javascript":
      return "JavaScript";
    case "typescript":
      return "TypeScript";
    case "python":
      return "Python";
    case "c":
      return "C";
    case "cpp":
      return "C++";
    case "markdown":
      return "Markdown";
    case "json":
      return "JSON";
    case "shell":
      return "Shell Script";
    default:
      return "Plain Text";
  }
}
