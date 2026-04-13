// CodeProblemLayout — resizable 2-column problem layout adapted from
// Praxema's ProblemPage. Left: statement / description. Right: editor
// toolbar + Monaco + output panel in a nested vertical split.
//
// Shared by PracticePage, MockExamPage's per-slot runner, and Mock Power
// Day's coding rounds. Hides Praxema's solution tab (Anabasis doesn't
// distribute solutions — D18: solution leak risk).

import { lazy, Suspense, useRef } from 'react'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { Skeleton } from '@/components/ui/skeleton'
import { EditorToolbar } from '@/components/editor/EditorToolbar'
import { OutputPanel } from '@/components/editor/OutputPanel'
import { bilingual } from '@/lib/i18n'

// Monaco bundle is heavy — keep it lazy so non-coding pages pay 0 KB.
const LazyCodeEditor = lazy(() =>
  import('@/components/editor/CodeEditor').then((m) => ({ default: m.CodeEditor })),
)

type RunResult = {
  success: boolean
  compilationError?: string
  testResults: Array<{
    name: string
    displayName?: string
    status: string
    message?: string
    expected?: string
    actual?: string
  }>
  totalTests: number
  passedTests: number
  failedTests: number
  timeMs: number
}

export interface CodeProblemLayoutProps {
  title: { en: string; es?: string | null }
  statement: { en: string; es?: string | null }
  difficulty?: string
  code: string
  onCodeChange: (v: string) => void
  onRun: () => void
  isRunning: boolean
  onReset?: () => void
  result: RunResult | null
  /** Optional — right-side badge (e.g. "Problem 2 of 4 · 300 pts"). */
  rightSlot?: React.ReactNode
}

const difficultyColors: Record<string, string> = {
  easy: 'bg-green-500/10 text-green-500 border-green-500/20',
  medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  hard: 'bg-red-500/10 text-red-500 border-red-500/20',
}

export function CodeProblemLayout({
  title,
  statement,
  difficulty,
  code,
  onCodeChange,
  onRun,
  isRunning,
  onReset,
  result,
  rightSlot,
}: CodeProblemLayoutProps) {
  // refs so the toolbar's format / go-to-line hooks can reach the editor
  const onGoToLineRef = useRef<(line: number, col?: number) => void>(() => {})

  return (
    <div className="flex h-[calc(100vh-3.5rem-2rem)] min-h-[500px] flex-col rounded-xl border overflow-hidden bg-background">
      <ResizablePanelGroup orientation="horizontal" className="flex-1">
        {/* ── Left: statement ── */}
        <ResizablePanel defaultSize={42} minSize={25}>
          <div className="flex h-full flex-col border-r">
            <div className="flex h-9 shrink-0 items-center justify-between gap-2 border-b px-4">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Description
              </span>
              {rightSlot}
            </div>
            <ScrollArea className="flex-1">
              <div className="p-6">
                <h1 className="text-xl font-bold font-heading">{bilingual(title)}</h1>
                {difficulty && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className={difficultyColors[difficulty] ?? ''}
                    >
                      {difficulty}
                    </Badge>
                  </div>
                )}
                <hr className="mt-4 border-border" />
                <div className="mt-4 text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                  {bilingual(statement)}
                </div>
              </div>
            </ScrollArea>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* ── Right: editor (top) + output (bottom) ── */}
        <ResizablePanel defaultSize={58} minSize={30}>
          <ResizablePanelGroup orientation="vertical">
            {/* Editor + toolbar */}
            <ResizablePanel defaultSize={70} minSize={20}>
              <div className="flex h-full flex-col">
                <EditorToolbar
                  onReset={onReset}
                  onRun={onRun}
                  isRunning={isRunning}
                />
                <div className="relative flex-1 min-h-0">
                  <Suspense fallback={<Skeleton className="h-full w-full rounded-none" />}>
                    <LazyCodeEditor
                      value={code}
                      onChange={onCodeChange}
                      onRun={onRun}
                      onGoToLineRef={(fn) => {
                        onGoToLineRef.current = fn
                      }}
                    />
                  </Suspense>
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Output */}
            <ResizablePanel defaultSize={30} minSize={10}>
              <OutputPanel
                // RunResult shapes are duplicated across callers;
                // OutputPanel's local RunResult matches structurally.
                result={result as unknown as Parameters<typeof OutputPanel>[0]['result']}
                isRunning={isRunning}
                onGoToLine={(line, col) => onGoToLineRef.current?.(line, col)}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
