// Catalog landing — "choose your campaign".
// Adapted from anabasis-client v1, upgraded with Praxema's visual kit
// (MagicCard, BorderBeam, Fade, AnimatedGridPattern, GradientText).
//
// Data: trpc.companies.list (Capital One `active`, 5 `coming-soon` stubs).
// The active company gets a hero-MagicCard with BorderBeam accent; coming-
// soon companies render as muted MagicCards without the beam.

import { LockIcon, ArrowRightIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { Fade } from '@/components/animate-ui/primitives/effects/fade'
import { GradientText } from '@/components/animate-ui/primitives/texts/gradient'
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern'
import { Badge } from '@/components/ui/badge'
import { BorderBeam } from '@/components/ui/border-beam'
import { MagicCard } from '@/components/ui/magic-card'
import { Skeleton } from '@/components/ui/skeleton'
import { trpc } from '@/lib/trpc'

export function CatalogPage() {
  const { t } = useTranslation()
  const { data, isPending, error } = trpc.companies.list.useQuery()

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="relative min-h-[calc(100vh-3.5rem)]">
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.06}
          duration={3}
          className="absolute inset-0 -z-10 [mask-image:radial-gradient(500px_circle_at_center,white,transparent)]"
        />

        <div className="relative px-6 py-12 max-w-6xl mx-auto w-full">
          <Fade>
            <header className="mb-10 space-y-2">
              <h1 className="text-4xl font-bold tracking-tight font-heading">
                <GradientText
                  text={t('catalog.title')}
                  gradient="linear-gradient(90deg, var(--primary) 0%, var(--chart-2) 40%, var(--chart-4) 80%, var(--primary) 100%)"
                />
              </h1>
              <p className="text-sm text-muted-foreground">{t('brand.tagline')}</p>
            </header>
          </Fade>

          <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
            {t('catalog.chooseCampaign')}
          </h2>

          {isPending && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-40 rounded-xl" />
              ))}
            </div>
          )}

          {error && (
            <p className="text-destructive text-sm">
              {t('catalog.errorLoading')}: {error.message}
            </p>
          )}

          {data && (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.map((company, i) => {
                const isActive = company.status === 'active'
                const card = (
                  <MagicCard
                    className={
                      isActive
                        ? 'h-full p-6 cursor-pointer group relative overflow-hidden'
                        : 'h-full p-6 opacity-50 relative overflow-hidden'
                    }
                  >
                    {isActive && (
                      <BorderBeam
                        size={120}
                        duration={8}
                        colorFrom={company.accentColor ?? 'var(--primary)'}
                        colorTo="var(--chart-2)"
                      />
                    )}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="font-heading text-lg font-semibold">{company.name}</h3>
                      {isActive ? (
                        <Badge
                          style={{
                            backgroundColor: company.accentColor,
                            color: '#fff',
                          }}
                        >
                          {t('catalog.active')}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1">
                          <LockIcon className="size-3" />
                          {t('catalog.soon')}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {company.tagline}
                    </p>
                    {isActive && (
                      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRightIcon className="size-4 text-primary" />
                      </div>
                    )}
                  </MagicCard>
                )
                return (
                  <li key={company.slug}>
                    <Fade delay={i * 0.05}>
                      {isActive ? <Link to={`/${company.slug}`}>{card}</Link> : card}
                    </Fade>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
