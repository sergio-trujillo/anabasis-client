// Hub landing for /:companySlug/overview/:topic.
// Renders the topic intro + a grid of chapter cards + PrevNext (only the
// Next link, since this is chapter 0).

import { ArrowRightIcon, BookOpenIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router'
import { Fade } from '@/components/animate-ui/primitives/effects/fade'
import { GradientText } from '@/components/animate-ui/primitives/texts/gradient'
import { Badge } from '@/components/ui/badge'
import { BorderBeam } from '@/components/ui/border-beam'
import { MagicCard } from '@/components/ui/magic-card'
import {
  chaptersFor,
  type OverviewTopic,
  topicBlurbKey,
  topicTitleKey,
} from './chapters'
import { PrevNextNav } from './OverviewLayout'

export function OverviewLandingPage() {
  const { companySlug = '', topic = 'power-day' } = useParams()
  const safeTopic: OverviewTopic =
    topic === 'gca' || topic === 'power-day' ? topic : 'power-day'
  const chapters = chaptersFor(safeTopic)
  const { t } = useTranslation()
  const baseTo = `/${companySlug}/overview/${safeTopic}`

  return (
    <>
      <Fade>
        <section className="relative overflow-hidden rounded-xl">
          <MagicCard className="relative p-8 md:p-10 space-y-4">
            <BorderBeam size={200} duration={12} />
            <Badge variant="outline" className="gap-1.5 rounded-full">
              <BookOpenIcon data-icon="inline-start" />
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                {t('overviewChapters.actions.chapters')} · {chapters.length}
              </span>
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold font-heading tracking-tight leading-tight max-w-3xl">
              <GradientText
                text={t(topicTitleKey(safeTopic))}
                gradient="linear-gradient(90deg, var(--primary) 0%, var(--chart-2) 50%, var(--chart-4) 100%)"
              />
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">
              {t(topicBlurbKey(safeTopic))}
            </p>
          </MagicCard>
        </section>
      </Fade>

      <Fade delay={0.1}>
        <section className="space-y-3">
          <h2 className="text-xs uppercase tracking-wider text-muted-foreground">
            {t('overviewChapters.actions.chapters')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {chapters.map((c, i) => (
              <Link
                key={c.slug}
                to={`${baseTo}/${c.slug}`}
                className="group block"
              >
                <MagicCard className="p-5 h-full space-y-2 transition-colors hover:border-primary/40">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-60 tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[10px] h-5 px-1.5 font-normal"
                    >
                      {t('overviewChapters.actions.readMinutes', {
                        count: c.readMinutes,
                      })}
                    </Badge>
                  </div>
                  <h3 className="font-heading text-base font-semibold leading-tight">
                    {t(c.titleKey)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(c.blurbKey)}
                  </p>
                  <div className="inline-flex items-center gap-1 text-xs font-medium text-primary pt-2">
                    {t('overviewChapters.actions.continueReading')}
                    <ArrowRightIcon
                      data-icon="inline-end"
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </div>
                </MagicCard>
              </Link>
            ))}
          </div>
        </section>
      </Fade>

      <PrevNextNav chapters={chapters} currentSlug={undefined} baseTo={baseTo} />
    </>
  )
}
