// Catalog landing — the Anabasis dashboard.
// Route: "/".
//
// Visual kit: AnimatedGridPattern backdrop, GradientText + Shine hero,
// NumberTicker stats, MagicCard + BorderBeam + Shine for the active
// campaign, Tilt for coming-soon tiles. All pieces are already installed
// in /components/animate-ui and /components/ui.

import {
  ArrowRightIcon,
  ClockIcon,
  FlagIcon,
  LockIcon,
  ShuffleIcon,
  SparklesIcon,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { Fade } from '@/components/animate-ui/primitives/effects/fade'
import { Shine } from '@/components/animate-ui/primitives/effects/shine'
import { Tilt, TiltContent } from '@/components/animate-ui/primitives/effects/tilt'
import { GradientText } from '@/components/animate-ui/primitives/texts/gradient'
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern'
import { Badge } from '@/components/ui/badge'
import { BorderBeam } from '@/components/ui/border-beam'
import { buttonVariants } from '@/components/ui/button'
import { MagicCard } from '@/components/ui/magic-card'
import { NumberTicker } from '@/components/ui/number-ticker'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { trpc } from '@/lib/trpc'

type Company = {
  slug: string
  name: string
  status: 'active' | 'coming-soon'
  tagline: string
  accentColor?: string
}

export function CatalogPage() {
  const { t } = useTranslation()
  const { data, isPending, error } = trpc.companies.list.useQuery()

  const companies = (data ?? []) as Company[]
  const active = companies.filter((c) => c.status === 'active')
  const soon = companies.filter((c) => c.status === 'coming-soon')
  const featured = active[0]

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="relative min-h-[calc(100vh-3.5rem)]">
        <AnimatedGridPattern
          numSquares={36}
          maxOpacity={0.07}
          duration={3}
          className="absolute inset-0 -z-10 [mask-image:radial-gradient(700px_circle_at_top,white,transparent)]"
        />

        <div className="relative p-2 w-full space-y-8">
          <Hero />

          {isPending ? (
            <LoadingState />
          ) : error ? (
            <p className="text-destructive text-sm">
              {t('catalog.errorLoading')}: {error.message}
            </p>
          ) : (
            <>
              <StatsRow
                active={active.length}
                soon={soon.length}
                total={companies.length}
              />

              {featured && <FeaturedCampaign company={featured} />}

              {soon.length > 0 && <ComingSoonGrid companies={soon} />}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function Hero() {
  const { t } = useTranslation()
  return (
    <Fade>
      <section className="space-y-4">
        <Badge variant="outline" className="gap-1.5 rounded-full p-2">
          <SparklesIcon className="size-3 text-primary" />
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
            {t('catalog.heroKicker')}
          </span>
        </Badge>

        <Shine
          enable
          duration={2800}
          loop
          loopDelay={4500}
          color="var(--primary)"
          opacity={0.35}
        >
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight font-heading leading-[1.08] max-w-3xl">
            <GradientText
              text={t('catalog.heroHeadline')}
              gradient="linear-gradient(90deg, var(--primary) 0%, var(--chart-2) 40%, var(--chart-4) 80%, var(--primary) 100%)"
            />
          </h1>
        </Shine>

        <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
          {t('catalog.heroSubtitle')}
        </p>
      </section>
    </Fade>
  )
}

function StatsRow({
  active,
  soon,
  total,
}: {
  active: number
  soon: number
  total: number
}) {
  const { t } = useTranslation()
  const stats: Array<{ label: string; value: number; icon: typeof FlagIcon }> = [
    { label: t('catalog.statsActive'), value: active, icon: FlagIcon },
    { label: t('catalog.statsSoon'), value: soon, icon: ClockIcon },
    { label: t('catalog.statsTotal'), value: total, icon: SparklesIcon },
  ]
  return (
    <Fade delay={0.1}>
      <section className="grid grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <MagicCard key={label} className="p-5 flex items-center gap-4">
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
              <Icon className="size-5" />
            </span>
            <div className="min-w-0">
              <div className="text-3xl font-bold font-heading tabular-nums">
                <NumberTicker value={value} />
              </div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground truncate">
                {label}
              </div>
            </div>
          </MagicCard>
        ))}
      </section>
    </Fade>
  )
}

function FeaturedCampaign({ company }: { company: Company }) {
  const { t } = useTranslation()
  const accent = company.accentColor ?? 'var(--primary)'
  return (
    <Fade delay={0.18}>
      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground">
          {t('catalog.featured')}
        </h2>

        <MagicCard className="relative overflow-hidden p-0">
          <BorderBeam
            size={240}
            duration={10}
            colorFrom={accent}
            colorTo="var(--chart-2)"
          />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
            <div className="md:col-span-3 p-8 relative">
              <Shine
                enable
                duration={2400}
                loop
                loopDelay={6000}
                color={accent}
                opacity={0.25}
              >
                <div className="space-y-5">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-flex size-2 rounded-full animate-pulse"
                      style={{ backgroundColor: accent }}
                    />
                    <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      {t('catalog.featuredEyebrow')}
                    </span>
                  </div>

                  <h3 className="font-heading text-4xl font-bold tracking-tight">
                    <GradientText
                      text={company.name}
                      gradient={`linear-gradient(90deg, ${accent} 0%, var(--chart-2) 60%, ${accent} 100%)`}
                    />
                  </h3>

                  <p className="text-base text-muted-foreground leading-relaxed max-w-lg">
                    {company.tagline}
                  </p>

                  <Link
                    to={`/${company.slug}`}
                    className={cn(
                      buttonVariants({ variant: 'default', size: 'lg' }),
                      'group/cta gap-2'
                    )}
                    style={{ backgroundColor: accent }}
                  >
                    {t('catalog.launchCampaign')}
                    <ArrowRightIcon className="size-4 transition-transform group-hover/cta:translate-x-0.5" />
                  </Link>
                </div>
              </Shine>
            </div>

            <div className="md:col-span-2 p-6 md:border-l border-t md:border-t-0 border-border/50 bg-muted/20 space-y-3">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
                {t('catalog.quickLaunch')}
              </div>

              <QuickLaunchLink
                to={`/${company.slug}/mock-power-day`}
                icon={ClockIcon}
                label={t('catalog.mockPowerDay')}
                accent={accent}
                primary
              />
              <QuickLaunchLink
                to={`/${company.slug}/mock-gca`}
                icon={ClockIcon}
                label={t('catalog.mockGca')}
                accent={accent}
              />
              <QuickLaunchLink
                to={`/${company.slug}/practice`}
                icon={ShuffleIcon}
                label={t('nav.practice')}
                accent={accent}
              />
            </div>
          </div>
        </MagicCard>
      </section>
    </Fade>
  )
}

function QuickLaunchLink({
  to,
  icon: Icon,
  label,
  accent,
  primary = false,
}: {
  to: string
  icon: typeof ClockIcon
  label: string
  accent: string
  primary?: boolean
}) {
  return (
    <Link
      to={to}
      className={cn(
        'group flex items-center gap-3 rounded-lg border px-3 py-3 text-sm transition-all',
        'hover:bg-background hover:border-border',
        primary
          ? 'border-primary/30 bg-background'
          : 'border-border/40 bg-transparent'
      )}
    >
      <span
        className="flex size-8 items-center justify-center rounded-md ring-1 ring-border/60"
        style={{
          backgroundColor: primary ? `${accent}1A` : 'transparent',
          color: primary ? accent : undefined,
        }}
      >
        <Icon className="size-4" />
      </span>
      <span className="flex-1 font-medium truncate">{label}</span>
      <ArrowRightIcon className="size-4 text-muted-foreground/60 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
    </Link>
  )
}

function ComingSoonGrid({ companies }: { companies: Company[] }) {
  const { t } = useTranslation()
  return (
    <Fade delay={0.26}>
      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xs uppercase tracking-wider text-muted-foreground">
            {t('catalog.comingSoonHeader')}
          </h2>
          <span className="text-[11px] text-muted-foreground/70">
            {t('catalog.lockedHint')}
          </span>
        </div>

        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {companies.map((company, i) => (
            <li key={company.slug}>
              <Fade delay={0.3 + i * 0.04}>
                <Tilt maxTilt={6}>
                  <TiltContent>
                    <ComingSoonCard company={company} />
                  </TiltContent>
                </Tilt>
              </Fade>
            </li>
          ))}
        </ul>
      </section>
    </Fade>
  )
}

function ComingSoonCard({ company }: { company: Company }) {
  const { t } = useTranslation()
  const accent = company.accentColor ?? 'var(--primary)'
  return (
    <MagicCard className="h-full p-4 relative overflow-hidden opacity-80 hover:opacity-100 transition-opacity">
      <div
        className="absolute inset-x-0 top-0 h-0.5"
        style={{ backgroundColor: accent, opacity: 0.5 }}
      />
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-heading text-sm font-semibold truncate">
          {company.name}
        </h3>
        <Badge variant="outline" className="gap-1 text-[10px] px-1.5">
          <LockIcon className="size-2.5" />
          {t('catalog.soon')}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
        {company.tagline}
      </p>
    </MagicCard>
  )
}

function LoadingState() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-56 rounded-xl" />
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    </div>
  )
}
