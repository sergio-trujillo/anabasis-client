// Section page — /:companySlug/section/:sectionId
// Lists all exercises whose `section` matches :sectionId.
// Special-cases "gca-mock" / "power-day-mock" by redirecting to the
// dedicated timed pages.
//
// Layout: hero header (section name + kind + counts) + shadcn data
// table of exercises (type, difficulty, title, quick-open link).
// Praxema-style polish via Fade + GradientText + MagicCard.

import { Link, Navigate, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import {
  BookOpenIcon,
  BotIcon,
  BracesIcon,
  BriefcaseIcon,
  ChevronRightIcon,
  FileCode2Icon,
  MessageSquareIcon,
  TimerIcon,
  UsersIcon,
} from 'lucide-react'
import { Fade } from '@/components/animate-ui/primitives/effects/fade'
import { GradientText } from '@/components/animate-ui/primitives/texts/gradient'
import { ExercisesDataTable } from '@/components/problem/ExercisesDataTable'
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern'
import { Badge } from '@/components/ui/badge'
import { MagicCard } from '@/components/ui/magic-card'
import { Skeleton } from '@/components/ui/skeleton'
import { trpc } from '@/lib/trpc'

function iconForKind(kind: string) {
  switch (kind) {
    case 'code':
      return FileCode2Icon
    case 'code+defense':
      return BracesIcon
    case 'timed':
    case 'mock-loop':
      return TimerIcon
    case 'lesson+drills':
      return BookOpenIcon
    case 'interviewer-chat':
      return BotIcon
    case 'behavioral':
      return UsersIcon
    case 'business-case':
      return BriefcaseIcon
    default:
      return MessageSquareIcon
  }
}

function kindLabel(kind: string): string {
  switch (kind) {
    case 'code':
      return 'Coding'
    case 'code+defense':
      return 'Coding + defense'
    case 'timed':
      return 'Timed exam'
    case 'mock-loop':
      return 'Mock loop'
    case 'lesson+drills':
      return 'Lesson + drills'
    case 'interviewer-chat':
      return 'Interviewer chat'
    case 'behavioral':
      return 'Behavioral'
    case 'business-case':
      return 'Business case'
    default:
      return kind
  }
}

type ExerciseListItem = {
  id: string
  type: 'mcq' | 'code' | 'open-prompt' | 'interviewer-chat'
  section: string
  title: { en: string; es?: string | null }
  difficulty?: string
}

export function SectionPage() {
  const { t } = useTranslation()
  const { companySlug = '', sectionId = '' } = useParams()

  // Redirect mock sections to their dedicated timed pages.
  if (sectionId === 'gca-mock') {
    return <Navigate to={`/${companySlug}/mock-gca`} replace />
  }
  if (sectionId === 'power-day-mock') {
    return <Navigate to={`/${companySlug}/mock-power-day`} replace />
  }

  const companyQuery = trpc.companies.get.useQuery({ slug: companySlug })
  const exercisesQuery = trpc.exercises.list.useQuery()

  const loop = (
    companyQuery.data as
      | {
          loop: {
            phases: Array<{
              id: string
              name: string
              sections: Array<{ id: string; name: string; kind: string }>
            }>
          } | null
        }
      | undefined
  )?.loop

  const section = loop?.phases
    .flatMap((p) => p.sections.map((s) => ({ ...s, phaseName: p.name })))
    .find((s) => s.id === sectionId)

  const allExercises = (exercisesQuery.data as ExerciseListItem[] | undefined) ?? []
  // Sort easy → medium → hard so the progression feels like Praxema
  // (ramp-up instead of random order). Exercises without difficulty
  // sink to the bottom.
  const DIFF_ORDER: Record<string, number> = { easy: 0, medium: 1, hard: 2 }
  const filtered = allExercises
    .filter((ex) => ex.section === sectionId)
    .slice()
    .sort((a, b) => {
      const da = DIFF_ORDER[a.difficulty ?? ''] ?? 99
      const db = DIFF_ORDER[b.difficulty ?? ''] ?? 99
      return da - db
    })

  const isPending = companyQuery.isPending || exercisesQuery.isPending
  const Icon = iconForKind(section?.kind ?? 'default')

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="relative min-h-[calc(100vh-3.5rem)]">
        <AnimatedGridPattern
          numSquares={36}
          maxOpacity={0.06}
          duration={3}
          className="absolute inset-0 -z-10 [mask-image:radial-gradient(700px_circle_at_top,white,transparent)]"
        />
        <div className="relative p-2 w-full space-y-4">
      {isPending && (
        <div className="space-y-4">
          <Skeleton className="h-10 w-80" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      )}

      {!isPending && (
        <>
          <Fade>
            <header className="flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-border">
                <Icon className="size-4" />
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Link
                    to={`/${companySlug}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {(companyQuery.data as { company?: { name?: string } } | undefined)?.company
                      ?.name ?? 'Company'}
                  </Link>
                  {section && (
                    <>
                      <ChevronRightIcon className="size-3" />
                      <span>{section.phaseName}</span>
                    </>
                  )}
                </div>
                <h1 className="text-lg font-bold font-heading tracking-tight truncate leading-tight">
                  <GradientText
                    text={section?.name ?? sectionId}
                    gradient="linear-gradient(90deg, var(--primary) 0%, var(--chart-2) 50%, var(--primary) 100%)"
                  />
                </h1>
              </div>
              {section && (
                <Badge variant="outline" className="text-[10px] shrink-0">
                  {kindLabel(section.kind)}
                </Badge>
              )}
            </header>
          </Fade>

          {filtered.length === 0 ? (
            <Fade delay={0.1}>
              <MagicCard className="p-10 text-center">
                <p className="text-sm text-muted-foreground">
                  {section
                    ? t('section.empty', {
                        defaultValue:
                          'No exercises authored yet for this section. Content authoring is ongoing.',
                      })
                    : t('section.notFound', {
                        defaultValue: 'Section not listed in the company loop.',
                      })}
                </p>
                <Link
                  to={`/${companySlug}`}
                  className="inline-flex items-center gap-1 text-xs text-primary mt-4 hover:underline"
                >
                  <ChevronRightIcon className="size-3 rotate-180" />
                  {t('section.backToCompany', { defaultValue: 'Back to company' })}
                </Link>
              </MagicCard>
            </Fade>
          ) : (
            <Fade delay={0.1}>
              <ExercisesDataTable companySlug={companySlug} exercises={filtered} />
            </Fade>
          )}
        </>
      )}
        </div>
      </div>
    </div>
  )
}

