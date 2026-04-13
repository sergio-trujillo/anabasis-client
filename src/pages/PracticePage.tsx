// Practice page — /:companySlug/practice.
// Random code-problem shuffler over the full code pool.
// 3-panel layout: statement / Monaco editor / test results.
// Uses Praxema's CodeEditor + MagicCard + Fade for visual polish.

import { ShuffleIcon } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { inferRouterOutputs } from '@trpc/server'
import type { AppRouter } from '@server/routers/_app'
import { Fade } from '@/components/animate-ui/primitives/effects/fade'
import { CodeProblemLayout } from '@/components/problem/CodeProblemLayout'
import { Button } from '@/components/ui/button'
import { MagicCard } from '@/components/ui/magic-card'
import { Skeleton } from '@/components/ui/skeleton'
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
    <>
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
    </>
  )
}

function PracticeBoard({ exercise }: { exercise: Code }) {
  const [code, setCode] = useState(exercise.starterCode)
  const runJava = trpc.runner.runJava.useMutation()
  return (
    <CodeProblemLayout
      title={exercise.title}
      statement={exercise.statement}
      difficulty={exercise.difficulty}
      code={code}
      onCodeChange={setCode}
      onRun={() =>
        runJava.mutate({ studentCode: code, testCode: exercise.testCode })
      }
      isRunning={runJava.isPending}
      onReset={() => setCode(exercise.starterCode)}
      result={runJava.data ?? null}
    />
  )
}
