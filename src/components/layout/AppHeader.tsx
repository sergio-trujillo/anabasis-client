// AppHeader — adapted from Praxema shell. Keeps sidebar trigger + breadcrumbs
// + settings button. Drops Praxema-specific streaks/XP/progress signals
// (Anabasis has no progress router yet — can be added in F5+ if desired).

import { useState, Fragment } from 'react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@base-ui/react'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { useLocation } from 'react-router'
import { SettingsIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SettingsSheet } from '@/components/layout/SettingsSheet'
import { useTranslation } from 'react-i18next'

export function AppHeader() {
  const { t } = useTranslation()
  const location = useLocation()
  const segments = buildBreadcrumbs(location.pathname)
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 flex h-12 shrink-0 items-center justify-between border-b bg-background px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden sm:inline-flex">
              <BreadcrumbLink href="/">Anabasis</BreadcrumbLink>
            </BreadcrumbItem>
            {segments.map((seg) => (
              <Fragment key={seg.path}>
                <BreadcrumbSeparator className="hidden sm:inline-flex" />
                {seg.isLast ? (
                  <BreadcrumbItem>
                    <BreadcrumbPage className="max-w-[140px] truncate sm:max-w-none">{seg.label}</BreadcrumbPage>
                  </BreadcrumbItem>
                ) : (
                  <BreadcrumbItem className="hidden sm:inline-flex">
                    <BreadcrumbLink href={seg.path}>{seg.label}</BreadcrumbLink>
                  </BreadcrumbItem>
                )}
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          title={t('tooltip.settings', { defaultValue: 'Settings' })}
          onClick={() => setSettingsOpen(true)}
        >
          <SettingsIcon className="size-4" />
        </Button>
      </div>
      <SettingsSheet open={settingsOpen} onOpenChange={setSettingsOpen} />
    </header>
  )
}

function buildBreadcrumbs(pathname: string) {
  const parts = pathname.split('/').filter(Boolean)
  const segments: { label: string; path: string; isLast: boolean }[] = []

  // /:companySlug[/practice|/mock-gca|/mock-power-day|/exercise/:id]
  if (parts[0]) {
    const companySlug = parts[0]
    segments.push({
      label: formatSlug(companySlug),
      path: `/${companySlug}`,
      isLast: !parts[1],
    })
    if (parts[1] === 'practice') {
      segments.push({ label: 'Practice', path: `/${companySlug}/practice`, isLast: true })
    } else if (parts[1] === 'mock-gca') {
      segments.push({
        label: 'Mock GCA',
        path: `/${companySlug}/mock-gca`,
        isLast: !parts[2],
      })
      if (parts[2]) {
        segments.push({
          label: formatSlug(parts[2]),
          path: `/${companySlug}/mock-gca/${parts[2]}`,
          isLast: true,
        })
      }
    } else if (parts[1] === 'mock-power-day') {
      segments.push({
        label: 'Mock Power Day',
        path: `/${companySlug}/mock-power-day`,
        isLast: !parts[2],
      })
      if (parts[2]) {
        segments.push({
          label: formatSlug(parts[2]),
          path: `/${companySlug}/mock-power-day/${parts[2]}`,
          isLast: true,
        })
      }
    } else if (parts[1] === 'exercise' && parts[2]) {
      segments.push({
        label: 'Exercise',
        path: `/${companySlug}/exercise/${parts[2]}`,
        isLast: true,
      })
    }
  }
  return segments
}

function formatSlug(slug: string) {
  return slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}
