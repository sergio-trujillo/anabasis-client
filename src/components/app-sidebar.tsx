// Anabasis sidebar — reused shadcn sidebar primitives from Praxema's shell,
// content replaced with Anabasis domain (companies → phases → sections).
//
// Data: trpc.companies.list. Capital One is the only `active` campaign in v1;
// 5 `coming-soon` entries render disabled.
// Capital One expand shows loop.json phases + sections, each a clickable link
// back to the company page (anchored later if we add per-section deep links).

import { Link, useLocation, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { BookOpenIcon, BuildingIcon, LockIcon } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar'
import { Badge } from '@/components/ui/badge'
import { NavUser } from '@/components/nav-user'
import { trpc } from '@/lib/trpc'

// Placeholder user for the sidebar footer — Anabasis is single-user local,
// no auth (STATUS OD-1). Treat this as identifying the machine, not a person.
const PLACEHOLDER_USER = {
  name: 'Sergio',
  email: 'local@anabasis',
  avatar: '',
}

type Company = {
  slug: string
  name: string
  status: 'active' | 'coming-soon'
  tagline: string
  accentColor?: string
}

export function AppSidebar() {
  const { t } = useTranslation()
  const location = useLocation()
  const companiesQuery = trpc.companies.list.useQuery()
  const companies = (companiesQuery.data as Company[] | undefined) ?? []
  const active = companies.filter((c) => c.status === 'active')
  const comingSoon = companies.filter((c) => c.status === 'coming-soon')

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <span className="text-base font-bold tracking-tight font-heading">Anabasis</span>
          <span className="text-[11px] text-muted-foreground">ἀνάβασις</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('nav.activeCampaigns', { defaultValue: 'Active campaigns' })}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {active.map((company) => (
                <CompanyMenuItem
                  key={company.slug}
                  company={company}
                  currentPath={location.pathname}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {comingSoon.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>{t('nav.comingSoon', { defaultValue: 'Coming soon' })}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {comingSoon.map((c) => (
                  <SidebarMenuItem key={c.slug}>
                    <SidebarMenuButton disabled>
                      <LockIcon className="size-3.5" />
                      <span className="text-muted-foreground">{c.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={PLACEHOLDER_USER} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

function CompanyMenuItem({
  company,
  currentPath,
}: {
  company: Company
  currentPath: string
}) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const companyQuery = trpc.companies.get.useQuery({ slug: company.slug })
  const loop = (companyQuery.data as { loop: Loop | null } | undefined)?.loop

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={() => navigate(`/${company.slug}`)}
        isActive={currentPath === `/${company.slug}` || currentPath.startsWith(`/${company.slug}/`)}
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
              isActive={currentPath === `/${company.slug}`}
            >
              <BookOpenIcon className="size-3" />
              {t('sidebar.companyOverview', { defaultValue: 'Overview' })}
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
          {loop.phases.map((phase) => (
            <SidebarMenuSubItem key={phase.id}>
              <div className="px-2 py-1 text-muted-foreground font-medium text-xs mt-2">
                {phase.name}
              </div>
              <ul className="space-y-0.5">
                {phase.sections.map((section) => {
                  // Mock sections have their own timed routes; everything
                  // else goes through the section page which either redirects
                  // or lists exercises.
                  const href =
                    section.id === 'gca-mock'
                      ? `/${company.slug}/mock-gca`
                      : section.id === 'power-day-mock'
                        ? `/${company.slug}/mock-power-day`
                        : section.id === 'gca-overview'
                          ? `/${company.slug}/overview/gca`
                          : section.id === 'power-day-overview'
                            ? `/${company.slug}/overview/power-day`
                            : `/${company.slug}/section/${section.id}`
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
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      )}
    </SidebarMenuItem>
  )
}

type Loop = {
  displayName: string
  phases: Array<{
    id: string
    name: string
    description: string
    sections: Array<{ id: string; name: string; kind: string }>
  }>
}
