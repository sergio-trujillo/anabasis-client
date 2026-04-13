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
  BookOpenIcon,
  BotIcon,
  BracesIcon,
  BriefcaseIcon,
  ChevronRightIcon,
  ClockIcon,
  FileCode2Icon,
  MessageSquareIcon,
  ShuffleIcon,
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
import { buttonVariants } from '@/components/ui/button'
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

            {isActive && (
              <div className="flex flex-wrap gap-2 mt-6">
                <Link
                  to={`/${companySlug}/mock-gca`}
                  className={cn(buttonVariants({ variant: 'default', size: 'lg' }))}
                >
                  <ClockIcon className="size-4" />
                  Mock GCA · 70 min
                </Link>
                <Link
                  to={`/${companySlug}/mock-power-day`}
                  className={cn(buttonVariants({ variant: 'default', size: 'lg' }))}
                >
                  <ClockIcon className="size-4" />
                  Mock Power Day · 3 hr
                </Link>
                <Link
                  to={`/${companySlug}/practice`}
                  className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }))}
                >
                  <ShuffleIcon className="size-4" />
                  {t('nav.practice')}
                </Link>
              </div>
            )}
          </header>
        </Fade>

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
  return `/${companySlug}/section/${section.id}`
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
