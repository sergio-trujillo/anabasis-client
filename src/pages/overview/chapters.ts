// Chapters that make up each overview topic. Flat, reading-order list —
// these pages are sequential, not hierarchical. Keeping them here (vs.
// inlined in the router) lets OverviewLayout, OverviewLanding, PrevNext,
// and breadcrumb rendering all share the same source of truth.
//
// `slug` is what ends up in the URL (/overview/:topic/:slug).
// `titleKey` + `blurbKey` resolve via i18next, so content stays bilingual.
// `readMinutes` is a rough estimate used for the "N min read" badge.

export type ChapterSlug =
  // power-day
  | 'timeline'
  | 'concepts'
  | 'rounds'
  | 'values'
  | 'glossary'
  | 'anti-patterns'
  | 'prep'
  // gca
  | 'scoring'
  | 'modules'
  | 'patterns'
  | 'skip'
  | 'gca-anti-patterns'

export type Chapter = {
  slug: ChapterSlug
  titleKey: string
  blurbKey: string
  readMinutes: number
}

export const POWER_DAY_CHAPTERS: Chapter[] = [
  {
    slug: 'timeline',
    titleKey: 'overviewChapters.powerDay.timeline.title',
    blurbKey: 'overviewChapters.powerDay.timeline.blurb',
    readMinutes: 2,
  },
  {
    slug: 'concepts',
    titleKey: 'overviewChapters.powerDay.concepts.title',
    blurbKey: 'overviewChapters.powerDay.concepts.blurb',
    readMinutes: 8,
  },
  {
    slug: 'rounds',
    titleKey: 'overviewChapters.powerDay.rounds.title',
    blurbKey: 'overviewChapters.powerDay.rounds.blurb',
    readMinutes: 7,
  },
  {
    slug: 'values',
    titleKey: 'overviewChapters.powerDay.values.title',
    blurbKey: 'overviewChapters.powerDay.values.blurb',
    readMinutes: 5,
  },
  {
    slug: 'glossary',
    titleKey: 'overviewChapters.powerDay.glossary.title',
    blurbKey: 'overviewChapters.powerDay.glossary.blurb',
    readMinutes: 5,
  },
  {
    slug: 'anti-patterns',
    titleKey: 'overviewChapters.powerDay.antiPatterns.title',
    blurbKey: 'overviewChapters.powerDay.antiPatterns.blurb',
    readMinutes: 4,
  },
  {
    slug: 'prep',
    titleKey: 'overviewChapters.powerDay.prep.title',
    blurbKey: 'overviewChapters.powerDay.prep.blurb',
    readMinutes: 3,
  },
]

export const GCA_CHAPTERS: Chapter[] = [
  {
    slug: 'scoring',
    titleKey: 'overviewChapters.gca.scoring.title',
    blurbKey: 'overviewChapters.gca.scoring.blurb',
    readMinutes: 2,
  },
  {
    slug: 'modules',
    titleKey: 'overviewChapters.gca.modules.title',
    blurbKey: 'overviewChapters.gca.modules.blurb',
    readMinutes: 6,
  },
  {
    slug: 'patterns',
    titleKey: 'overviewChapters.gca.patterns.title',
    blurbKey: 'overviewChapters.gca.patterns.blurb',
    readMinutes: 4,
  },
  {
    slug: 'skip',
    titleKey: 'overviewChapters.gca.skip.title',
    blurbKey: 'overviewChapters.gca.skip.blurb',
    readMinutes: 2,
  },
  {
    slug: 'gca-anti-patterns',
    titleKey: 'overviewChapters.gca.antiPatterns.title',
    blurbKey: 'overviewChapters.gca.antiPatterns.blurb',
    readMinutes: 3,
  },
]

export type OverviewTopic = 'power-day' | 'gca'

export function chaptersFor(topic: OverviewTopic): Chapter[] {
  return topic === 'power-day' ? POWER_DAY_CHAPTERS : GCA_CHAPTERS
}

export function topicTitleKey(topic: OverviewTopic): string {
  return topic === 'power-day'
    ? 'overviewChapters.powerDay.topic.title'
    : 'overviewChapters.gca.topic.title'
}

export function topicBlurbKey(topic: OverviewTopic): string {
  return topic === 'power-day'
    ? 'overviewChapters.powerDay.topic.blurb'
    : 'overviewChapters.gca.topic.blurb'
}
