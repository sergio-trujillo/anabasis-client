// Docs-style shell for /:companySlug/overview/:topic and its :page children.
//
// Layout (top → bottom):
//   1. CtaBar            — sticky top-0, "Inicia un mock…" + 3 action buttons
//   2. ChapterStrip      — sticky below CtaBar, horizontal scrollable pills
//   3. <Outlet />        — full-width content
//   4. PrevNextNav       — rendered inside each page

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ClockIcon,
  ShuffleIcon,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink, Outlet, useParams } from 'react-router'
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import {
  ScrollArea,
  ScrollBar,
} from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import {
  chaptersFor,
  type Chapter,
  type OverviewTopic,
} from './chapters'

export function OverviewLayout() {
  const { companySlug = '', topic = 'power-day', page } = useParams()
  const safeTopic = (topic === 'gca' || topic === 'power-day'
    ? topic
    : 'power-day') as OverviewTopic
  const chapters = chaptersFor(safeTopic)

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="relative min-h-[calc(100vh-3.5rem)]">
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.05}
          duration={3}
          className="absolute inset-0 -z-10 [mask-image:radial-gradient(700px_circle_at_top,white,transparent)]"
        />

        <CtaBar companySlug={companySlug} />
        <ChapterStrip
          chapters={chapters}
          baseTo={`/${companySlug}/overview/${safeTopic}`}
          currentPage={page}
        />

        <div className="relative p-2 w-full">
          <main className="min-w-0 space-y-6 pb-12 pt-4">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

function CtaBar({ companySlug }: { companySlug: string }) {
  const { t } = useTranslation()
  return (
    <div className="sticky top-0 z-20 bg-background/85 backdrop-blur-sm border-b border-border/60">
      <div className="p-2 w-full flex items-center gap-2 flex-wrap">
        <div className="hidden sm:block text-xs text-muted-foreground mr-auto px-2">
          {t('overviewChapters.actions.launchMock')}
        </div>

        <Link
          to={`/${companySlug}/practice`}
          className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'gap-1.5')}
        >
          <ShuffleIcon data-icon="inline-start" />
          {t('overviewChapters.actions.practice')}
        </Link>
        <Link
          to={`/${companySlug}/mock-gca`}
          className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }), 'gap-1.5')}
        >
          <ClockIcon data-icon="inline-start" />
          {t('overviewChapters.actions.mockGca')}
        </Link>
        <Link
          to={`/${companySlug}/mock-power-day`}
          className={cn(buttonVariants({ variant: 'default', size: 'sm' }), 'gap-1.5')}
        >
          <ClockIcon data-icon="inline-start" />
          {t('overviewChapters.actions.mockPowerDay')}
        </Link>
      </div>
    </div>
  )
}

function ChapterStrip({
  chapters,
  baseTo,
  currentPage,
}: {
  chapters: Chapter[]
  baseTo: string
  currentPage: string | undefined
}) {
  const { t } = useTranslation()
  return (
    <div className="sticky top-[52px] z-10 bg-background/85 backdrop-blur-sm border-b border-border/60">
      <div className="p-2 w-full flex items-center gap-2">
        <span className="hidden sm:inline-flex shrink-0 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-2">
          {t('overviewChapters.actions.chapters')}
        </span>
        <ScrollArea className="min-w-0 flex-1">
          <nav className="flex items-center gap-1.5 py-0.5">
            <ChapterPill
              to={baseTo}
              exact
              label={t('overviewChapters.actions.startHere')}
              index="00"
              minutes={null}
            />
            {chapters.map((c, i) => (
              <ChapterPill
                key={c.slug}
                to={`${baseTo}/${c.slug}`}
                exact={false}
                label={stripIndex(t(c.titleKey))}
                index={String(i + 1).padStart(2, '0')}
                minutes={c.readMinutes}
              />
            ))}
          </nav>
          <ScrollBar orientation="horizontal" className="h-1.5" />
        </ScrollArea>
      </div>
    </div>
  )
}

function ChapterPill({
  to,
  exact,
  label,
  index,
  minutes,
}: {
  to: string
  exact: boolean
  label: string
  index: string
  minutes: number | null
}) {
  return (
    <NavLink
      to={to}
      end={exact}
      className={({ isActive }) =>
        cn(
          'group shrink-0 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
          isActive
            ? 'bg-primary text-primary-foreground border-primary'
            : 'border-border/60 bg-background/40 text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/60'
        )
      }
    >
      <span className="font-mono text-[10px] tabular-nums opacity-60 group-aria-[current=page]:opacity-100">
        {index}
      </span>
      <span className="truncate max-w-[200px]">{label}</span>
      {minutes !== null && (
        <Badge
          variant="outline"
          className="h-4 px-1 text-[9px] font-normal border-current/30 bg-transparent"
        >
          {minutes}m
        </Badge>
      )}
    </NavLink>
  )
}

/**
 * The chapter titles in i18n already include a leading "01 · " for the
 * chapter listing. The pill shows its own index badge, so strip the
 * duplicate prefix from the label.
 */
function stripIndex(raw: string): string {
  return raw.replace(/^\s*\d+\s*[·•·]\s*/, '').trim()
}

export function PrevNextNav({
  chapters,
  currentSlug,
  baseTo,
}: {
  chapters: Chapter[]
  currentSlug: string | undefined
  baseTo: string
}) {
  const { t } = useTranslation()
  const idx =
    currentSlug === undefined
      ? -1
      : chapters.findIndex((c) => c.slug === currentSlug)
  const prev = idx > 0 ? chapters[idx - 1] : null
  const next =
    idx === -1
      ? chapters[0]
      : idx < chapters.length - 1
        ? chapters[idx + 1]
        : null

  if (!prev && !next) return null

  return (
    <div className="pt-6 mt-8 border-t border-border/60">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <PrevNextCard
          chapter={prev}
          baseTo={baseTo}
          direction="prev"
          label={t('overviewChapters.actions.previous')}
        />
        <PrevNextCard
          chapter={next}
          baseTo={baseTo}
          direction="next"
          label={t('overviewChapters.actions.next')}
        />
      </div>
    </div>
  )
}

function PrevNextCard({
  chapter,
  baseTo,
  direction,
  label,
}: {
  chapter: Chapter | null
  baseTo: string
  direction: 'prev' | 'next'
  label: string
}) {
  const { t } = useTranslation()
  if (!chapter) {
    return <div className="hidden md:block" />
  }
  const Icon = direction === 'prev' ? ArrowLeftIcon : ArrowRightIcon
  return (
    <Link
      to={`${baseTo}/${chapter.slug}`}
      className={cn(
        'group rounded-xl border border-border/60 bg-card/40 hover:bg-card hover:border-primary/40 transition-colors p-4',
        'flex items-start gap-3',
        direction === 'next' && 'md:text-right md:flex-row-reverse'
      )}
    >
      <Icon
        className={cn(
          'shrink-0 size-5 mt-0.5 text-muted-foreground group-hover:text-primary transition-colors'
        )}
      />
      <div className="min-w-0 flex-1">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
          {label}
        </div>
        <div className="text-sm font-medium mt-0.5 truncate">
          {t(chapter.titleKey)}
        </div>
      </div>
    </Link>
  )
}

export { Separator }
