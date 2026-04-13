// Practice page — /:companySlug/practice.
// Random code-problem shuffler over the full code pool.
// 3-panel layout: statement / Monaco editor / test results.
// Uses Praxema's CodeEditor + MagicCard + Fade for visual polish.

import { RotateCcwIcon, ShuffleIcon } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { inferRouterOutputs } from '@trpc/server'
import type { AppRouter } from '@server/routers/_app'
import { Fade } from '@/components/animate-ui/primitives/effects/fade'
import { CodeEditor } from '@/components/editor/CodeEditor'
import { AppLayout } from '@/components/layout/AppLayout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MagicCard } from '@/components/ui/magic-card'
import { Skeleton } from '@/components/ui/skeleton'
import { bilingual } from '@/lib/i18n'
import { trpc } from '@/lib/trpc'

type ExerciseListItem = inferRouterOutputs<AppRouter>['exercises']['list'][number]
type Code = Extract<ExerciseListItem, { type: 'code' }>

function pickRandom<T>(arr: T[], notId?: string): T | undefined {
  if (arr.length === 0) return undefined
  const pool =
    notId && arr.length > 1
      ? arr.filter((x) => (x as { id?: string }).id !== notId)
      : arr
  return pool[Math.floor(Math.random() * pool.length)]
}

export function PracticePage() {
  const { t } = useTranslation()
  const exercisesQuery = trpc.exercises.list.useQuery()

  const [currentId, setCurrentId] = useState<string | null>(null)
  const codePool: Code[] =
    exercisesQuery.data?.filter((ex): ex is Code => ex.type === 'code') ?? []

  const current = currentId
    ? codePool.find((ex) => ex.id === currentId)
    : pickRandom(codePool)

  if (!currentId && current) {
    setCurrentId(current.id)
  }

  return (
    <AppLayout>
      <div className="px-6 py-6 max-w-7xl mx-auto w-full space-y-6">
        <Fade>
          <header className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold font-heading">{t('practice.title')}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {t('practice.subtitle')}
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => {
                const next = pickRandom(codePool, currentId ?? undefined)
                if (next) setCurrentId(next.id)
              }}
              disabled={codePool.length <= 1}
            >
              <ShuffleIcon className="size-4" />
              {t('practice.nextProblem')}
            </Button>
          </header>
        </Fade>

        {exercisesQuery.isPending && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Skeleton className="h-96 rounded-lg" />
            <Skeleton className="h-96 rounded-lg" />
          </div>
        )}

        {exercisesQuery.data && codePool.length === 0 && (
          <MagicCard className="p-8 text-center text-muted-foreground">
            {t('practice.emptyPool')}
          </MagicCard>
        )}

        {current && <PracticeBoard key={current.id} exercise={current} />}
      </div>
    </AppLayout>
  )
}

function PracticeBoard({ exercise }: { exercise: Code }) {
  const { t } = useTranslation()
  const [code, setCode] = useState(exercise.starterCode)
  const runJava = trpc.runner.runJava.useMutation()
  const data = runJava.data

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <MagicCard className="lg:row-span-2 min-h-[300px] p-6">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h2 className="text-base font-heading font-semibold">
            {bilingual(exercise.title)}
          </h2>
          <Badge variant="outline">{exercise.difficulty}</Badge>
        </div>
        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
          {bilingual(exercise.statement)}
        </p>
      </MagicCard>

      <MagicCard className="lg:col-span-2 p-4">
        <div className="flex flex-row items-center justify-between gap-2 pb-3">
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-normal">
            {t('practice.editorLabel')} · Solution.java
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCode(exercise.starterCode)}
            disabled={code === exercise.starterCode}
            title={t('practice.resetCode')}
          >
            <RotateCcwIcon className="size-3.5" />
          </Button>
        </div>
        <div className="h-[320px] rounded-md overflow-hidden border">
          <CodeEditor value={code} onChange={setCode} />
        </div>
        <div className="flex justify-end mt-3">
          <Button
            onClick={() =>
              runJava.mutate({ studentCode: code, testCode: exercise.testCode })
            }
            disabled={runJava.isPending}
          >
            {runJava.isPending ? t('code.running') : t('code.run')}
          </Button>
        </div>
      </MagicCard>

      <MagicCard className="lg:col-span-2 p-4">
        <div className="pb-3">
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-normal">
            {t('practice.resultsLabel')}
          </span>
        </div>
        <div className="space-y-3">
          {!data && !runJava.isPending && (
            <p className="text-sm text-muted-foreground">{t('practice.noResultsYet')}</p>
          )}

          {data && (
            <>
              <div className="flex items-center gap-3">
                <Badge variant={data.success ? 'default' : 'destructive'}>
                  {data.success ? t('code.pass') : t('code.fail')}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {t('code.testsSummary', {
                    passed: data.passedTests,
                    total: data.totalTests,
                    ms: data.timeMs,
                  })}
                </span>
              </div>

              {data.compilationError && (
                <pre className="text-xs text-destructive whitespace-pre-wrap bg-muted rounded p-3 overflow-x-auto font-mono">
                  {data.compilationError}
                </pre>
              )}

              {data.testResults.length > 0 && (
                <ul className="space-y-1">
                  {data.testResults.map((r, i) => (
                    <li
                      key={`${r.name}-${i}`}
                      className="text-xs flex items-start gap-2 text-foreground"
                    >
                      <span className="font-mono">{r.status === 'passed' ? '✓' : '✗'}</span>
                      <span className="flex-1">
                        <code className="font-mono">{r.displayName || r.name}</code>
                        {r.message && <div className="text-destructive mt-0.5">{r.message}</div>}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </MagicCard>
    </div>
  )
}
