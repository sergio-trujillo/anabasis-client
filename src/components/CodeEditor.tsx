// CodeEditor — lazy-loaded Monaco wrapper.
//
// Monaco is a heavy dependency (~1.5 MB). We load it via React.lazy so
// the initial bundle stays small — pages that don't render a code
// editor never pay the cost. The Suspense fallback is a plain
// <textarea> that accepts input while Monaco spins up, so the UX stays
// responsive on a cold route.
//
// Local-first discipline: we pass the `monaco-editor` module explicitly
// into the @monaco-editor/react loader so NO network fetch happens —
// Vite bundles Monaco from node_modules. This matches Anabasis's
// "your answers never leave your machine" promise.
//
// Theme integration: useTheme() → `vs-dark` or `vs`. Re-renders cleanly
// when the user toggles "D".

import * as React from "react";
import { useTheme } from "./theme-provider";
import { BASE_THEMES } from "./theme-provider";

// Suspense fallback — plain textarea, same visual footprint as Monaco
// will occupy so there's no layout shift.
function EditorFallback({
  value,
  onChange,
  className,
  height,
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  height: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      spellCheck={false}
      className={`w-full font-mono text-[13px] resize-none rounded-md border bg-background p-3 outline-none ${className ?? ""}`}
      style={{ height }}
    />
  );
}

// The heavy import is isolated in its own module so React.lazy can
// split it cleanly. See CodeEditorInner.tsx.
const MonacoEditor = React.lazy(() => import("./CodeEditorInner"));

export type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  height?: number;
  language?: string;
};

export function CodeEditor({
  value,
  onChange,
  className,
  height = 320,
  language = "java",
}: CodeEditorProps) {
  const { theme } = useTheme();
  const monacoTheme = BASE_THEMES[theme].mode === "dark" ? "vs-dark" : "vs";

  return (
    <div className={`relative rounded-md border overflow-hidden ${className ?? ""}`} style={{ height }}>
      <React.Suspense
        fallback={
          <EditorFallback
            value={value}
            onChange={onChange}
            height={height}
            className="border-0 rounded-none"
          />
        }
      >
        <MonacoEditor
          value={value}
          onChange={onChange}
          height={height}
          language={language}
          theme={monacoTheme}
        />
      </React.Suspense>
    </div>
  );
}
