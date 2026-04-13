// Mock GCA dashboard — /:companySlug/mock-gca.
// Lists 10 curated scenarios; clicking one opens the runner at
// /:companySlug/mock-gca/:mockId (MockExamRunnerPage).

import { ArrowRightIcon, ClockIcon, TargetIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router'
import { Fade } from '@/components/animate-ui/primitives/effects/fade'
import { GradientText } from '@/components/animate-ui/primitives/texts/gradient'
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { GCA_SCENARIOS, type MockScenario } from '@/data/mock-scenarios'

export function MockExamPage() {
  const { companySlug = '' } = useParams()
  return (
    <MockDashboard
      companySlug={companySlug}
      scenarios={GCA_SCENARIOS}
      title="Mock GCA"
      subtitle="70-min timed coding · 4 problems · pick a scenario"
      baseRoute={`/${companySlug}/mock-gca`}
    />
  )
}

type MockDashboardProps = {
  companySlug: string
  scenarios: MockScenario[]
  title: string
  subtitle: string
  baseRoute: string
}

export function MockDashboard({
  scenarios,
  title,
  subtitle,
  baseRoute,
}: MockDashboardProps) {
  const { t } = useTranslation()

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
            <header className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight font-heading">
                <GradientText
                  text={title}
                  gradient="linear-gradient(90deg, var(--primary) 0%, var(--chart-2) 50%, var(--chart-4) 100%)"
                />
              </h1>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <ClockIcon className="size-4" />
                {subtitle}
              </p>
            </header>
          </Fade>

          <Fade delay={0.1}>
            <div className="rounded-xl border bg-card/60 backdrop-blur-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[56px] text-center">#</TableHead>
                    <TableHead>{t('mockDashboard.name', { defaultValue: 'Scenario' })}</TableHead>
                    <TableHead className="w-[120px]">
                      {t('mockDashboard.difficulty', { defaultValue: 'Difficulty' })}
                    </TableHead>
                    <TableHead>{t('mockDashboard.focus', { defaultValue: 'Focus' })}</TableHead>
                    <TableHead className="w-[120px] text-right">
                      {t('mockDashboard.action', { defaultValue: 'Launch' })}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scenarios.map((s, i) => (
                    <TableRow key={s.id} className="group">
                      <TableCell className="text-center text-xs text-muted-foreground tabular-nums">
                        {String(i + 1).padStart(2, '0')}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{s.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          {s.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DifficultyBadge level={s.difficulty} />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {s.focus.map((f) => (
                            <Badge
                              key={f}
                              variant="outline"
                              className="text-[10px] gap-1 px-1.5 py-0"
                            >
                              <TargetIcon className="size-2.5" />
                              {f}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link
                          to={`${baseRoute}/${s.id}`}
                          className={cn(
                            buttonVariants({ variant: 'default', size: 'sm' }),
                            'gap-1.5'
                          )}
                        >
                          {t('mockDashboard.start', { defaultValue: 'Start' })}
                          <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Fade>
        </div>
      </div>
    </div>
  )
}

function DifficultyBadge({ level }: { level: MockScenario['difficulty'] }) {
  const map: Record<MockScenario['difficulty'], { label: string; className: string }> = {
    easy: {
      label: 'Easy',
      className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
    },
    medium: {
      label: 'Medium',
      className: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
    },
    hard: {
      label: 'Hard',
      className: 'bg-rose-500/10 text-rose-600 border-rose-500/30',
    },
  }
  const { label, className } = map[level]
  return (
    <Badge variant="outline" className={cn('font-medium', className)}>
      {label}
    </Badge>
  )
}
