// Individual chapter page for /:companySlug/overview/:topic/:page.
// Dispatches to the matching render block, then shows Prev/Next.

import { useTranslation } from 'react-i18next'
import { Navigate, useParams } from 'react-router'
import { Fade } from '@/components/animate-ui/primitives/effects/fade'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import {
  type DeepItem,
  OverviewAntiPatternsAccordion,
  OverviewConceptsTabs,
  OverviewDeepCards,
  OverviewFingerprints,
  OverviewGlossary,
  OverviewGrid,
  OverviewPrepTimeline,
  OverviewRoundsTabs,
  OverviewSkipList,
  OverviewTimeline,
  OverviewValuesTabs,
  tArray,
} from '@/pages/SectionPage'
import {
  chaptersFor,
  type Chapter,
  type ChapterSlug,
  type OverviewTopic,
} from './chapters'
import { PrevNextNav } from './OverviewLayout'

export function OverviewSubPage() {
  const { companySlug = '', topic = 'power-day', page } = useParams()
  const safeTopic: OverviewTopic =
    topic === 'gca' || topic === 'power-day' ? topic : 'power-day'
  const chapters = chaptersFor(safeTopic)
  const baseTo = `/${companySlug}/overview/${safeTopic}`

  const current: Chapter | undefined = chapters.find(
    (c) => c.slug === (page as ChapterSlug)
  )

  if (!current) {
    // Unknown page under a valid topic → redirect to the topic landing.
    return <Navigate to={baseTo} replace />
  }

  const { t } = useTranslation()

  return (
    <>
      <Fade>
        <header className="space-y-2 pb-4 border-b border-border/60">
          <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight">
            {t(current.titleKey)}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            {t(current.blurbKey)}
          </p>
        </header>
      </Fade>

      <Fade delay={0.08}>
        <div>
          <ChapterContent topic={safeTopic} slug={current.slug} />
        </div>
      </Fade>

      <PrevNextNav chapters={chapters} currentSlug={current.slug} baseTo={baseTo} />
    </>
  )
}

function ChapterContent({
  topic,
  slug,
}: {
  topic: OverviewTopic
  slug: ChapterSlug
}) {
  const { t } = useTranslation()

  const labels = {
    evaluated: t('overviewLabels.evaluated', { defaultValue: 'What they evaluate' }),
    pacing: t('overviewLabels.pacing', { defaultValue: 'Pacing' }),
    pitfalls: t('overviewLabels.pitfalls', { defaultValue: 'Common pitfalls' }),
    signal: t('overviewLabels.signal', { defaultValue: 'Signal' }),
    antiSignal: t('overviewLabels.antiSignal', { defaultValue: 'Anti-signal' }),
    petPeeve: t('overviewLabels.petPeeve', { defaultValue: 'Pet peeve' }),
    category: t('overviewLabels.category', { defaultValue: 'Category' }),
    products: t('overviewLabels.products', { defaultValue: 'Products' }),
    why: t('overviewLabels.why', { defaultValue: 'Why it exists' }),
    bad: t('overviewLabels.bad', { defaultValue: 'Anti-pattern' }),
    fix: t('overviewLabels.fix', { defaultValue: 'Say this instead' }),
    whyCosts: t('overviewLabels.why', { defaultValue: 'Why it costs you' }),
    pattern: t('overviewLabels.pattern', { defaultValue: 'Pattern' }),
    trap: t('overviewLabels.trap', { defaultValue: 'Trap' }),
    definition: t('overviewLabels.definition', { defaultValue: 'What it is' }),
    whyMatters: t('overviewLabels.whyMatters', { defaultValue: 'Why Capital One cares' }),
    inPractice: t('overviewLabels.inPractice', { defaultValue: 'In practice' }),
  }

  // ── Power Day chapters ────────────────────────────────────────────
  if (topic === 'power-day') {
    if (slug === 'timeline') {
      const items = tArray<{ time: string; label: string; note: string }>(
        t,
        'sectionOverview.powerDay.timeline'
      )
      return (
        <OverviewTimeline
          header={t('sectionOverview.powerDay.timelineHeader')}
          items={items}
        />
      )
    }
    if (slug === 'concepts') {
      const items = tArray<{
        term: string
        definition: string
        why: string
        example: string
      }>(t, 'sectionOverview.powerDay.concepts')
      return (
        <OverviewConceptsTabs
          header={t('sectionOverview.powerDay.conceptsHeader')}
          sub={t('sectionOverview.powerDay.conceptsSub')}
          items={items}
          labels={{
            definition: labels.definition,
            whyMatters: labels.whyMatters,
            inPractice: labels.inPractice,
          }}
        />
      )
    }
    if (slug === 'rounds') {
      const items = tArray<DeepItem>(t, 'sectionOverview.powerDay.roundsDeep')
      return (
        <OverviewRoundsTabs
          header={t('sectionOverview.powerDay.roundsHeader')}
          items={items}
          labels={{
            evaluated: labels.evaluated,
            pacing: labels.pacing,
            pitfalls: labels.pitfalls,
          }}
        />
      )
    }
    if (slug === 'values') {
      const items = tArray<{
        title: string
        body: string
        signal: string
        antiSignal: string
        petPeeve: string
      }>(t, 'sectionOverview.powerDay.valuesDeep')
      return (
        <OverviewValuesTabs
          header={t('sectionOverview.powerDay.valuesHeader')}
          items={items}
          labels={{
            signal: labels.signal,
            antiSignal: labels.antiSignal,
            petPeeve: labels.petPeeve,
          }}
        />
      )
    }
    if (slug === 'glossary') {
      const items = tArray<{
        category: string
        products: string
        why: string
      }>(t, 'sectionOverview.powerDay.glossary')
      return (
        <OverviewGlossary
          header={t('sectionOverview.powerDay.glossaryHeader')}
          sub={t('sectionOverview.powerDay.glossarySub')}
          rows={items}
          columns={{
            category: labels.category,
            products: labels.products,
            why: labels.why,
          }}
        />
      )
    }
    if (slug === 'anti-patterns') {
      const items = tArray<{ bad: string; why: string; fix: string }>(
        t,
        'sectionOverview.powerDay.antiPatterns'
      )
      return (
        <OverviewAntiPatternsAccordion
          header={t('sectionOverview.powerDay.antiPatternsHeader')}
          items={items}
          labels={{ bad: labels.bad, why: labels.whyCosts, fix: labels.fix }}
        />
      )
    }
    if (slug === 'prep') {
      const items = tArray<{ when: string; tasks: string[] }>(
        t,
        'sectionOverview.powerDay.prep'
      )
      return (
        <OverviewPrepTimeline
          header={t('sectionOverview.powerDay.prepHeader')}
          items={items}
        />
      )
    }
  }

  // ── GCA chapters ──────────────────────────────────────────────────
  if (topic === 'gca') {
    if (slug === 'scoring') {
      const items = tArray<{ title: string; body: string }>(
        t,
        'sectionOverview.gca.scoring'
      )
      return (
        <OverviewGrid
          header={t('sectionOverview.gca.scoringHeader')}
          items={items}
        />
      )
    }
    if (slug === 'modules') {
      const modulesDeep = tArray<DeepItem>(t, 'sectionOverview.gca.modulesDeep')
      const weights = ['100', '200', '300', '400']
      const modulesWithWeight = modulesDeep.map((m, i) => ({
        ...m,
        weight: weights[i],
      })) as (DeepItem & { weight: string })[]
      return (
        <OverviewDeepCards
          header={t('sectionOverview.gca.modulesHeader')}
          items={modulesWithWeight}
          labels={{
            pattern: labels.pattern,
            pacing: labels.pacing,
            trap: labels.trap,
          }}
        />
      )
    }
    if (slug === 'patterns') {
      const items = tArray<{ category: string; signal: string }>(
        t,
        'sectionOverview.gca.fingerprints'
      )
      return (
        <OverviewFingerprints
          header={t('sectionOverview.gca.fingerprintsHeader')}
          rows={items}
          columns={{
            category: labels.pattern,
            signal: labels.signal,
          }}
        />
      )
    }
    if (slug === 'skip') {
      const items = tArray<string>(t, 'sectionOverview.gca.skip')
      return (
        <OverviewSkipList
          header={t('sectionOverview.gca.skipHeader')}
          items={items}
        />
      )
    }
    if (slug === 'gca-anti-patterns') {
      const items = tArray<{ bad: string; why: string; fix: string }>(
        t,
        'sectionOverview.gca.antiPatterns'
      )
      return (
        <OverviewAntiPatternsAccordion
          header={t('sectionOverview.gca.antiPatternsHeader')}
          items={items}
          labels={{ bad: labels.bad, why: labels.whyCosts, fix: labels.fix }}
        />
      )
    }
  }

  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>Chapter not found</EmptyTitle>
        <EmptyDescription>
          This chapter doesn't exist yet. Pick another from the sidebar.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
