// Chapters that make up each overview topic. Flat, reading-order list —
// these pages are sequential, not hierarchical. Keeping them here (vs.
// inlined in the router) lets OverviewLayout, OverviewLanding, PrevNext,
// and breadcrumb rendering all share the same source of truth.
//
// `slug` is what ends up in the URL (/overview/:topic/:slug).
// `titleKey` + `blurbKey` resolve via i18next, so content stays bilingual.
// `readMinutes` is a rough estimate used for the "N min read" badge.

export type ChapterSlug =
  // company
  | 'journey'
  | 'distinctive'
  | 'panel'
  | 'training'
  | 'loop'
  // power-day
  | 'timeline'
  | 'concepts'
  | 'rounds'
  | 'values'
  | 'language'
  | 'glossary'
  | 'anti-patterns'
  | 'prep'
  // gca
  | 'scoring'
  | 'modules'
  | 'patterns'
  | 'narration'
  | 'skip'
  | 'gca-anti-patterns'

export type Chapter = {
  slug: ChapterSlug
  titleKey: string
  blurbKey: string
  readMinutes: number
  /**
   * Visual grouping for the chapter strip. Chapters with the same group id
   * are rendered adjacent under a shared label. Order is still authoritative
   * (the array is the reading sequence); group is layout metadata only.
   */
  group: ChapterGroup
}

export type ChapterGroup = {
  id: string
  labelKey: string
}

// Power Day — three themes: the shape of the day, language/fluency, tactics.
const PD_STRUCTURE: ChapterGroup = {
  id: 'pd-structure',
  labelKey: 'overviewGroups.powerDay.structure',
}
const PD_FLUENCY: ChapterGroup = {
  id: 'pd-fluency',
  labelKey: 'overviewGroups.powerDay.fluency',
}
const PD_TACTICS: ChapterGroup = {
  id: 'pd-tactics',
  labelKey: 'overviewGroups.powerDay.tactics',
}

// GCA — the assessment, the playbook, the recovery move.
const GCA_ASSESSMENT: ChapterGroup = {
  id: 'gca-assessment',
  labelKey: 'overviewGroups.gca.assessment',
}
const GCA_PLAYBOOK: ChapterGroup = {
  id: 'gca-playbook',
  labelKey: 'overviewGroups.gca.playbook',
}
const GCA_RECOVERY: ChapterGroup = {
  id: 'gca-recovery',
  labelKey: 'overviewGroups.gca.recovery',
}

// Company — context before action.
const CO_CONTEXT: ChapterGroup = {
  id: 'co-context',
  labelKey: 'overviewGroups.company.context',
}
const CO_ACTION: ChapterGroup = {
  id: 'co-action',
  labelKey: 'overviewGroups.company.action',
}

export const COMPANY_CHAPTERS: Chapter[] = [
  {
    slug: 'journey',
    titleKey: 'overviewChapters.company.journey.title',
    blurbKey: 'overviewChapters.company.journey.blurb',
    readMinutes: 4,
    group: CO_CONTEXT,
  },
  {
    slug: 'distinctive',
    titleKey: 'overviewChapters.company.distinctive.title',
    blurbKey: 'overviewChapters.company.distinctive.blurb',
    readMinutes: 3,
    group: CO_CONTEXT,
  },
  {
    slug: 'panel',
    titleKey: 'overviewChapters.company.panel.title',
    blurbKey: 'overviewChapters.company.panel.blurb',
    readMinutes: 5,
    group: CO_CONTEXT,
  },
  {
    slug: 'training',
    titleKey: 'overviewChapters.company.training.title',
    blurbKey: 'overviewChapters.company.training.blurb',
    readMinutes: 2,
    group: CO_ACTION,
  },
  {
    slug: 'loop',
    titleKey: 'overviewChapters.company.loop.title',
    blurbKey: 'overviewChapters.company.loop.blurb',
    readMinutes: 5,
    group: CO_ACTION,
  },
]

export const POWER_DAY_CHAPTERS: Chapter[] = [
  {
    slug: 'timeline',
    titleKey: 'overviewChapters.powerDay.timeline.title',
    blurbKey: 'overviewChapters.powerDay.timeline.blurb',
    readMinutes: 2,
    group: PD_STRUCTURE,
  },
  {
    slug: 'concepts',
    titleKey: 'overviewChapters.powerDay.concepts.title',
    blurbKey: 'overviewChapters.powerDay.concepts.blurb',
    readMinutes: 8,
    group: PD_STRUCTURE,
  },
  {
    slug: 'rounds',
    titleKey: 'overviewChapters.powerDay.rounds.title',
    blurbKey: 'overviewChapters.powerDay.rounds.blurb',
    readMinutes: 7,
    group: PD_STRUCTURE,
  },
  {
    slug: 'values',
    titleKey: 'overviewChapters.powerDay.values.title',
    blurbKey: 'overviewChapters.powerDay.values.blurb',
    readMinutes: 5,
    group: PD_FLUENCY,
  },
  {
    slug: 'language',
    titleKey: 'overviewChapters.powerDay.language.title',
    blurbKey: 'overviewChapters.powerDay.language.blurb',
    readMinutes: 6,
    group: PD_FLUENCY,
  },
  {
    slug: 'glossary',
    titleKey: 'overviewChapters.powerDay.glossary.title',
    blurbKey: 'overviewChapters.powerDay.glossary.blurb',
    readMinutes: 5,
    group: PD_FLUENCY,
  },
  {
    slug: 'anti-patterns',
    titleKey: 'overviewChapters.powerDay.antiPatterns.title',
    blurbKey: 'overviewChapters.powerDay.antiPatterns.blurb',
    readMinutes: 4,
    group: PD_TACTICS,
  },
  {
    slug: 'prep',
    titleKey: 'overviewChapters.powerDay.prep.title',
    blurbKey: 'overviewChapters.powerDay.prep.blurb',
    readMinutes: 3,
    group: PD_TACTICS,
  },
]

export const GCA_CHAPTERS: Chapter[] = [
  {
    slug: 'scoring',
    titleKey: 'overviewChapters.gca.scoring.title',
    blurbKey: 'overviewChapters.gca.scoring.blurb',
    readMinutes: 2,
    group: GCA_ASSESSMENT,
  },
  {
    slug: 'modules',
    titleKey: 'overviewChapters.gca.modules.title',
    blurbKey: 'overviewChapters.gca.modules.blurb',
    readMinutes: 6,
    group: GCA_ASSESSMENT,
  },
  {
    slug: 'patterns',
    titleKey: 'overviewChapters.gca.patterns.title',
    blurbKey: 'overviewChapters.gca.patterns.blurb',
    readMinutes: 4,
    group: GCA_PLAYBOOK,
  },
  {
    slug: 'narration',
    titleKey: 'overviewChapters.gca.narration.title',
    blurbKey: 'overviewChapters.gca.narration.blurb',
    readMinutes: 4,
    group: GCA_PLAYBOOK,
  },
  {
    slug: 'skip',
    titleKey: 'overviewChapters.gca.skip.title',
    blurbKey: 'overviewChapters.gca.skip.blurb',
    readMinutes: 2,
    group: GCA_RECOVERY,
  },
  {
    slug: 'gca-anti-patterns',
    titleKey: 'overviewChapters.gca.antiPatterns.title',
    blurbKey: 'overviewChapters.gca.antiPatterns.blurb',
    readMinutes: 3,
    group: GCA_RECOVERY,
  },
]

export type OverviewTopic = 'company' | 'power-day' | 'gca'

export function chaptersFor(topic: OverviewTopic): Chapter[] {
  switch (topic) {
    case 'company':
      return COMPANY_CHAPTERS
    case 'power-day':
      return POWER_DAY_CHAPTERS
    case 'gca':
      return GCA_CHAPTERS
  }
}

export function topicTitleKey(topic: OverviewTopic): string {
  switch (topic) {
    case 'company':
      return 'overviewChapters.company.topic.title'
    case 'power-day':
      return 'overviewChapters.powerDay.topic.title'
    case 'gca':
      return 'overviewChapters.gca.topic.title'
  }
}

export function topicBlurbKey(topic: OverviewTopic): string {
  switch (topic) {
    case 'company':
      return 'overviewChapters.company.topic.blurb'
    case 'power-day':
      return 'overviewChapters.powerDay.topic.blurb'
    case 'gca':
      return 'overviewChapters.gca.topic.blurb'
  }
}
