import React, { useCallback, useRef } from "react";
import Editor, { Monaco, loader } from "@monaco-editor/react";
import { useIDE } from "../ide/IDEContext";
import { VFile } from "../ide/types";

// keep the CDN default, but pin a version for reproducible loads
loader.config({
  paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.47.0/min/vs" },
});

const monacoLanguage: Record<string, string> = {
  javascript: "javascript",
  typescript: "typescript",
  python: "python",
  c: "c",
  cpp: "cpp",
  markdown: "markdown",
  json: "json",
  shell: "shell",
  plaintext: "plaintext",
};

const CodeEditor: React.FC<{ file: VFile }> = ({ file }) => {
  const { updateFile, setCursor, runFile } = useIDE();
  const fileRef = useRef(file.path);
  fileRef.current = file.path;

  const handleMount = useCallback(
    (editor: any, monaco: Monaco) => {
      editor.onDidChangeCursorPosition((e: any) => {
        setCursor({ line: e.position.lineNumber, col: e.position.column });
      });
      // Cmd/Ctrl+Enter runs the current file even while the editor has focus
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
        runFile(fileRef.current);
      });
      editor.focus();
    },
    [setCursor, runFile]
  );

  return (
    <Editor
      path={file.path}
      language={monacoLanguage[file.language] || "plaintext"}
      value={file.content}
      theme="vs-dark"
      onMount={handleMount}
      onChange={(value) => updateFile(file.path, value ?? "")}
      loading={
        <div className="flex h-full w-full items-center justify-center bg-ide-editor font-mono text-sm text-ide-faint">
          loading editor…
        </div>
      }
      options={{
        readOnly: !!file.readOnly,
        fontSize: 14,
        fontFamily: '"JetBrains Mono", ui-monospace, Menlo, monospace',
        fontLigatures: true,
        minimap: { enabled: window.innerWidth >= 1280 },
        scrollBeyondLastLine: false,
        smoothScrolling: true,
        cursorBlinking: "smooth",
        cursorSmoothCaretAnimation: "on",
        renderLineHighlight: "all",
        padding: { top: 14, bottom: 14 },
        tabSize: 4,
        automaticLayout: true,
        scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10 },
        overviewRulerBorder: false,
        contextmenu: true,
      }}
    />
  );
};

export default CodeEditor;
