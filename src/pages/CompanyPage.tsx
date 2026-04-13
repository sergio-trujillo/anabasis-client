// Company landing — the campaign-level view.
// Route: /:companySlug.
//
// Ported from anabasis-client v1 with Praxema's visual kit (MagicCard,
// BorderBeam, Fade). Adds the loop.json roadmap as phase → sections nav:
// the user sees the whole Capital One campaign shape before they start
// grinding.
//
// Data:
//   - trpc.companies.get({ slug }) → { company, loop }
//   - loop.phases[] → list of { id, name, description, sections[] }

import {
  ArrowRightIcon,
  BookOpenIcon,
  BotIcon,
  BracesIcon,
  BriefcaseIcon,
  CheckCircle2Icon,
  ChevronRightIcon,
  ClockIcon,
  FileCode2Icon,
  MessageSquareIcon,
  ShuffleIcon,
  SparklesIcon,
  TimerIcon,
  UsersIcon,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router'
import { Fade } from '@/components/animate-ui/primitives/effects/fade'
import { GradientText } from '@/components/animate-ui/primitives/texts/gradient'
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern'
import { Badge } from '@/components/ui/badge'
import { BorderBeam } from '@/components/ui/border-beam'
import { MagicCard } from '@/components/ui/magic-card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { trpc } from '@/lib/trpc'

export function CompanyPage() {
  const { t } = useTranslation()
  const { companySlug = '' } = useParams()
  const companyQuery = trpc.companies.get.useQuery({ slug: companySlug })

  if (companyQuery.isPending) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 w-full space-y-4">
          <Skeleton className="h-10 w-80" />
          <Skeleton className="h-4 w-96" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-60 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (companyQuery.error || !companyQuery.data) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 w-full">
          <p className="text-destructive">
            {companyQuery.error?.message ?? 'Company not found'}
          </p>
        </div>
      </div>
    )
  }

  // tRPC type inference is temporarily degraded while legacy Praxema pages
  // (ProblemPage, LessonPage, etc.) still reference types that collide with
  // the Anabasis AppRouter. Cast narrowly until Fase 5 finishes removing them.
  const { company, loop } = companyQuery.data as {
    company: {
      slug: string
      name: string
      status: 'active' | 'coming-soon'
      tagline: string
      accentColor?: string
    }
    loop: {
      displayName: string
      phases: Array<{
        id: string
        name: string
        description: string
        sections: Array<{ id: string; name: string; kind: string }>
      }>
    } | null
  }
  const isActive = company.status === 'active'

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="relative min-h-[calc(100vh-3.5rem)]">
        <AnimatedGridPattern
          numSquares={36}
          maxOpacity={0.06}
          duration={3}
          className="absolute inset-0 -z-10 [mask-image:radial-gradient(700px_circle_at_top,white,transparent)]"
        />
        <div className="relative p-2 w-full space-y-6">
          <Fade>
          <header className="relative overflow-hidden rounded-xl p-8">
            {isActive && (
              <BorderBeam
                size={200}
                duration={12}
                colorFrom={company.accentColor ?? 'var(--primary)'}
                colorTo="var(--chart-2)"
              />
            )}
            <h1 className="text-4xl font-bold font-heading tracking-tight">
              <GradientText
                text={company.name}
                gradient={`linear-gradient(90deg, ${company.accentColor ?? 'var(--primary)'} 0%, var(--chart-2) 50%, ${company.accentColor ?? 'var(--primary)'} 100%)`}
              />
            </h1>
            <p className="text-base text-muted-foreground mt-2 max-w-2xl">
              {company.tagline}
            </p>

          </header>
        </Fade>

        {isActive && company.slug === 'capital-one' && (
          <CapitalOneOverview companySlug={companySlug} />
        )}

        {loop && loop.phases.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-xs uppercase tracking-wider text-muted-foreground">
              {loop.displayName}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {loop.phases.map((phase, i) => (
                <Fade key={phase.id} delay={i * 0.08}>
                  <PhaseCard companySlug={companySlug} phase={phase} />
                </Fade>
              ))}
            </div>
          </section>
        )}
        </div>
      </div>
    </div>
  )
}

type Section = { id: string; name: string; kind: string }
type Phase = {
  id: string
  name: string
  description: string
  sections: Section[]
}

// Visual language per section kind — icon + accent tailwind class.
// The 'kind' field in loop.json is the authoritative taxonomy.
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

function hrefForSection(companySlug: string, section: Section): string {
  if (section.id === 'gca-mock') return `/${companySlug}/mock-gca`
  if (section.id === 'power-day-mock') return `/${companySlug}/mock-power-day`
  if (section.id === 'gca-overview') return `/${companySlug}/overview/gca`
  if (section.id === 'power-day-overview') return `/${companySlug}/overview/power-day`
  return `/${companySlug}/section/${section.id}`
}

function tArray<T>(
  t: ReturnType<typeof useTranslation>['t'],
  key: string
): T[] {
  return t(key, { returnObjects: true }) as unknown as T[]
}

type JourneyStep = {
  step: string
  duration: string
  what: string
  evaluated: string
}
type DistinctiveItem = { title: string; body: string }
type PlanItem = {
  title: string
  subtitle: string
  body: string
  to: 'mock-power-day' | 'mock-gca' | 'practice'
  cta: string
}

function CapitalOneOverview({ companySlug }: { companySlug: string }) {
  const { t } = useTranslation()
  const k = (key: string) => t(`companyOverview.capitalOne.${key}`)

  const journey = tArray<JourneyStep>(t, 'companyOverview.capitalOne.journey')
  const distinctive = tArray<DistinctiveItem>(
    t,
    'companyOverview.capitalOne.distinctive'
  )
  const plan = tArray<PlanItem>(t, 'companyOverview.capitalOne.plan')

  const stepIcons = [UsersIcon, FileCode2Icon, ClockIcon, CheckCircle2Icon]
  const planIcons: Record<PlanItem['to'], typeof ClockIcon> = {
    'mock-power-day': ClockIcon,
    'mock-gca': ClockIcon,
    practice: ShuffleIcon,
  }

  return (
    <div className="space-y-8">
      <Fade delay={0.05}>
        <section className="space-y-3">
          <div className="space-y-1">
            <h2 className="text-xs uppercase tracking-wider text-muted-foreground">
              {k('journeyHeader')}
            </h2>
            <p className="text-xs text-muted-foreground/80 max-w-3xl">
              {k('journeySub')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {journey.map((j, i) => {
              const Icon = stepIcons[i] ?? SparklesIcon
              return (
                <MagicCard key={j.step} className="p-5 space-y-3 relative">
                  <div className="flex items-center gap-2">
                    <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary ring-1 ring-primary/20">
                      <Icon className="size-3.5" />
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground tabular-nums font-semibold">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-heading text-base font-semibold leading-tight">
                      {j.step}
                    </h3>
                    <Badge variant="outline" className="text-[10px] h-5 px-1.5">
                      {j.duration}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {j.what}
                  </p>
                  <div className="text-xs pt-2 border-t border-border/50">
                    <div className="uppercase tracking-wider text-[9px] font-semibold text-muted-foreground/70 mb-0.5">
                      {t('overviewLabels.evaluated', {
                        defaultValue: 'What they evaluate',
                      })}
                    </div>
                    <div className="leading-relaxed">{j.evaluated}</div>
                  </div>
                </MagicCard>
              )
            })}
          </div>
        </section>
      </Fade>

      <Fade delay={0.12}>
        <section className="space-y-3">
          <div className="space-y-1">
            <h2 className="text-xs uppercase tracking-wider text-muted-foreground">
              {k('distinctiveHeader')}
            </h2>
            <p className="text-xs text-muted-foreground/80 max-w-3xl">
              {k('distinctiveSub')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {distinctive.map((d, i) => (
              <MagicCard key={d.title} className="p-5 space-y-2">
                <div className="flex items-start gap-2">
                  <span className="shrink-0 flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary text-[11px] font-semibold ring-1 ring-primary/20 tabular-nums mt-0.5">
                    {i + 1}
                  </span>
                  <h3 className="font-heading text-base font-semibold leading-tight">
                    {d.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {d.body}
                </p>
              </MagicCard>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 pt-2 text-xs">
            <Link
              to={`/${companySlug}/overview/power-day`}
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              <ChevronRightIcon className="size-3" />
              {k('valuesLink')}
            </Link>
            <Link
              to={`/${companySlug}/overview/gca`}
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              <ChevronRightIcon className="size-3" />
              {k('pipelineLink')}
            </Link>
          </div>
        </section>
      </Fade>

      <Fade delay={0.2}>
        <section className="space-y-3">
          <div className="space-y-1">
            <h2 className="text-xs uppercase tracking-wider text-muted-foreground">
              {k('planHeader')}
            </h2>
            <p className="text-xs text-muted-foreground/80 max-w-3xl">
              {k('planSub')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {plan.map((p, i) => {
              const Icon = planIcons[p.to] ?? SparklesIcon
              const primary = i === 0
              return (
                <Link
                  key={p.to}
                  to={`/${companySlug}/${p.to}`}
                  className="group block"
                >
                  <MagicCard
                    className={cn(
                      'relative overflow-hidden h-full p-5 transition-all',
                      'hover:border-primary/40'
                    )}
                  >
                    {primary && (
                      <BorderBeam
                        size={140}
                        duration={10}
                        colorFrom="var(--primary)"
                        colorTo="var(--chart-2)"
                      />
                    )}
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className={cn(
                          'flex size-9 items-center justify-center rounded-lg ring-1',
                          primary
                            ? 'bg-primary/10 text-primary ring-primary/20'
                            : 'bg-muted/40 text-muted-foreground ring-border/60 group-hover:text-foreground'
                        )}
                      >
                        <Icon className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-heading text-sm font-semibold truncate">
                          {p.title}
                        </h3>
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground/80 truncate">
                          {p.subtitle}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {p.body}
                    </p>
                    <div
                      className={cn(
                        'inline-flex items-center gap-1.5 text-xs mt-4 font-medium',
                        primary ? 'text-primary' : 'text-foreground'
                      )}
                    >
                      {p.cta}
                      <ArrowRightIcon className="size-3 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </MagicCard>
                </Link>
              )
            })}
          </div>
        </section>
      </Fade>
    </div>
  )
}

function PhaseCard({ companySlug, phase }: { companySlug: string; phase: Phase }) {
  return (
    <MagicCard className="p-6 h-full">
      <header className="mb-5 pb-4 border-b border-border/60">
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex size-1.5 rounded-full bg-primary" />
          <h3 className="font-heading text-base font-semibold tracking-tight">
            {phase.name}
          </h3>
        </div>
        {phase.description && (
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            {phase.description}
          </p>
        )}
      </header>
      <ul className="space-y-1">
        {phase.sections.map((section) => {
          const Icon = iconForKind(section.kind)
          const isMock = section.id.endsWith('-mock')
          return (
            <li key={section.id}>
              <Link
                to={hrefForSection(companySlug, section)}
                className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-muted transition-colors border border-transparent hover:border-border"
              >
                <span
                  className={
                    'flex size-8 items-center justify-center rounded-md ring-1 ring-border/60 ' +
                    (isMock
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted/40 text-muted-foreground group-hover:text-foreground')
                  }
                >
                  <Icon className="size-4" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{section.name}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground/80">
                    {kindLabel(section.kind)}
                  </div>
                </div>
                {isMock ? (
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/10 border-0">
                    Timed
                  </Badge>
                ) : null}
                <ChevronRightIcon className="size-4 text-muted-foreground/60 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
              </Link>
            </li>
          )
        })}
      </ul>
    </MagicCard>
  )
}
