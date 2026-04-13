// Docs-style shell for /:companySlug/overview/:topic and its :page children.
//
// Layout:
//   ┌─ sticky top CTA bar (Practice / Mock GCA / Mock Power Day) ─┐
//   │ ────────────────────────────────────────────────────────── │
//   │ [Chapters nav]   │   <Outlet />                              │
//   │                  │   ---                                     │
//   │                  │   Prev / Next                             │
//   └────────────────────────────────────────────────────────────┘
//
// Mobile: the chapters nav collapses into a Sheet triggered from the CTA bar.

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ClockIcon,
  MenuIcon,
  ShuffleIcon,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink, Outlet, useParams } from 'react-router'
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import {
  chaptersFor,
  type Chapter,
  type OverviewTopic,
} from './chapters'

export function OverviewLayout() {
  const { companySlug = '', topic = 'power-day' } = useParams()
  const { page } = useParams()
  const safeTopic = (topic === 'gca' || topic === 'power-day'
    ? topic
    : 'power-day') as OverviewTopic
  const chapters = chaptersFor(safeTopic)
  const { t } = useTranslation()

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="relative min-h-[calc(100vh-3.5rem)]">
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.05}
          duration={3}
          className="absolute inset-0 -z-10 [mask-image:radial-gradient(700px_circle_at_top,white,transparent)]"
        />

        <CtaBar
          companySlug={companySlug}
          chapters={chapters}
          currentPage={page}
          topic={safeTopic}
        />

        <div className="relative p-2 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 pt-4">
            <aside className="hidden lg:block">
              <div className="sticky top-28 max-h-[calc(100vh-8rem)]">
                <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-3 px-2">
                  {t('overviewChapters.actions.chapters')}
                </h3>
                <ScrollArea className="h-full pr-3">
                  <ChapterNav
                    chapters={chapters}
                    baseTo={`/${companySlug}/overview/${safeTopic}`}
                    currentPage={page}
                  />
                </ScrollArea>
              </div>
            </aside>

            <main className="min-w-0 space-y-6 pb-12">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}

function CtaBar({
  companySlug,
  chapters,
  currentPage,
  topic,
}: {
  companySlug: string
  chapters: Chapter[]
  currentPage: string | undefined
  topic: OverviewTopic
}) {
  const { t } = useTranslation()
  return (
    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/60">
      <div className="p-2 w-full flex items-center gap-2 flex-wrap">
        {/* Mobile-only chapters trigger */}
        <Sheet>
          <SheetTrigger
            className={cn(
              buttonVariants({ variant: 'outline', size: 'sm' }),
              'lg:hidden gap-1.5'
            )}
          >
            <MenuIcon data-icon="inline-start" />
            {t('overviewChapters.actions.chapters')}
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetHeader>
              <SheetTitle>
                {t('overviewChapters.actions.chapters')}
              </SheetTitle>
            </SheetHeader>
            <div className="p-2">
              <ChapterNav
                chapters={chapters}
                baseTo={`/${companySlug}/overview/${topic}`}
                currentPage={currentPage}
              />
            </div>
          </SheetContent>
        </Sheet>

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

function ChapterNav({
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
    <nav className="flex flex-col gap-0.5">
      <NavLink
        to={baseTo}
        end
        className={({ isActive }) =>
          cn(
            'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
            isActive && !currentPage
              ? 'bg-primary/10 text-primary font-medium'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          )
        }
      >
        <span className="font-mono text-[10px] opacity-50 tabular-nums">
          00
        </span>
        <span className="truncate">
          {t('overviewChapters.actions.startHere')}
        </span>
      </NavLink>
      {chapters.map((c) => (
        <NavLink
          key={c.slug}
          to={`${baseTo}/${c.slug}`}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
              isActive
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )
          }
        >
          <span className="truncate flex-1">{t(c.titleKey)}</span>
          <Badge variant="outline" className="shrink-0 text-[9px] h-4 px-1.5 font-normal">
            {c.readMinutes}m
          </Badge>
        </NavLink>
      ))}
    </nav>
  )
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
  // Landing page (no currentSlug) → only Next
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

export { Separator } // re-export so sub-pages can separate blocks consistently
