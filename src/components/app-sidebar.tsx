// AppSidebar for Anabasis. The visual shell mirrors Praxema's, but the
// nav model is intentionally different per CLAUDE.md:
//
//   "Do NOT lift Praxema's sidebar — Anabasis navigation is countdown +
//    roadmap, not pattern tree."
//
// Anabasis nav:
//   Header  → Logo + tagline (Anabasis brand)
//   Content → Active companies (Capital One) with collapsible loop phases
//             Coming Soon companies (greyed, non-clickable)
//   Footer  → Phase indicator
//
// Data is pulled live from tRPC (companies.list + companies.get), so when
// F2 ships more companies the sidebar updates automatically.

import { ChevronRightIcon, LockIcon, MountainIcon } from "lucide-react";
import { Link, useLocation, useParams } from "react-router";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { trpc } from "@/lib/trpc";

export function AppSidebar() {
  const companiesQuery = trpc.companies.list.useQuery();
  const params = useParams();
  const location = useLocation();

  const active = companiesQuery.data?.filter((c) => c.status === "active") ?? [];
  const comingSoon = companiesQuery.data?.filter((c) => c.status === "coming-soon") ?? [];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link
          to="/"
          className="flex items-center gap-2 px-2 py-1.5 hover:opacity-80 transition-opacity"
        >
          <div className="flex size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <MountainIcon className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate font-semibold font-heading">Anabasis</span>
            <span className="truncate text-[10px] text-sidebar-foreground/60">
              ἀνάβασις · the ascent
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {/* ── Active companies ── */}
        <SidebarGroup>
          <SidebarGroupLabel>Active campaigns</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {active.map((company) => (
                <ActiveCompanyItem
                  key={company.slug}
                  slug={company.slug}
                  name={company.name}
                  isActiveRoute={params.companySlug === company.slug}
                  currentPath={location.pathname}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ── Coming soon ── */}
        {comingSoon.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Coming soon</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {comingSoon.map((company) => (
                  <SidebarMenuItem key={company.slug}>
                    <SidebarMenuButton disabled className="opacity-50 cursor-not-allowed">
                      <LockIcon className="size-3.5" />
                      <span>{company.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <div className="px-3 py-2 text-[10px] text-sidebar-foreground/40 group-data-[collapsible=icon]:hidden">
          F1 scaffolding · Capital One
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Active company entry — collapsible, expands to show loop phases + sections.
// Loop data is fetched lazily via companies.get.
// ─────────────────────────────────────────────────────────────────────────

function ActiveCompanyItem({
  slug,
  name,
  isActiveRoute,
  currentPath,
}: {
  slug: string;
  name: string;
  isActiveRoute: boolean;
  currentPath: string;
}) {
  const companyQuery = trpc.companies.get.useQuery({ slug });
  const loop = companyQuery.data?.loop;

  return (
    <Collapsible defaultOpen={isActiveRoute} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger
          render={
            <SidebarMenuButton isActive={isActiveRoute}>
              <ChevronRightIcon className="size-3.5 transition-transform group-data-[state=open]/collapsible:rotate-90" />
              <span>{name}</span>
            </SidebarMenuButton>
          }
        />

        {loop && (
          <CollapsibleContent>
            <SidebarMenuSub>
              {/* Top-level link to the company home */}
              <SidebarMenuSubItem>
                <SidebarMenuSubButton
                  isActive={currentPath === `/${slug}`}
                  render={<Link to={`/${slug}`}>Overview</Link>}
                />
              </SidebarMenuSubItem>

              {/* Loop phases — each phase shows its sections as nested links */}
              {loop.phases.map((phase) => (
                <SidebarMenuSubItem key={phase.id}>
                  <span className="px-2 pt-2 pb-0.5 text-[10px] uppercase tracking-wider text-sidebar-foreground/40">
                    {phase.name}
                  </span>
                  {phase.sections.slice(0, 4).map((section) => (
                    <SidebarMenuSubButton key={section.id} className="text-xs opacity-70">
                      <span className="truncate">{section.name}</span>
                    </SidebarMenuSubButton>
                  ))}
                  {phase.sections.length > 4 && (
                    <span className="px-2 text-[10px] text-sidebar-foreground/40">
                      +{phase.sections.length - 4} more
                    </span>
                  )}
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        )}
      </SidebarMenuItem>
    </Collapsible>
  );
}
