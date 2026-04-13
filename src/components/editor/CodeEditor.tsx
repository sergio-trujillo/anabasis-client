import Editor, { type OnMount } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'
import { useRef } from 'react'
import { useTheme } from '@/components/theme-provider'
import { useUIStore, EDITOR_FONT_FAMILIES } from '@/store/ui-store'
import { MONACO_THEMES } from './monaco-themes'
import { registerJavaCompletions } from './java-completions'
import { Skeleton } from '@/components/ui/skeleton'

type CodeEditorProps = {
  value: string
  onChange?: (value: string) => void
  onFormatRef?: (fn: () => string) => void
  onGoToLineRef?: (fn: (line: number, col?: number) => void) => void
  onRun?: () => void
  onSubmit?: () => void
  readOnly?: boolean
}

let initialized = false

function initializeMonaco(monaco: typeof import('monaco-editor')) {
  if (initialized) return
  for (const [, { name, data }] of Object.entries(MONACO_THEMES)) {
    monaco.editor.defineTheme(name, data)
  }
  registerJavaCompletions(monaco)
  initialized = true
}

function getFontValue(id: string): string {
  return EDITOR_FONT_FAMILIES.find((f) => f.id === id)?.value ?? EDITOR_FONT_FAMILIES[0].value
}

function formatJava(code: string): string {
  const lines = code.split('\n')
  const result: string[] = []
  let indent = 0
  let inBlockComment = false
  let prevWasBlank = false

  for (const rawLine of lines) {
    const trimmed = rawLine.trim()

    // Block comments
    if (inBlockComment) {
      result.push('    '.repeat(indent) + ' ' + trimmed)
      if (trimmed.includes('*/')) inBlockComment = false
      prevWasBlank = false
      continue
    }
    if (trimmed.startsWith('/*')) {
      inBlockComment = !trimmed.includes('*/')
    }

    // Collapse multiple blank lines
    if (!trimmed) {
      if (!prevWasBlank) result.push('')
      prevWasBlank = true
      continue
    }
    prevWasBlank = false

    // Strip strings to avoid counting braces inside them
    const noStrings = trimmed
      .replace(/"(?:[^"\\]|\\.)*"/g, '""')
      .replace(/'(?:[^'\\]|\\.)*'/g, "''")

    const opens = (noStrings.match(/\{/g) || []).length
    const closes = (noStrings.match(/\}/g) || []).length

    // Decrease indent BEFORE printing for each closing brace
    indent = Math.max(0, indent - closes)

    result.push('    '.repeat(indent) + trimmed)

    // Increase indent AFTER printing for each opening brace
    indent += opens
  }

  // Trim trailing blank lines
  while (result.length > 0 && result[result.length - 1].trim() === '') {
    result.pop()
  }

  return result.join('\n') + '\n'
}

export function CodeEditor({ value, onChange, onFormatRef, onGoToLineRef, onRun, onSubmit, readOnly = false }: CodeEditorProps) {
  const { theme } = useTheme()
  const editorFontSize = useUIStore((s) => s.editorFontSize)
  const editorFontFamily = useUIStore((s) => s.editorFontFamily)
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const onRunRef = useRef(onRun)
  const onSubmitRef = useRef(onSubmit)
  onRunRef.current = onRun
  onSubmitRef.current = onSubmit
  // MONACO_THEMES is Partial<> — fallback to 'lone-dusk-bro' for theme entries without a Monaco definition.
  const monacoTheme = MONACO_THEMES[theme]?.name ?? 'lone-dusk-bro'
  const fontFamily = getFontValue(editorFontFamily)

  const handleMount: OnMount = (editorInstance, monaco) => {
    editorRef.current = editorInstance
    initializeMonaco(monaco)
    monaco.editor.setTheme(monacoTheme)
    onFormatRef?.(() => {
      const model = editorInstance.getModel()
      if (!model) return ''
      return formatJava(model.getValue())
    })
    onGoToLineRef?.((line, col = 1) => {
      editorInstance.revealLineInCenter(line)
      editorInstance.setPosition({ lineNumber: line, column: col })
      editorInstance.focus()
    })

    // Ctrl/Cmd+Enter → Run
    editorInstance.addAction({
      id: 'anabasis-run',
      label: 'Run Code',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
      run: () => onRunRef.current?.(),
    })

    // Ctrl/Cmd+Shift+Enter → Submit
    editorInstance.addAction({
      id: 'anabasis-submit',
      label: 'Submit Solution',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter],
      run: () => onSubmitRef.current?.(),
    })
  }

  return (
    <Editor
      height="100%"
      language="java"
      theme={monacoTheme}
      value={value}
      onChange={(v) => onChange?.(v ?? '')}
      beforeMount={initializeMonaco}
      onMount={handleMount}
      loading={<EditorSkeleton />}
      options={{
        minimap: { enabled: false },
        fixedOverflowWidgets: true,
        fontSize: editorFontSize,
        fontFamily,
        fontLigatures: true,
        padding: { top: 16, bottom: 16 },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 4,
        insertSpaces: true,
        renderLineHighlight: 'line',
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on',
        smoothScrolling: true,
        bracketPairColorization: { enabled: true },
        guides: {
          bracketPairs: true,
          indentation: true,
        },
        suggest: {
          showKeywords: true,
          showSnippets: true,
          maxVisibleSuggestions: 4,
        } as editor.ISuggestOptions,
        quickSuggestions: {
          other: true,
          comments: false,
          strings: false,
        },
        readOnly,
      }}
    />
  )
}

function EditorSkeleton() {
  return (
    <div className="flex h-full flex-col gap-2 p-4">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-4 w-56" />
      <Skeleton className="h-4 w-36" />
      <Skeleton className="h-4 w-44" />
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-4 w-52" />
    </div>
  )
}
