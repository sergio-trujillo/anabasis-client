// CodeProblemLayout — resizable 2-column problem layout adapted from
// Praxema's ProblemPage. Left: statement / description. Right: editor
// toolbar + Monaco + output panel in a nested vertical split.
//
// Shared by PracticePage, MockExamPage's per-slot runner, and Mock Power
// Day's coding rounds. Hides Praxema's solution tab (Anabasis doesn't
// distribute solutions — D18: solution leak risk).

import { lazy, Suspense, useRef, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { ShadcnMarkdown } from '@/components/ui/shadcn-markdown'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { Skeleton } from '@/components/ui/skeleton'
import { EditorToolbar } from '@/components/editor/EditorToolbar'
import { OutputPanel } from '@/components/editor/OutputPanel'
import { bilingual } from '@/lib/i18n'
import { useUIStore } from '@/store/ui-store'

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
  /** Optional — rendered under the statement (e.g. "Next problem →" link). */
  belowStatement?: React.ReactNode
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
  belowStatement,
}: CodeProblemLayoutProps) {
  // refs so the toolbar's format / go-to-line hooks can reach the editor
  const onGoToLineRef = useRef<(line: number, col?: number) => void>(() => {})
  const outputPosition = useUIStore((s) => s.outputPosition)
  // Collapse the title into a compact sticky row once the reader has
  // scrolled past the intro block — keeps the title visible without
  // eating vertical space on long statements.
  const [scrolled, setScrolled] = useState(false)

  return (
    <div className="flex h-full min-h-[500px] flex-col overflow-hidden bg-background">
      <ResizablePanelGroup orientation="horizontal" className="flex-1">
        {/* ── Left: statement ── */}
        <ResizablePanel defaultSize={42} minSize={25}>
          <div className="flex h-full flex-col border-r">
            {/* Sticky collapsing header — big title at rest, compact when scrolled */}
            <div
              className={`shrink-0 border-b bg-background/95 backdrop-blur transition-[padding] duration-200 ${
                scrolled ? 'px-4 py-2' : 'px-6 pt-5 pb-3'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <h1
                    className={`font-bold font-heading truncate transition-[font-size,line-height] duration-200 ${
                      scrolled ? 'text-sm leading-tight' : 'text-xl leading-snug'
                    }`}
                    title={bilingual(title)}
                  >
                    {bilingual(title)}
                  </h1>
                  {difficulty && (
                    <Badge
                      variant="outline"
                      className={`shrink-0 transition-all duration-200 ${
                        scrolled ? 'text-[10px] h-4 px-1.5' : 'text-xs h-5'
                      } ${difficultyColors[difficulty] ?? ''}`}
                    >
                      {difficulty}
                    </Badge>
                  )}
                </div>
                {rightSlot}
              </div>
            </div>
            <div
              className="flex-1 overflow-y-auto"
              onScroll={(e) => {
                const top = (e.target as HTMLDivElement).scrollTop
                setScrolled((prev) => (prev ? top > 12 : top > 28))
              }}
            >
              <div className="px-6 pt-4 pb-6 text-sm text-foreground/90">
                <ShadcnMarkdown>{bilingual(statement)}</ShadcnMarkdown>
              </div>
            </div>
            {belowStatement && (
              <div className="shrink-0 border-t bg-background/95 backdrop-blur">
                {belowStatement}
              </div>
            )}
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* ── Right: editor + output (split orientation follows the UI store) ── */}
        <ResizablePanel defaultSize={58} minSize={30}>
          <div className="flex h-full flex-col">
            <EditorToolbar onReset={onReset} onRun={onRun} isRunning={isRunning} />
            <ResizablePanelGroup
              key={outputPosition}
              orientation={outputPosition === 'bottom' ? 'vertical' : 'horizontal'}
              className="flex-1"
            >
              <ResizablePanel defaultSize={outputPosition === 'bottom' ? 70 : 60} minSize={20}>
                <div className="relative h-full min-h-0">
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
              </ResizablePanel>

              <ResizableHandle withHandle />

              <ResizablePanel defaultSize={outputPosition === 'bottom' ? 30 : 40} minSize={10}>
                <OutputPanel
                  // RunResult shapes are duplicated across callers;
                  // OutputPanel's local RunResult matches structurally.
                  result={result as unknown as Parameters<typeof OutputPanel>[0]['result']}
                  isRunning={isRunning}
                  onGoToLine={(line, col) => onGoToLineRef.current?.(line, col)}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
