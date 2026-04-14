// Individual chapter page for /:companySlug/overview/:topic/:page.
// Dispatches to the matching render block, then shows Prev/Next.

import { useTranslation } from 'react-i18next'
import { Navigate, useParams } from 'react-router'
import { Fade } from '@/components/animate-ui/primitives/effects/fade'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import {
  CompanyDistinctiveSection,
  CompanyJourneySection,
  CompanyLoopSection,
  CompanyTrainingSection,
} from '@/pages/CompanyPage'
import {
  type DeepItem,
  OverviewAntiPatternsAccordion,
  OverviewConcepts,
  OverviewDeepCards,
  OverviewFingerprints,
  OverviewGlossary,
  OverviewGrid,
  OverviewPanelCards,
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

export function OverviewSubPage() {
  const { companySlug = '', topic = 'power-day', page } = useParams()
  const safeTopic: OverviewTopic =
    topic === 'gca' || topic === 'power-day' || topic === 'company'
      ? topic
      : 'power-day'
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
          <ChapterContent
            topic={safeTopic}
            slug={current.slug}
            companySlug={companySlug}
          />
        </div>
      </Fade>

    </>
  )
}

function ChapterContent({
  topic,
  slug,
  companySlug,
}: {
  topic: OverviewTopic
  slug: ChapterSlug
  companySlug: string
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
    conceptSignals: t('overviewLabels.conceptSignals', {
      defaultValue: "Signals you're doing it well",
    }),
    conceptPitfalls: t('overviewLabels.conceptPitfalls', {
      defaultValue: 'Common mistakes',
    }),
  }

  // ── Power Day chapters ────────────────────────────────────────────
  // ── Company (Capital One) chapters ────────────────────────────────
  if (topic === 'company') {
    if (slug === 'journey') {
      return <CompanyJourneySection companySlug={companySlug} />
    }
    if (slug === 'distinctive') {
      return <CompanyDistinctiveSection companySlug={companySlug} />
    }
    if (slug === 'panel') {
      const panel = tArray<{
        title: string
        body: string
        level: string
        probes: string
        tip: string
      }>(t, 'companyOverview.capitalOne.panel')
      const ladder = tArray<{ category: string; signal: string }>(
        t,
        'companyOverview.capitalOne.ladder'
      )
      const vocab = tArray<{ category: string; products: string; why: string }>(
        t,
        'companyOverview.capitalOne.vocab'
      )
      return (
        <div className="space-y-8">
          <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
            {t('companyOverview.capitalOne.panelIntroBody')}
          </p>
          <OverviewPanelCards
            header={t('companyOverview.capitalOne.panelHeader')}
            sub={t('companyOverview.capitalOne.panelDisclaimer')}
            items={panel}
            labels={{
              level: t('overviewLabels.level', { defaultValue: 'Level' }),
              probes: t('overviewLabels.probes', { defaultValue: 'Probes for' }),
              tip: t('overviewLabels.tip', {
                defaultValue: 'How to read them',
              }),
            }}
          />
          <OverviewFingerprints
            header={t('companyOverview.capitalOne.ladderHeader')}
            rows={ladder}
            columns={{
              category: t('overviewLabels.level', { defaultValue: 'Level' }),
              signal: t('overviewLabels.signal', { defaultValue: 'Signal' }),
            }}
          />
          <OverviewGlossary
            header={t('companyOverview.capitalOne.vocabHeader')}
            sub={t('companyOverview.capitalOne.vocabSub')}
            rows={vocab}
            columns={{
              category: t('overviewLabels.category', { defaultValue: 'Term' }),
              products: t('overviewLabels.products', { defaultValue: 'Where it comes up' }),
              why: t('overviewLabels.why', { defaultValue: 'What it means' }),
            }}
          />
        </div>
      )
    }
    if (slug === 'training') {
      return <CompanyTrainingSection companySlug={companySlug} />
    }
    if (slug === 'loop') {
      return <CompanyLoopSection companySlug={companySlug} />
    }
  }

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
        signals?: string[]
        pitfalls?: string[]
      }>(t, 'sectionOverview.powerDay.concepts')
      return (
        <OverviewConcepts
          header={t('sectionOverview.powerDay.conceptsHeader')}
          sub={t('sectionOverview.powerDay.conceptsSub')}
          items={items}
          labels={{
            definition: labels.definition,
            whyMatters: labels.whyMatters,
            inPractice: labels.inPractice,
            signals: labels.conceptSignals,
            pitfalls: labels.conceptPitfalls,
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
    if (slug === 'language') {
      const items = tArray<{ bad: string; why: string; fix: string }>(
        t,
        'sectionOverview.powerDay.language'
      )
      return (
        <OverviewAntiPatternsAccordion
          header={t('sectionOverview.powerDay.languageHeader')}
          sub={t('sectionOverview.powerDay.languageSub')}
          items={items}
          labels={{ bad: labels.bad, why: labels.whyCosts, fix: labels.fix }}
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
    if (slug === 'narration') {
      const items = tArray<DeepItem>(t, 'sectionOverview.gca.narration')
      return (
        <OverviewDeepCards
          header={t('sectionOverview.gca.narrationHeader')}
          sub={t('sectionOverview.gca.narrationSub')}
          items={items}
          labels={{
            pattern: t('overviewLabels.script', { defaultValue: 'Script' }),
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
