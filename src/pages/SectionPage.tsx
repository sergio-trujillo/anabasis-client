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
  ArrowRightIcon,
  BookOpenIcon,
  BotIcon,
  BracesIcon,
  BriefcaseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ClockIcon,
  FileCode2Icon,
  MessageSquareIcon,
  SparklesIcon,
  TimerIcon,
  UsersIcon,
} from 'lucide-react'
import { Fade } from '@/components/animate-ui/primitives/effects/fade'
import { GradientText } from '@/components/animate-ui/primitives/texts/gradient'
import { ExercisesDataTable } from '@/components/problem/ExercisesDataTable'
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern'
import { Badge } from '@/components/ui/badge'
import { BorderBeam } from '@/components/ui/border-beam'
import { buttonVariants } from '@/components/ui/button'
import { MagicCard } from '@/components/ui/magic-card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
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

          {sectionId === 'gca-overview' ? (
            <Fade delay={0.1}>
              <GcaOverview companySlug={companySlug} />
            </Fade>
          ) : sectionId === 'power-day-overview' ? (
            <Fade delay={0.1}>
              <PowerDayOverview companySlug={companySlug} />
            </Fade>
          ) : filtered.length === 0 ? (
            <Fade delay={0.1}>
              <EmptySectionState
                companySlug={companySlug}
                sectionId={sectionId}
                section={section ?? null}
              />
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

type Section = { id: string; name: string; kind: string }

function EmptySectionState({
  companySlug,
  sectionId,
  section,
}: {
  companySlug: string
  sectionId: string
  section: Section | null
}) {
  const { t } = useTranslation()

  if (!section) {
    return (
      <MagicCard className="p-10 text-center">
        <p className="text-sm text-muted-foreground">
          {t('section.notFound', {
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
    )
  }

  const ctas = ctasForKind(companySlug, sectionId, section.kind)
  const Icon = iconForKind(section.kind)

  return (
    <MagicCard className="relative overflow-hidden p-8 md:p-10">
      <BorderBeam size={180} duration={12} />
      <div className="max-w-2xl mx-auto text-center space-y-5">
        <div className="inline-flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
          <Icon className="size-6" />
        </div>

        <div className="space-y-2">
          <h3 className="font-heading text-2xl font-semibold tracking-tight">
            {t('section.emptyHeadline', {
              defaultValue: 'This section is exercised dynamically',
              section: section.name,
            })}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {emptyBodyForKind(section.kind, t)}
          </p>
        </div>

        {ctas.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center pt-2">
            {ctas.map((cta) => (
              <Link
                key={cta.to}
                to={cta.to}
                className={cn(
                  buttonVariants({
                    variant: cta.variant,
                    size: 'default',
                  }),
                  'gap-2'
                )}
              >
                <cta.icon className="size-4" />
                {cta.label}
                <ArrowRightIcon className="size-3.5" />
              </Link>
            ))}
          </div>
        )}

        <Link
          to={`/${companySlug}`}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronRightIcon className="size-3 rotate-180" />
          {t('section.backToCompany', { defaultValue: 'Back to company' })}
        </Link>
      </div>
    </MagicCard>
  )
}

type SectionCta = {
  to: string
  label: string
  icon: typeof ClockIcon
  variant: 'default' | 'secondary' | 'outline'
}

function ctasForKind(
  companySlug: string,
  _sectionId: string,
  kind: string
): SectionCta[] {
  switch (kind) {
    case 'code':
    case 'code+defense':
      return [
        {
          to: `/${companySlug}/mock-power-day`,
          label: 'Mock Power Day',
          icon: ClockIcon,
          variant: 'default',
        },
        {
          to: `/${companySlug}/mock-gca`,
          label: 'Mock GCA',
          icon: ClockIcon,
          variant: 'secondary',
        },
      ]
    case 'interviewer-chat':
    case 'behavioral':
    case 'business-case':
      return [
        {
          to: `/${companySlug}/mock-power-day`,
          label: 'Mock Power Day',
          icon: ClockIcon,
          variant: 'default',
        },
      ]
    case 'lesson+drills':
      return [
        {
          to: `/${companySlug}/practice`,
          label: 'Random practice',
          icon: SparklesIcon,
          variant: 'secondary',
        },
      ]
    default:
      return []
  }
}

function emptyBodyForKind(
  kind: string,
  t: (k: string, o?: { defaultValue: string }) => string
): string {
  switch (kind) {
    case 'code':
    case 'code+defense':
      return t('section.emptyCode', {
        defaultValue:
          'Coding rounds draw from the GCA exercise pool at runtime. Launch a Mock Power Day (3 hr onsite) or a Mock GCA (70-min timed) to exercise this round against live problems.',
      })
    case 'interviewer-chat':
      return t('section.emptyChat', {
        defaultValue:
          'System-design rounds run as interviewer chats. The scenarios live inside the Power Day loop — start a Mock Power Day to rotate through them.',
      })
    case 'behavioral':
      return t('section.emptyBehavioral', {
        defaultValue:
          'Behavioral rounds use open-prompt drills and interviewer chats. Start a Mock Power Day to land on one of them at random.',
      })
    case 'business-case':
      return t('section.emptyCase', {
        defaultValue:
          'Business-case rounds blend frameworks and interviewer-chat scenarios. The Mock Power Day picks one to drill.',
      })
    case 'lesson+drills':
      return t('section.emptyLesson', {
        defaultValue:
          'Lesson content is still being authored. Random practice is the closest thing until this section ships.',
      })
    default:
      return t('section.empty', {
        defaultValue:
          'No exercises authored yet for this section. Content authoring is ongoing.',
      })
  }
}

function OverviewShell({
  kicker,
  title,
  summary,
  children,
}: {
  kicker: string
  title: string
  summary: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-6">
      <MagicCard className="relative overflow-hidden p-8 md:p-10">
        <BorderBeam size={240} duration={12} />
        <div className="space-y-3 max-w-3xl">
          <Badge variant="outline" className="gap-1.5 rounded-full p-2">
            <SparklesIcon className="size-3 text-primary" />
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
              {kicker}
            </span>
          </Badge>
          <h2 className="font-heading text-3xl font-bold tracking-tight">
            <GradientText
              text={title}
              gradient="linear-gradient(90deg, var(--primary) 0%, var(--chart-2) 50%, var(--chart-4) 100%)"
            />
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">{summary}</p>
        </div>
      </MagicCard>
      {children}
    </div>
  )
}

export function OverviewSection({
  header,
  sub,
  children,
}: {
  header: string
  sub?: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3">
      <div className="space-y-1">
        <h3 className="text-xs uppercase tracking-wider text-muted-foreground">
          {header}
        </h3>
        {sub && <p className="text-xs text-muted-foreground/80 max-w-3xl">{sub}</p>}
      </div>
      {children}
    </section>
  )
}

export function OverviewTimeline({
  header,
  items,
}: {
  header: string
  items: Array<{ time: string; label: string; note: string }>
}) {
  // Derive minute spans from "HH:MM – HH:MM" strings so we can render
  // proportional Progress bars.
  const parsed = items.map((it) => {
    const m = it.time.match(/(\d+):(\d+)\s*[–-]\s*(\d+):(\d+)/)
    if (!m) return { ...it, minutes: 0 }
    const start = parseInt(m[1], 10) * 60 + parseInt(m[2], 10)
    const end = parseInt(m[3], 10) * 60 + parseInt(m[4], 10)
    return { ...it, minutes: end - start }
  })
  const maxMinutes = Math.max(...parsed.map((p) => p.minutes), 1)
  return (
    <OverviewSection header={header}>
      <MagicCard className="p-5">
        <ol className="space-y-3">
          {parsed.map((it, i) => {
            const isBreak =
              it.label.toLowerCase().includes('break') ||
              it.label.toLowerCase().includes('descanso')
            const pct = (it.minutes / maxMinutes) * 100
            return (
              <li
                key={i}
                className="grid grid-cols-[110px_1fr_60px] gap-3 items-center"
              >
                <span className="font-mono text-xs text-muted-foreground tabular-nums">
                  {it.time}
                </span>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm">
                    <span
                      className={cn(
                        'inline-block size-1.5 rounded-full shrink-0',
                        isBreak ? 'bg-muted-foreground/40' : 'bg-primary'
                      )}
                    />
                    <span
                      className={cn(
                        'font-medium truncate',
                        isBreak && 'text-muted-foreground'
                      )}
                    >
                      {it.label}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      · {it.note}
                    </span>
                  </div>
                  <Progress
                    value={pct}
                    className={cn(
                      'h-1.5',
                      isBreak && 'opacity-40'
                    )}
                  />
                </div>
                <span className="font-mono text-[10px] text-muted-foreground/70 tabular-nums text-right">
                  {it.minutes} min
                </span>
              </li>
            )
          })}
        </ol>
      </MagicCard>
    </OverviewSection>
  )
}

export function OverviewConceptsTabs({
  header,
  sub,
  items,
  labels,
}: {
  header: string
  sub: string
  items: Array<{
    term: string
    definition: string
    why: string
    example: string
  }>
  labels: { definition: string; whyMatters: string; inPractice: string }
}) {
  return (
    <OverviewSection header={header} sub={sub}>
      <Tabs defaultValue={items[0]?.term}>
        <TabsList className="h-auto flex-wrap gap-1 bg-muted/40 p-1">
          {items.map((c, i) => (
            <TabsTrigger
              key={c.term}
              value={c.term}
              className="data-[state=active]:bg-background text-xs"
            >
              <span className="font-mono text-[10px] opacity-50 mr-1.5 tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              {c.term}
            </TabsTrigger>
          ))}
        </TabsList>
        {items.map((c) => (
          <TabsContent key={c.term} value={c.term} className="mt-3">
            <MagicCard className="p-6 space-y-5">
              <div className="space-y-1">
                <div className="uppercase tracking-wider text-[10px] font-semibold text-muted-foreground/70">
                  {labels.definition}
                </div>
                <p className="text-sm leading-relaxed">{c.definition}</p>
              </div>
              <Separator />
              <div className="space-y-1">
                <div className="uppercase tracking-wider text-[10px] font-semibold text-primary/80">
                  {labels.whyMatters}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {c.why}
                </p>
              </div>
              <div className="space-y-1 border-l-2 border-primary/50 pl-4 py-2 bg-primary/5 rounded-r-md">
                <div className="uppercase tracking-wider text-[10px] font-semibold text-emerald-600">
                  {labels.inPractice}
                </div>
                <p className="text-sm leading-relaxed italic">{c.example}</p>
              </div>
            </MagicCard>
          </TabsContent>
        ))}
      </Tabs>
    </OverviewSection>
  )
}

export function OverviewRoundsTabs({
  header,
  items,
  labels,
}: {
  header: string
  items: DeepItem[]
  labels: { evaluated: string; pacing: string; pitfalls: string }
}) {
  return (
    <OverviewSection header={header}>
      <Tabs defaultValue={items[0]?.title}>
        <TabsList className="h-auto flex-wrap gap-1 bg-muted/40 p-1">
          {items.map((it, i) => (
            <TabsTrigger
              key={it.title}
              value={it.title}
              className="data-[state=active]:bg-background text-xs"
            >
              <span className="font-mono text-[10px] opacity-50 mr-1.5 tabular-nums">
                R{i + 1}
              </span>
              {it.title.replace(/^(Round|Ronda)\s+\d+\s*[—-]\s*/i, '')}
            </TabsTrigger>
          ))}
        </TabsList>
        {items.map((it) => (
          <TabsContent key={it.title} value={it.title} className="mt-3">
            <MagicCard className="p-6 space-y-5">
              <div>
                <h4 className="font-heading text-lg font-semibold mb-2">
                  {it.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {it.body}
                </p>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {it.evaluated && (
                  <div className="space-y-1">
                    <div className="uppercase tracking-wider text-[10px] font-semibold text-primary/80">
                      {labels.evaluated}
                    </div>
                    <p className="text-sm leading-relaxed">{it.evaluated}</p>
                  </div>
                )}
                {it.pacing && (
                  <div className="space-y-1">
                    <div className="uppercase tracking-wider text-[10px] font-semibold text-muted-foreground/70">
                      {labels.pacing}
                    </div>
                    <p className="text-sm leading-relaxed">{it.pacing}</p>
                  </div>
                )}
              </div>
              {it.pitfalls && it.pitfalls.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <div className="uppercase tracking-wider text-[10px] font-semibold text-amber-600">
                      {labels.pitfalls}
                    </div>
                    <ul className="space-y-1.5">
                      {it.pitfalls.map((p, j) => (
                        <li
                          key={j}
                          className="flex gap-2 text-sm leading-relaxed"
                        >
                          <span className="text-amber-600 shrink-0">•</span>
                          <span className="text-muted-foreground">{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </MagicCard>
          </TabsContent>
        ))}
      </Tabs>
    </OverviewSection>
  )
}

export function OverviewValuesTabs({
  header,
  items,
  labels,
}: {
  header: string
  items: Array<{
    title: string
    body: string
    signal: string
    antiSignal: string
    petPeeve: string
  }>
  labels: { signal: string; antiSignal: string; petPeeve: string }
}) {
  return (
    <OverviewSection header={header}>
      <Tabs defaultValue={items[0]?.title}>
        <TabsList className="h-auto flex-wrap gap-1 bg-muted/40 p-1">
          {items.map((v) => (
            <TabsTrigger
              key={v.title}
              value={v.title}
              className="data-[state=active]:bg-background text-xs"
            >
              {v.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {items.map((v) => (
          <TabsContent key={v.title} value={v.title} className="mt-3">
            <MagicCard className="p-6 space-y-4">
              <div>
                <h4 className="font-heading text-lg font-semibold mb-1">
                  {v.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {v.body}
                </p>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ValuesColumn
                  tone="good"
                  label={labels.signal}
                  value={v.signal}
                />
                <ValuesColumn
                  tone="bad"
                  label={labels.antiSignal}
                  value={v.antiSignal}
                />
                <ValuesColumn
                  tone="warn"
                  label={labels.petPeeve}
                  value={v.petPeeve}
                />
              </div>
            </MagicCard>
          </TabsContent>
        ))}
      </Tabs>
    </OverviewSection>
  )
}

function ValuesColumn({
  tone,
  label,
  value,
}: {
  tone: 'good' | 'bad' | 'warn'
  label: string
  value: string
}) {
  const toneClass =
    tone === 'good'
      ? 'text-emerald-600 border-emerald-500/30 bg-emerald-500/5'
      : tone === 'bad'
        ? 'text-rose-600 border-rose-500/30 bg-rose-500/5'
        : 'text-amber-600 border-amber-500/30 bg-amber-500/5'
  const marker = tone === 'good' ? '✓' : tone === 'bad' ? '✗' : '!'
  return (
    <div
      className={cn(
        'rounded-md border-l-2 p-3 space-y-1',
        toneClass
      )}
    >
      <div className="flex items-center gap-1.5">
        <span className="font-semibold">{marker}</span>
        <span className="uppercase tracking-wider text-[10px] font-semibold">
          {label}
        </span>
      </div>
      <p className="text-xs text-foreground leading-relaxed">{value}</p>
    </div>
  )
}

export function OverviewAntiPatternsAccordion({
  header,
  items,
  labels,
}: {
  header: string
  items: Array<{ bad: string; why: string; fix: string }>
  labels: { bad: string; why: string; fix: string }
}) {
  return (
    <OverviewSection header={header}>
      <div className="space-y-2">
        {items.map((ap, i) => (
          <Collapsible key={i}>
            <MagicCard className="overflow-hidden p-0">
              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  className="w-full p-4 flex items-center gap-3 text-left hover:bg-muted/30 transition-colors group"
                >
                  <span className="shrink-0 size-7 rounded-md bg-rose-500/10 text-rose-600 flex items-center justify-center text-xs font-semibold ring-1 ring-rose-500/20">
                    ✗
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="uppercase tracking-wider text-[9px] font-semibold text-rose-600 mb-0.5">
                      {labels.bad}
                    </div>
                    <div className="text-sm font-medium leading-snug truncate">
                      {ap.bad}
                    </div>
                  </div>
                  <ChevronDownIcon className="shrink-0 size-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-4 pb-4 pl-[60px] space-y-3 border-t border-border/50 pt-3">
                  <div className="space-y-1">
                    <div className="uppercase tracking-wider text-[10px] font-semibold text-amber-600">
                      {labels.why}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {ap.why}
                    </p>
                  </div>
                  <div className="space-y-1 border-l-2 border-emerald-500/50 pl-3 py-1.5 bg-emerald-500/5 rounded-r-md">
                    <div className="uppercase tracking-wider text-[10px] font-semibold text-emerald-600">
                      {labels.fix}
                    </div>
                    <p className="text-sm leading-relaxed italic">{ap.fix}</p>
                  </div>
                </div>
              </CollapsibleContent>
            </MagicCard>
          </Collapsible>
        ))}
      </div>
    </OverviewSection>
  )
}

export function OverviewGrid({
  header,
  items,
}: {
  header: string
  items: Array<{ title: string; body: string; weight?: string }>
}) {
  return (
    <OverviewSection header={header}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((item, i) => (
          <MagicCard key={item.title} className="p-5 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary text-[11px] font-semibold ring-1 ring-primary/20 tabular-nums">
                  {i + 1}
                </span>
                <h4 className="font-heading text-base font-semibold truncate">
                  {item.title}
                </h4>
              </div>
              {item.weight && (
                <Badge variant="outline" className="text-[10px] shrink-0">
                  {item.weight}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {item.body}
            </p>
          </MagicCard>
        ))}
      </div>
    </OverviewSection>
  )
}

export type DeepItem = {
  title: string
  body: string
  pattern?: string
  pacing?: string
  trap?: string
  evaluated?: string
  pitfalls?: string[]
}

export function OverviewDeepCards({
  header,
  items,
  labels,
}: {
  header: string
  items: DeepItem[]
  labels: {
    pattern?: string
    pacing?: string
    trap?: string
    evaluated?: string
    pitfalls?: string
  }
}) {
  return (
    <OverviewSection header={header}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {items.map((item, i) => (
          <MagicCard key={item.title} className="p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary text-[11px] font-semibold ring-1 ring-primary/20 tabular-nums">
                {i + 1}
              </span>
              <h4 className="font-heading text-base font-semibold">{item.title}</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {item.body}
            </p>
            <div className="space-y-2 pt-1">
              {item.pattern && labels.pattern && (
                <DetailRow label={labels.pattern} value={item.pattern} />
              )}
              {item.evaluated && labels.evaluated && (
                <DetailRow label={labels.evaluated} value={item.evaluated} />
              )}
              {item.pacing && labels.pacing && (
                <DetailRow label={labels.pacing} value={item.pacing} />
              )}
              {item.trap && labels.trap && (
                <DetailRow label={labels.trap} value={item.trap} tone="warn" />
              )}
              {item.pitfalls && labels.pitfalls && (
                <div className="text-xs space-y-1 pt-1">
                  <div className="uppercase tracking-wider text-amber-600 font-semibold text-[10px]">
                    {labels.pitfalls}
                  </div>
                  <ul className="space-y-1">
                    {item.pitfalls.map((p, j) => (
                      <li
                        key={j}
                        className="flex gap-2 leading-relaxed text-muted-foreground"
                      >
                        <span className="text-amber-600">•</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </MagicCard>
        ))}
      </div>
    </OverviewSection>
  )
}

function DetailRow({
  label,
  value,
  tone = 'muted',
}: {
  label: string
  value: string
  tone?: 'muted' | 'warn'
}) {
  return (
    <div className="text-xs space-y-0.5">
      <div
        className={cn(
          'uppercase tracking-wider font-semibold text-[10px]',
          tone === 'warn' ? 'text-amber-600' : 'text-muted-foreground/70'
        )}
      >
        {label}
      </div>
      <div className="text-sm leading-relaxed">{value}</div>
    </div>
  )
}

function OverviewValueCards({
  header,
  items,
  labels,
}: {
  header: string
  items: Array<{
    title: string
    body: string
    signal: string
    antiSignal: string
    petPeeve: string
  }>
  labels: { signal: string; antiSignal: string; petPeeve: string }
}) {
  return (
    <OverviewSection header={header}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {items.map((v) => (
          <MagicCard key={v.title} className="p-5 space-y-3">
            <h4 className="font-heading text-base font-semibold">{v.title}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{v.body}</p>
            <div className="space-y-2 pt-1 border-t border-border/50">
              <ValueRow tone="good" label={labels.signal} value={v.signal} />
              <ValueRow tone="bad" label={labels.antiSignal} value={v.antiSignal} />
              <ValueRow tone="warn" label={labels.petPeeve} value={v.petPeeve} />
            </div>
          </MagicCard>
        ))}
      </div>
    </OverviewSection>
  )
}

function ValueRow({
  tone,
  label,
  value,
}: {
  tone: 'good' | 'bad' | 'warn'
  label: string
  value: string
}) {
  const toneClass =
    tone === 'good'
      ? 'text-emerald-600'
      : tone === 'bad'
        ? 'text-rose-600'
        : 'text-amber-600'
  const marker = tone === 'good' ? '✓' : tone === 'bad' ? '✗' : '!'
  return (
    <div className="flex gap-2 text-xs">
      <span className={cn('font-semibold shrink-0 w-4 text-center', toneClass)}>
        {marker}
      </span>
      <div className="min-w-0">
        <span className={cn('uppercase tracking-wider text-[10px] font-semibold', toneClass)}>
          {label}
        </span>
        <span className="text-sm text-muted-foreground leading-relaxed ml-2">
          {value}
        </span>
      </div>
    </div>
  )
}

export function OverviewGlossary({
  header,
  sub,
  rows,
  columns,
}: {
  header: string
  sub: string
  rows: Array<{ category: string; products: string; why: string }>
  columns: { category: string; products: string; why: string }
}) {
  return (
    <OverviewSection header={header} sub={sub}>
      <div className="rounded-xl border bg-card/60 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">{columns.category}</TableHead>
              <TableHead className="w-[260px]">{columns.products}</TableHead>
              <TableHead>{columns.why}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.category}>
                <TableCell className="font-medium">{r.category}</TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {r.products}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground leading-relaxed">
                  {r.why}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </OverviewSection>
  )
}

export function OverviewFingerprints({
  header,
  rows,
  columns,
}: {
  header: string
  rows: Array<{ category: string; signal: string }>
  columns: { category: string; signal: string }
}) {
  return (
    <OverviewSection header={header}>
      <div className="rounded-xl border bg-card/60 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[240px]">{columns.category}</TableHead>
              <TableHead>{columns.signal}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.category}>
                <TableCell className="font-medium">{r.category}</TableCell>
                <TableCell className="text-sm text-muted-foreground leading-relaxed">
                  {r.signal}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </OverviewSection>
  )
}

export function OverviewAntiPatterns({
  header,
  items,
  labels,
}: {
  header: string
  items: Array<{ bad: string; why: string; fix: string }>
  labels: { bad: string; why: string; fix: string }
}) {
  return (
    <OverviewSection header={header}>
      <div className="grid grid-cols-1 gap-3">
        {items.map((ap, i) => (
          <MagicCard key={i} className="p-5 space-y-3">
            <div className="flex items-start gap-3">
              <span className="shrink-0 size-6 flex items-center justify-center rounded-md bg-rose-500/10 text-rose-600 ring-1 ring-rose-500/20 text-xs font-semibold">
                ✗
              </span>
              <div className="min-w-0">
                <div className="uppercase tracking-wider text-[10px] font-semibold text-rose-600">
                  {labels.bad}
                </div>
                <div className="text-sm font-medium mt-0.5 leading-relaxed">
                  {ap.bad}
                </div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground leading-relaxed pl-9">
              <span className="uppercase tracking-wider text-[10px] font-semibold text-amber-600">
                {labels.why}
              </span>
              <span className="ml-2">{ap.why}</span>
            </div>
            <div className="text-sm leading-relaxed pl-9 pt-1 border-t border-border/50">
              <span className="uppercase tracking-wider text-[10px] font-semibold text-emerald-600">
                {labels.fix}
              </span>
              <span className="ml-2 text-foreground">{ap.fix}</span>
            </div>
          </MagicCard>
        ))}
      </div>
    </OverviewSection>
  )
}

export function OverviewPrepTimeline({
  header,
  items,
}: {
  header: string
  items: Array<{ when: string; tasks: string[] }>
}) {
  return (
    <OverviewSection header={header}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((block, i) => (
          <MagicCard key={block.when} className="p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary text-[11px] font-semibold ring-1 ring-primary/20 tabular-nums">
                {i + 1}
              </span>
              <h4 className="font-heading text-sm font-semibold uppercase tracking-wider">
                {block.when}
              </h4>
            </div>
            <ul className="space-y-2">
              {block.tasks.map((task, j) => (
                <li
                  key={j}
                  className="flex items-start gap-2 text-sm leading-relaxed"
                >
                  <span className="text-primary mt-0.5">▸</span>
                  <span>{task}</span>
                </li>
              ))}
            </ul>
          </MagicCard>
        ))}
      </div>
    </OverviewSection>
  )
}

function OverviewConcepts({
  header,
  sub,
  items,
  labels,
}: {
  header: string
  sub: string
  items: Array<{
    term: string
    definition: string
    why: string
    example: string
  }>
  labels: { definition: string; whyMatters: string; inPractice: string }
}) {
  return (
    <OverviewSection header={header} sub={sub}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {items.map((c, i) => (
          <MagicCard key={c.term} className="p-5 space-y-4">
            <header className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary text-[11px] font-semibold ring-1 ring-primary/20 tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h4 className="font-heading text-base font-semibold leading-tight">
                {c.term}
              </h4>
            </header>

            <div className="space-y-1">
              <div className="uppercase tracking-wider text-[10px] font-semibold text-muted-foreground/70">
                {labels.definition}
              </div>
              <p className="text-sm leading-relaxed">{c.definition}</p>
            </div>

            <div className="space-y-1">
              <div className="uppercase tracking-wider text-[10px] font-semibold text-primary/80">
                {labels.whyMatters}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {c.why}
              </p>
            </div>

            <div className="space-y-1 border-l-2 border-primary/40 pl-3 py-1 bg-primary/5 rounded-r-md">
              <div className="uppercase tracking-wider text-[10px] font-semibold text-emerald-600">
                {labels.inPractice}
              </div>
              <p className="text-sm leading-relaxed italic">{c.example}</p>
            </div>
          </MagicCard>
        ))}
      </div>
    </OverviewSection>
  )
}

export function OverviewSkipList({
  header,
  items,
}: {
  header: string
  items: string[]
}) {
  return (
    <OverviewSection header={header}>
      <MagicCard className="p-5">
        <ul className="space-y-2.5">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm leading-relaxed">
              <span className="shrink-0 size-5 flex items-center justify-center rounded-full bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20 text-[10px] font-semibold tabular-nums mt-0.5">
                {i + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </MagicCard>
    </OverviewSection>
  )
}

function OverviewTips({ header, tips }: { header: string; tips: string[] }) {
  return (
    <section className="space-y-3">
      <h3 className="text-xs uppercase tracking-wider text-muted-foreground">
        {header}
      </h3>
      <MagicCard className="p-5">
        <ul className="space-y-2.5">
          {tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-semibold tabular-nums mt-0.5 ring-1 ring-primary/20">
                {i + 1}
              </span>
              <span className="leading-relaxed">{tip}</span>
            </li>
          ))}
        </ul>
      </MagicCard>
    </section>
  )
}

function OverviewCtas({ ctas }: { ctas: SectionCta[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {ctas.map((cta) => (
        <Link
          key={cta.to}
          to={cta.to}
          className={cn(
            buttonVariants({ variant: cta.variant, size: 'lg' }),
            'gap-2'
          )}
        >
          <cta.icon className="size-4" />
          {cta.label}
          <ArrowRightIcon className="size-4" />
        </Link>
      ))}
    </div>
  )
}

// i18next typing doesn't type `returnObjects: true`, so we pull arrays via
// this helper and cast — the JSON shape is authoritative.
export function tArray<T>(
  t: ReturnType<typeof useTranslation>['t'],
  key: string
): T[] {
  return t(key, { returnObjects: true }) as unknown as T[]
}

function GcaOverview({ companySlug }: { companySlug: string }) {
  const { t } = useTranslation()
  const k = (key: string) => t(`sectionOverview.gca.${key}`)

  const scoring = tArray<{ title: string; body: string }>(
    t,
    'sectionOverview.gca.scoring'
  )
  const modulesDeep = tArray<DeepItem>(t, 'sectionOverview.gca.modulesDeep')
  const fingerprints = tArray<{ category: string; signal: string }>(
    t,
    'sectionOverview.gca.fingerprints'
  )
  const skip = tArray<string>(t, 'sectionOverview.gca.skip')
  const antiPatterns = tArray<{ bad: string; why: string; fix: string }>(
    t,
    'sectionOverview.gca.antiPatterns'
  )
  const tips = [k('tip1'), k('tip2'), k('tip3'), k('tip4')]

  // Weight badges for modules
  const weights = ['100', '200', '300', '400']
  const modulesWithWeight = modulesDeep.map((m, i) => ({
    ...m,
    body: `${m.body}`,
    weight: weights[i],
  })) as (DeepItem & { weight: string })[]

  const ctas: SectionCta[] = [
    {
      to: `/${companySlug}/mock-gca`,
      label: k('ctaStart'),
      icon: ClockIcon,
      variant: 'default',
    },
    {
      to: `/${companySlug}/practice`,
      label: k('ctaPractice'),
      icon: SparklesIcon,
      variant: 'secondary',
    },
  ]

  return (
    <OverviewShell kicker={k('kicker')} title={k('title')} summary={k('summary')}>
      <OverviewGrid header={k('scoringHeader')} items={scoring} />
      <OverviewDeepCards
        header={k('modulesHeader')}
        items={modulesWithWeight}
        labels={{
          pattern: t('overviewLabels.pattern', { defaultValue: 'Pattern' }),
          pacing: t('overviewLabels.pacing', { defaultValue: 'Pacing' }),
          trap: t('overviewLabels.trap', { defaultValue: 'Trap' }),
        }}
      />
      <OverviewFingerprints
        header={k('fingerprintsHeader')}
        rows={fingerprints}
        columns={{
          category: t('overviewLabels.pattern', { defaultValue: 'Pattern' }),
          signal: t('overviewLabels.signal', { defaultValue: 'Signal' }),
        }}
      />
      <OverviewSkipList header={k('skipHeader')} items={skip} />
      <OverviewAntiPatterns
        header={k('antiPatternsHeader')}
        items={antiPatterns}
        labels={{
          bad: t('overviewLabels.bad', { defaultValue: 'Anti-pattern' }),
          why: t('overviewLabels.why', { defaultValue: 'Why it costs you' }),
          fix: t('overviewLabels.fix', { defaultValue: 'Say this instead' }),
        }}
      />
      <OverviewTips header={k('tipsHeader')} tips={tips} />
      <OverviewCtas ctas={ctas} />
    </OverviewShell>
  )
}

function PowerDayOverview({ companySlug }: { companySlug: string }) {
  const { t } = useTranslation()
  const k = (key: string) => t(`sectionOverview.powerDay.${key}`)

  const timeline = tArray<{ time: string; label: string; note: string }>(
    t,
    'sectionOverview.powerDay.timeline'
  )
  const roundsDeep = tArray<DeepItem>(t, 'sectionOverview.powerDay.roundsDeep')
  const valuesDeep = tArray<{
    title: string
    body: string
    signal: string
    antiSignal: string
    petPeeve: string
  }>(t, 'sectionOverview.powerDay.valuesDeep')
  const glossary = tArray<{ category: string; products: string; why: string }>(
    t,
    'sectionOverview.powerDay.glossary'
  )
  const antiPatterns = tArray<{ bad: string; why: string; fix: string }>(
    t,
    'sectionOverview.powerDay.antiPatterns'
  )
  const prep = tArray<{ when: string; tasks: string[] }>(
    t,
    'sectionOverview.powerDay.prep'
  )
  const concepts = tArray<{
    term: string
    definition: string
    why: string
    example: string
  }>(t, 'sectionOverview.powerDay.concepts')

  const ctas: SectionCta[] = [
    {
      to: `/${companySlug}/mock-power-day`,
      label: k('ctaStart'),
      icon: ClockIcon,
      variant: 'default',
    },
    {
      to: `/${companySlug}/mock-gca`,
      label: k('ctaGca'),
      icon: ClockIcon,
      variant: 'secondary',
    },
  ]

  return (
    <OverviewShell kicker={k('kicker')} title={k('title')} summary={k('summary')}>
      <OverviewTimeline header={k('timelineHeader')} items={timeline} />
      <Separator />
      <OverviewConceptsTabs
        header={k('conceptsHeader')}
        sub={k('conceptsSub')}
        items={concepts}
        labels={{
          definition: t('overviewLabels.definition', { defaultValue: 'What it is' }),
          whyMatters: t('overviewLabels.whyMatters', {
            defaultValue: 'Why Capital One cares',
          }),
          inPractice: t('overviewLabels.inPractice', { defaultValue: 'In practice' }),
        }}
      />
      <Separator />
      <OverviewRoundsTabs
        header={k('roundsHeader')}
        items={roundsDeep}
        labels={{
          evaluated: t('overviewLabels.evaluated', { defaultValue: 'What they evaluate' }),
          pacing: t('overviewLabels.pacing', { defaultValue: 'Pacing' }),
          pitfalls: t('overviewLabels.pitfalls', { defaultValue: 'Common pitfalls' }),
        }}
      />
      <Separator />
      <OverviewValuesTabs
        header={k('valuesHeader')}
        items={valuesDeep}
        labels={{
          signal: t('overviewLabels.signal', { defaultValue: 'Signal' }),
          antiSignal: t('overviewLabels.antiSignal', { defaultValue: 'Anti-signal' }),
          petPeeve: t('overviewLabels.petPeeve', { defaultValue: 'Pet peeve' }),
        }}
      />
      <Separator />
      <OverviewGlossary
        header={k('glossaryHeader')}
        sub={k('glossarySub')}
        rows={glossary}
        columns={{
          category: t('overviewLabels.category', { defaultValue: 'Category' }),
          products: t('overviewLabels.products', { defaultValue: 'Products' }),
          why: t('overviewLabels.why', { defaultValue: 'Why it exists' }),
        }}
      />
      <Separator />
      <OverviewAntiPatternsAccordion
        header={k('antiPatternsHeader')}
        items={antiPatterns}
        labels={{
          bad: t('overviewLabels.bad', { defaultValue: 'Anti-pattern' }),
          why: t('overviewLabels.why', { defaultValue: 'Why it costs you' }),
          fix: t('overviewLabels.fix', { defaultValue: 'Say this instead' }),
        }}
      />
      <Separator />
      <OverviewPrepTimeline header={k('prepHeader')} items={prep} />
      <OverviewCtas ctas={ctas} />
    </OverviewShell>
  )
}

