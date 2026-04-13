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

import { ClockIcon, ShuffleIcon, ChevronRightIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router'
import { Fade } from '@/components/animate-ui/primitives/effects/fade'
import { GradientText } from '@/components/animate-ui/primitives/texts/gradient'
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
      <>
        <div className="px-6 py-10 max-w-5xl mx-auto w-full space-y-4">
          <Skeleton className="h-10 w-80" />
          <Skeleton className="h-4 w-96" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-60 rounded-xl" />
            ))}
          </div>
        </div>
      </>
    )
  }

  if (companyQuery.error || !companyQuery.data) {
    return (
      <>
        <div className="px-6 py-10 max-w-5xl mx-auto">
          <p className="text-destructive">
            {companyQuery.error?.message ?? 'Company not found'}
          </p>
        </div>
      </>
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
    <>
      <div className="px-6 py-10 max-w-5xl mx-auto w-full space-y-8">
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
    </>
  )
}

type Phase = {
  id: string
  name: string
  description: string
  sections: Array<{ id: string; name: string; kind: string }>
}

function PhaseCard({ companySlug, phase }: { companySlug: string; phase: Phase }) {
  return (
    <MagicCard className="p-6 h-full">
      <header className="mb-4">
        <h3 className="font-heading text-lg font-semibold">{phase.name}</h3>
        {phase.description && (
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            {phase.description}
          </p>
        )}
      </header>
      <ul className="space-y-1.5">
        {phase.sections.map((section) => (
          <li key={section.id}>
            <Link
              to={`/${companySlug}`}
              className="group flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
            >
              <span className="flex-1 truncate">{section.name}</span>
              <Badge variant="outline" className="text-xs">
                {section.kind}
              </Badge>
              <ChevronRightIcon className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </li>
        ))}
      </ul>
    </MagicCard>
  )
}
