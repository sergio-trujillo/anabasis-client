// CodeEditorInner — the heavy half of CodeEditor, isolated so
// React.lazy can split it into its own chunk.
//
// We wire @monaco-editor/react's `loader.config({ monaco })` so Monaco
// is served from node_modules (bundled by Vite), not the default CDN.
// This is required for Anabasis's local-first guarantee.

import Editor, { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { useEffect } from "react";

// One-time wiring — idempotent on repeat calls.
loader.config({ monaco });

export default function CodeEditorInner({
  value,
  onChange,
  height,
  language,
  theme,
}: {
  value: string;
  onChange: (v: string) => void;
  height: number;
  language: string;
  theme: "vs" | "vs-dark";
}) {
  // Monaco takes its own lifecycle — no cleanup needed when React unmounts
  // because @monaco-editor/react disposes the instance for us.
  useEffect(() => {
    // placeholder for future editor wiring (snippets, completions, etc.)
  }, []);

  return (
    <Editor
      value={value}
      onChange={(v) => onChange(v ?? "")}
      height={height}
      language={language}
      theme={theme}
      options={{
        fontSize: 13,
        fontFamily: "'Fira Code Variable', 'Fira Code', monospace",
        fontLigatures: true,
        tabSize: 4,
        insertSpaces: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: "on",
        padding: { top: 12, bottom: 12 },
        smoothScrolling: true,
        renderLineHighlight: "gutter",
        bracketPairColorization: { enabled: true },
      }}
    />
  );
}
