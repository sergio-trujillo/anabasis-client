// Docs-style shell for /:companySlug/overview/:topic and its :page children.
//
// Layout (top → bottom):
//   1. CtaBar            — sticky top-0, "Inicia un mock…" + 3 action buttons
//   2. ChapterStrip      — sticky below CtaBar, horizontal scrollable pills
//   3. <Outlet />        — full-width content
//   (Navigation between chapters is handled entirely by the CtaBar dropdown.)

import {
  BookOpenIcon,
  CheckIcon,
  ChevronDownIcon,
  ClockIcon,
  ShuffleIcon,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, Outlet, useNavigate, useParams } from 'react-router'
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import {
  chaptersFor,
  type Chapter,
  type OverviewTopic,
} from './chapters'

export function OverviewLayout() {
  const { companySlug = '', topic = 'power-day', page } = useParams()
  const safeTopic = (topic === 'gca' || topic === 'power-day' || topic === 'company'
    ? topic
    : 'power-day') as OverviewTopic
  const chapters = chaptersFor(safeTopic)

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden min-w-0">
      <div className="relative min-h-[calc(100vh-3.5rem)] overflow-x-hidden">
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
    <div className="sticky top-0 z-20 bg-background/85 backdrop-blur-sm border-b border-border/60 overflow-hidden">
      <div className="p-2 w-full min-w-0 flex items-center gap-2 flex-wrap">
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
  const navigate = useNavigate()

  // Group chapters by theme for the dropdown menu. Reading order is
  // authoritative; groups are visual labels only.
  const groups: Array<{
    id: string
    labelKey: string
    items: Array<{ chapter: Chapter; index: number }>
  }> = []
  chapters.forEach((c, i) => {
    const last = groups[groups.length - 1]
    if (last && last.id === c.group.id) {
      last.items.push({ chapter: c, index: i })
    } else {
      groups.push({
        id: c.group.id,
        labelKey: c.group.labelKey,
        items: [{ chapter: c, index: i }],
      })
    }
  })

  // Current chapter info (undefined = landing hub).
  const currentIdx = currentPage
    ? chapters.findIndex((c) => c.slug === currentPage)
    : -1
  const currentChapter = currentIdx >= 0 ? chapters[currentIdx] : null

  // Trigger label — what the user sees before opening the menu.
  const triggerIndex =
    currentIdx >= 0 ? String(currentIdx + 1).padStart(2, '0') : '00'
  const triggerTitle = currentChapter
    ? stripIndex(t(currentChapter.titleKey))
    : t('overviewChapters.actions.startHere')
  const triggerGroup = currentChapter
    ? t(currentChapter.group.labelKey)
    : null
  const progress = currentIdx >= 0
    ? `${currentIdx + 1} / ${chapters.length}`
    : `0 / ${chapters.length}`

  return (
    <div className="sticky top-[52px] z-10 bg-background/85 backdrop-blur-sm border-b border-border/60 overflow-hidden">
      <div className="p-2 w-full min-w-0 flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              buttonVariants({ variant: 'outline', size: 'sm' }),
              'min-w-0 flex-1 sm:flex-initial justify-start gap-2 h-auto py-1.5'
            )}
          >
            <BookOpenIcon data-icon="inline-start" className="shrink-0" />
            <span className="font-mono text-[10px] opacity-60 tabular-nums shrink-0">
              {triggerIndex}
            </span>
            <span className="truncate font-medium">{triggerTitle}</span>
            {triggerGroup && (
              <span className="hidden md:inline text-[10px] uppercase tracking-wider text-muted-foreground/70 shrink-0">
                · {triggerGroup}
              </span>
            )}
            <Badge
              variant="secondary"
              className="ml-auto shrink-0 text-[10px] h-4 px-1.5 font-normal tabular-nums"
            >
              {progress}
            </Badge>
            <ChevronDownIcon className="shrink-0 opacity-60" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-80 max-h-[70vh] overflow-y-auto"
          >
            <DropdownMenuItem
              onClick={() => navigate(baseTo)}
              className="gap-3"
            >
              <span className="font-mono text-[10px] opacity-60 tabular-nums w-6 shrink-0">
                00
              </span>
              <span className="flex-1 truncate">
                {t('overviewChapters.actions.startHere')}
              </span>
              {currentIdx === -1 && (
                <CheckIcon data-icon="inline-end" className="text-primary" />
              )}
            </DropdownMenuItem>

            {groups.map((group) => (
              <div key={group.id}>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">
                    {t(group.labelKey)}
                  </DropdownMenuLabel>
                  {group.items.map(({ chapter, index }) => {
                    const isActive = chapter.slug === currentPage
                    return (
                      <DropdownMenuItem
                        key={chapter.slug}
                        onClick={() =>
                          navigate(`${baseTo}/${chapter.slug}`)
                        }
                        className="gap-3"
                      >
                        <span className="font-mono text-[10px] opacity-60 tabular-nums w-6 shrink-0">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span
                          className={cn(
                            'flex-1 truncate',
                            isActive && 'font-semibold text-primary'
                          )}
                        >
                          {stripIndex(t(chapter.titleKey))}
                        </span>
                        <span className="text-[10px] text-muted-foreground/70 tabular-nums shrink-0">
                          {chapter.readMinutes}m
                        </span>
                        {isActive && (
                          <CheckIcon
                            data-icon="inline-end"
                            className="text-primary"
                          />
                        )}
                      </DropdownMenuItem>
                    )
                  })}
                </DropdownMenuGroup>
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </div>
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

export { Separator }
