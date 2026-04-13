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
import { Badge } from '@/components/ui/badge'
import { MagicCard } from '@/components/ui/magic-card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { bilingual } from '@/lib/i18n'
import { trpc } from '@/lib/trpc'

const TYPE_VARIANT: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  mcq: 'default',
  code: 'secondary',
  'open-prompt': 'outline',
  'interviewer-chat': 'default',
}

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: 'bg-green-500/10 text-green-500 border-green-500/20',
  medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  hard: 'bg-red-500/10 text-red-500 border-red-500/20',
}

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
  const filtered = allExercises.filter((ex) => ex.section === sectionId)

  const countsByType = filtered.reduce<Record<string, number>>((acc, ex) => {
    acc[ex.type] = (acc[ex.type] ?? 0) + 1
    return acc
  }, {})
  const countsByDifficulty = filtered
    .filter((e) => e.difficulty)
    .reduce<Record<string, number>>((acc, ex) => {
      acc[ex.difficulty!] = (acc[ex.difficulty!] ?? 0) + 1
      return acc
    }, {})

  const isPending = companyQuery.isPending || exercisesQuery.isPending
  const Icon = iconForKind(section?.kind ?? 'default')

  return (
    <div className="px-6 py-10 max-w-6xl mx-auto w-full space-y-8">
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
            <header className="space-y-3">
              <div className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
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

              <div className="flex items-center gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-border">
                  <Icon className="size-6" />
                </span>
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl font-bold font-heading tracking-tight truncate">
                    <GradientText
                      text={section?.name ?? sectionId}
                      gradient="linear-gradient(90deg, var(--primary) 0%, var(--chart-2) 50%, var(--primary) 100%)"
                    />
                  </h1>
                  {section && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {kindLabel(section.kind)}
                    </p>
                  )}
                </div>
              </div>
            </header>
          </Fade>

          {/* Stats strip */}
          {filtered.length > 0 && (
            <Fade delay={0.05}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard label={t('section.total', { defaultValue: 'Total' })} value={filtered.length} />
                {Object.entries(countsByType).map(([type, count]) => (
                  <StatCard
                    key={type}
                    label={t(`exercise.types.${type}`, { defaultValue: type })}
                    value={count}
                    accent={TYPE_VARIANT[type]}
                  />
                ))}
              </div>
            </Fade>
          )}

          {/* Difficulty chips (for code-heavy sections) */}
          {Object.keys(countsByDifficulty).length > 0 && (
            <Fade delay={0.08}>
              <div className="flex flex-wrap gap-2">
                {(['easy', 'medium', 'hard'] as const).map(
                  (d) =>
                    countsByDifficulty[d] && (
                      <Badge key={d} variant="outline" className={DIFFICULTY_COLORS[d]}>
                        {countsByDifficulty[d]} × {d}
                      </Badge>
                    ),
                )}
              </div>
            </Fade>
          )}

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
              <MagicCard className="p-0 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[45%]">
                        {t('section.tableTitle', { defaultValue: 'Title' })}
                      </TableHead>
                      <TableHead>
                        {t('section.tableType', { defaultValue: 'Type' })}
                      </TableHead>
                      <TableHead>
                        {t('section.tableDifficulty', { defaultValue: 'Difficulty' })}
                      </TableHead>
                      <TableHead className="w-[1%]" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((ex) => (
                      <TableRow key={ex.id} className="group">
                        <TableCell className="font-medium">
                          <Link
                            to={`/${companySlug}/exercise/${ex.id}`}
                            className="block py-1 hover:text-primary transition-colors"
                          >
                            {bilingual(ex.title)}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge variant={TYPE_VARIANT[ex.type] ?? 'default'}>
                            {t(`exercise.types.${ex.type}`, { defaultValue: ex.type })}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {ex.difficulty ? (
                            <Badge
                              variant="outline"
                              className={DIFFICULTY_COLORS[ex.difficulty] ?? ''}
                            >
                              {ex.difficulty}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-xs">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Link
                            to={`/${companySlug}/exercise/${ex.id}`}
                            className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-muted transition-all"
                          >
                            <ChevronRightIcon className="size-4" />
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </MagicCard>
            </Fade>
          )}
        </>
      )}
    </div>
  )
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string
  value: number
  accent?: 'default' | 'secondary' | 'outline' | 'destructive'
}) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-2xl font-bold font-heading tabular-nums">{value}</span>
        {accent && (
          <Badge variant={accent} className="text-[10px] h-4">
            {label.toLowerCase()}
          </Badge>
        )}
      </div>
    </div>
  )
}
