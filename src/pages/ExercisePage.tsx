// Exercise page — /:companySlug/exercise/:exerciseId.
// Fetches exercise by id, dispatches by type:
//   code               → full-viewport CodeProblemLayout (Praxema-style)
//                        + "next problem" link (sorted easy → hard within
//                        the same section)
//   mcq / open-prompt / interviewer-chat → centered MagicCard

import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Fade } from '@/components/animate-ui/primitives/effects/fade'
import { InterviewerChatExercise } from '@/components/exercise/InterviewerChatExercise'
import { McqExercise } from '@/components/exercise/McqExercise'
import { OpenPromptExercise } from '@/components/exercise/OpenPromptExercise'
import { CodeProblemLayout } from '@/components/problem/CodeProblemLayout'
import { Badge } from '@/components/ui/badge'
import { MagicCard } from '@/components/ui/magic-card'
import { Skeleton } from '@/components/ui/skeleton'
import { bilingual, bilingualList } from '@/lib/i18n'
import { trpc } from '@/lib/trpc'

const DIFF_ORDER: Record<string, number> = { easy: 0, medium: 1, hard: 2 }
const DIFF_COLORS: Record<string, string> = {
  easy: 'bg-green-500/10 text-green-500 border-green-500/20',
  medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  hard: 'bg-red-500/10 text-red-500 border-red-500/20',
}

type ExerciseListItem = {
  id: string
  type: 'mcq' | 'code' | 'open-prompt' | 'interviewer-chat'
  section: string
  title: { en: string; es?: string | null }
  difficulty?: string
}

export function ExercisePage() {
  const { companySlug = '', exerciseId = '' } = useParams()
  const { data, isPending, error } = trpc.exercises.get.useQuery({ id: exerciseId })
  const exercisesQuery = trpc.exercises.list.useQuery()

  if (isPending) {
    return (
      <div className="p-2 w-full space-y-4">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-2 w-full">
        <p className="text-destructive">{error.message}</p>
      </div>
    )
  }

  if (!data) return null

  // Compute sibling exercises in the same section, sorted easy → hard, for
  // the "next problem" link in the description panel.
  const allExercises = (exercisesQuery.data as ExerciseListItem[] | undefined) ?? []
  const siblings = allExercises
    .filter((ex) => ex.section === (data as { section?: string }).section)
    .slice()
    .sort((a, b) => {
      const da = DIFF_ORDER[a.difficulty ?? ''] ?? 99
      const db = DIFF_ORDER[b.difficulty ?? ''] ?? 99
      return da - db
    })
  const currentIdx = siblings.findIndex((ex) => ex.id === exerciseId)
  const prevSibling = currentIdx > 0 ? siblings[currentIdx - 1] : undefined
  const nextSibling = currentIdx >= 0 ? siblings[currentIdx + 1] : undefined

  if (data.type === 'code') {
    return (
      <CodeExerciseRunner
        exercise={data}
        companySlug={companySlug}
        siblingIdx={currentIdx}
        siblingTotal={siblings.length}
        prevSibling={prevSibling}
        nextSibling={nextSibling}
      />
    )
  }

  return (
    <div className="p-2 w-full">
      <Fade>
        <MagicCard className="p-8">
          <h1 className="text-2xl font-bold font-heading mb-6">{bilingual(data.title)}</h1>
          {data.type === 'mcq' && <McqExercise exercise={data} />}
          {data.type === 'open-prompt' && <OpenPromptExercise exercise={data} />}
          {data.type === 'interviewer-chat' && <InterviewerChatExercise exercise={data} />}
        </MagicCard>
      </Fade>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────
// Code runner — Praxema-style full-viewport layout via CodeProblemLayout
// ─────────────────────────────────────────────────────────────────────────

type CodeSolution = {
  code: string
  explanation?: { en: string; es?: string | null }
  complexity?: { en: string; es?: string | null }
}

type CodeExample = {
  input: string
  output: string
  explanation?: { en: string; es?: string | null }
}

type BilingualList = string[] | { en: string[]; es?: string[] | null }

type CodeExercise = {
  id: string
  type: 'code'
  title: { en: string; es?: string | null }
  statement: { en: string; es?: string | null }
  starterCode: string
  testCode: string
  difficulty?: string
  solution?: CodeSolution
  examples?: CodeExample[]
  constraints?: BilingualList
  hints?: BilingualList
}

type Sibling = {
  id: string
  title: { en: string; es?: string | null }
  difficulty?: string
}

function CodeExerciseRunner({
  exercise,
  companySlug,
  siblingIdx,
  siblingTotal,
  prevSibling,
  nextSibling,
}: {
  exercise: CodeExercise
  companySlug: string
  siblingIdx: number
  siblingTotal: number
  prevSibling?: Sibling
  nextSibling?: Sibling
}) {
  const { t } = useTranslation()
  const [code, setCode] = useState(exercise.starterCode)
  const runJava = trpc.runner.runJava.useMutation()

  const rightSlot =
    siblingIdx >= 0 && siblingTotal > 1 ? (
      <Badge variant="outline" className="text-xs font-mono">
        {siblingIdx + 1} / {siblingTotal}
      </Badge>
    ) : exercise.difficulty ? (
      <Badge variant="outline" className={`text-xs ${DIFF_COLORS[exercise.difficulty] ?? ''}`}>
        {exercise.difficulty}
      </Badge>
    ) : undefined

  const belowStatement =
    prevSibling || nextSibling ? (
      <div className="flex h-10 items-stretch">
        <PagerLink
          companySlug={companySlug}
          direction="prev"
          sibling={prevSibling}
          label={t('exercise.prev', { defaultValue: 'Prev' })}
        />
        <PagerLink
          companySlug={companySlug}
          direction="next"
          sibling={nextSibling}
          label={t('exercise.next', { defaultValue: 'Next' })}
        />
      </div>
    ) : null

  const examplesForUI = exercise.examples?.map((ex) => ({
    input: ex.input,
    output: ex.output,
    explanation: ex.explanation ? bilingual(ex.explanation) : undefined,
  }))

  return (
    <div className="h-[calc(100vh-3.5rem)]">
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
        solution={exercise.solution}
        examples={examplesForUI}
        constraints={bilingualList(exercise.constraints)}
        hints={bilingualList(exercise.hints)}
        rightSlot={rightSlot}
        belowStatement={belowStatement}
      />
    </div>
  )
}

function PagerLink({
  companySlug,
  direction,
  sibling,
  label,
}: {
  companySlug: string
  direction: 'prev' | 'next'
  sibling?: Sibling
  label: string
}) {
  const Icon = direction === 'prev' ? ArrowLeftIcon : ArrowRightIcon
  const isPrev = direction === 'prev'

  if (!sibling) {
    return (
      <div
        className={`flex-1 min-w-0 flex items-center gap-2 px-3 text-xs text-muted-foreground/40 ${
          isPrev ? '' : 'justify-end'
        }`}
      >
        {isPrev && <Icon className="size-3.5 shrink-0" />}
        <span className="uppercase tracking-wider text-[10px]">{label}</span>
        {!isPrev && <Icon className="size-3.5 shrink-0" />}
      </div>
    )
  }

  return (
    <Link
      to={`/${companySlug}/exercise/${sibling.id}`}
      className={`group flex-1 min-w-0 flex items-center gap-2 px-3 text-xs text-muted-foreground hover:text-foreground transition-colors ${
        isPrev ? '' : 'justify-end'
      }`}
      title={bilingual(sibling.title)}
    >
      {isPrev && (
        <Icon className="size-3.5 shrink-0 group-hover:-translate-x-0.5 group-hover:text-primary transition" />
      )}
      <span className="uppercase tracking-wider text-[10px] shrink-0">{label}</span>
      <span className="truncate font-medium text-foreground/80 group-hover:text-foreground">
        {bilingual(sibling.title)}
      </span>
      {!isPrev && (
        <Icon className="size-3.5 shrink-0 group-hover:translate-x-0.5 group-hover:text-primary transition" />
      )}
    </Link>
  )
}
