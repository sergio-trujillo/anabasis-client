// CodeProblemLayout — resizable 2-column problem layout adapted from
// Praxema's ProblemPage. Left: statement / description. Right: editor
// toolbar + Monaco + output panel in a nested vertical split.
//
// Shared by PracticePage, MockExamPage's per-slot runner, and Mock Power
// Day's coding rounds. Hides Praxema's solution tab (Anabasis doesn't
// distribute solutions — D18: solution leak risk).

import { LockIcon } from 'lucide-react'
import { lazy, Suspense, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShadcnMarkdown } from '@/components/ui/shadcn-markdown'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  /** Optional reference solution — rendered in a reveal-on-click "Solution" tab. */
  solution?: {
    code: string
    explanation?: { en: string; es?: string | null }
    complexity?: { en: string; es?: string | null }
  }
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
  solution,
  rightSlot,
  belowStatement,
}: CodeProblemLayoutProps) {
  const { t } = useTranslation()
  const [solutionRevealed, setSolutionRevealed] = useState(false)
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
            <Tabs
              defaultValue="description"
              className="flex-1 min-h-0 flex flex-col"
            >
              <div className="flex h-9 shrink-0 items-center border-b px-1">
                <TabsList variant="line" className="h-7 w-auto justify-start">
                  <TabsTrigger
                    value="description"
                    className="h-5 flex-none gap-1 px-3 text-xs"
                  >
                    {t('problem.description', { defaultValue: 'Description' })}
                  </TabsTrigger>
                  <TabsTrigger
                    value="solution"
                    className="h-5 flex-none gap-1 px-3 text-xs"
                  >
                    {t('problem.solution', { defaultValue: 'Solution' })}
                    {!solutionRevealed && <LockIcon className="size-3" />}
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="relative min-h-0 flex-1">
                <TabsContent
                  value="description"
                  className="absolute inset-0 mt-0 outline-none"
                >
                  <div
                    className="h-full overflow-y-auto"
                    onScroll={(e) => {
                      const top = (e.target as HTMLDivElement).scrollTop
                      setScrolled((prev) => (prev ? top > 12 : top > 28))
                    }}
                  >
                    <div className="px-6 pt-4 pb-6 text-sm text-foreground/90">
                      <ShadcnMarkdown>{bilingual(statement)}</ShadcnMarkdown>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent
                  value="solution"
                  className="absolute inset-0 mt-0 outline-none"
                >
                  <SolutionPanel
                    solution={solution}
                    revealed={solutionRevealed}
                    onReveal={() => setSolutionRevealed(true)}
                  />
                </TabsContent>
              </div>
            </Tabs>
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

function SolutionPanel({
  solution,
  revealed,
  onReveal,
}: {
  solution?: CodeProblemLayoutProps['solution']
  revealed: boolean
  onReveal: () => void
}) {
  const { t } = useTranslation()

  // Revealed with content → full markdown render (Praxema layout).
  if (revealed && solution) {
    return (
      <div className="h-full overflow-y-auto">
        <div className="p-6 space-y-5">
          <pre className="rounded-md border border-border/60 bg-muted/30 p-4 text-xs leading-relaxed overflow-x-auto font-mono">
            <code>{solution.code}</code>
          </pre>

          {solution.explanation && (
            <div className="text-sm text-foreground/90 leading-relaxed">
              <ShadcnMarkdown>{bilingual(solution.explanation)}</ShadcnMarkdown>
            </div>
          )}

          {solution.complexity && (
            <div className="space-y-1.5 border-l-2 border-primary/40 pl-3 py-1 bg-primary/5 rounded-r-md">
              <div className="text-[10px] uppercase tracking-wider text-primary font-semibold">
                {t('problem.complexity', { defaultValue: 'Complexity' })}
              </div>
              <div className="text-sm leading-relaxed">
                <ShadcnMarkdown>{bilingual(solution.complexity)}</ShadcnMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Centered gate — both "solve first" and "not yet authored" share it. Matches
  // Praxema's ProblemView pattern: large muted LockIcon + caption + outline CTA.
  const isAuthored = !!solution
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-muted-foreground">
      <LockIcon className="size-10 opacity-30" />
      <p className="text-sm text-center max-w-xs px-6">
        {isAuthored
          ? t('problem.solveFirst', {
              defaultValue:
                "Solve the problem first, or reveal if you're stuck.",
            })
          : t('problem.solutionPending', {
              defaultValue:
                "The reference solution for this problem hasn't been authored yet. In the meantime, the tests on the right double as a spec of expected behavior.",
            })}
      </p>
      {isAuthored && (
        <Button variant="outline" onClick={onReveal}>
          {t('problem.revealSolution', { defaultValue: 'Reveal solution' })}
        </Button>
      )}
    </div>
  )
}
