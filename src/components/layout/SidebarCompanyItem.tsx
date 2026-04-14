import { BookOpenIcon, BuildingIcon, ChevronRightIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router'
import type { Company } from '@/components/catalog/types'
import { Badge } from '@/components/ui/badge'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { trpc } from '@/lib/trpc'

type Phase = {
  id: string
  name: string
  description: string
  sections: Array<{ id: string; name: string; kind: string }>
}

type Loop = {
  displayName: string
  phases: Phase[]
}

function sectionHref(companySlug: string, sectionId: string): string {
  switch (sectionId) {
    case 'gca-mock':
      return `/${companySlug}/mock-gca`
    case 'power-day-mock':
      return `/${companySlug}/mock-power-day`
    case 'gca-overview':
      return `/${companySlug}/overview/gca`
    case 'power-day-overview':
      return `/${companySlug}/overview/power-day`
    default:
      return `/${companySlug}/section/${sectionId}`
  }
}

export function SidebarCompanyItem({ company }: { company: Company }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const companyQuery = trpc.companies.get.useQuery({ slug: company.slug })
  const loop = (companyQuery.data as { loop: Loop | null } | undefined)?.loop
  const isCompanyRoot = pathname === `/${company.slug}`
  const isInCompany = isCompanyRoot || pathname.startsWith(`/${company.slug}/`)

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={() => navigate(`/${company.slug}`)}
        isActive={isInCompany}
        tooltip={company.name}
      >
        <BuildingIcon className="size-4" />
        <span>{company.name}</span>
        <Badge
          variant="outline"
          className="ml-auto text-[10px]"
          style={{ borderColor: company.accentColor }}
        >
          active
        </Badge>
      </SidebarMenuButton>

      {loop && (
        <SidebarMenuSub>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton
              onClick={() => navigate(`/${company.slug}`)}
              isActive={isCompanyRoot}
            >
              <BookOpenIcon className="size-3" />
              {t('sidebar.companyOverview', { defaultValue: 'Overview' })}
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>

          {loop.phases.map((phase) => (
            <PhaseGroup
              key={phase.id}
              phase={phase}
              companySlug={company.slug}
              currentPath={pathname}
            />
          ))}
        </SidebarMenuSub>
      )}
    </SidebarMenuItem>
  )
}

function PhaseGroup({
  phase,
  companySlug,
  currentPath,
}: {
  phase: Phase
  companySlug: string
  currentPath: string
}) {
  const hrefs = phase.sections.map((s) => sectionHref(companySlug, s.id))
  const isPhaseActive = hrefs.some((h) => currentPath === h)

  const [open, setOpen] = useState(isPhaseActive)
  useEffect(() => {
    if (isPhaseActive) setOpen(true)
  }, [isPhaseActive])

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="group/phase mt-2"
      render={<SidebarMenuSubItem />}
    >
      <CollapsibleTrigger
        className={
          'flex w-full items-center gap-2 rounded-md px-2 py-1 text-[10px] font-medium uppercase tracking-wide transition-colors ' +
          (isPhaseActive
            ? 'text-foreground'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted')
        }
      >
        <ChevronRightIcon className="size-3 transition-transform duration-200 group-data-open/phase:rotate-90" />
        <span className="flex-1 truncate text-left">{phase.name}</span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ul className="mt-1 space-y-0.5">
          {phase.sections.map((section, i) => {
            const href = hrefs[i]
            const isActive = currentPath === href
            return (
              <li key={section.id}>
                <Link
                  to={href}
                  className={
                    'block pl-5 pr-2 py-1 text-xs rounded-md truncate transition-colors ' +
                    (isActive
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted')
                  }
                >
                  {section.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  )
}
