// AppSidebar for Anabasis. The visual shell mirrors Praxema's, but the
// nav model is intentionally different per CLAUDE.md:
//
//   "Do NOT lift Praxema's sidebar — Anabasis navigation is countdown +
//    roadmap, not pattern tree."
//
// Anabasis nav:
//   Header  → Logo + tagline (Anabasis brand)
//   Content → Active companies (Capital One) → Overview + Practice +
//             Mock Exam + per-phase section lists (all clickable, with
//             "soon" badge for sections that don't have content yet)
//             Coming Soon companies (greyed, non-clickable)
//   Footer  → Phase indicator
//
// Data is pulled live from tRPC (companies.list + companies.get), so when
// F3/F4 ships more content the sidebar updates automatically.
//
// Opus-review Fix #8 applied: each section now gets its own
// SidebarMenuSubItem so the HTML is a valid <ul><li> structure. The phase
// label is rendered as a separate non-interactive SidebarGroupLabel-style
// span, not nested inside a li with other links.

import { ChevronRightIcon, LockIcon, MountainIcon, PlayIcon, ShuffleIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
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

// Sections known to have content. Anything not in this set renders greyed
// with a "soon" badge. As content lands we add section IDs here (or
// eventually replace with a `sections.list` tRPC query that reflects
// content state automatically — tracked in ROADMAP).
const SECTIONS_WITH_CONTENT = new Set<string>([
  // F2 samples
  "behavioral-respect-for-individuals",
  "system-design-banking",
  // F3 — GCA content
  "gca-overview", // 1 MCQ (F2) + 6 MCQ (F3)
  "gca-module-1-warmup", // 8 code exercises across hashmap-complement + palindrome-check
]);

export function AppSidebar() {
  const { t } = useTranslation();
  const companiesQuery = trpc.companies.list.useQuery();

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
            <span className="truncate font-semibold font-heading">{t("brand.name")}</span>
            <span className="truncate text-[10px] text-sidebar-foreground/60">
              {t("brand.subtitle")}
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {/* ── Active companies ── */}
        <SidebarGroup>
          <SidebarGroupLabel>{t("nav.activeCampaigns")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {active.map((company) => (
                <ActiveCompanyItem key={company.slug} slug={company.slug} name={company.name} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ── Coming soon ── */}
        {comingSoon.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>{t("nav.comingSoon")}</SidebarGroupLabel>
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
          {t("footer.phase")}
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Active company entry — collapsible, expands to show:
//   - Overview
//   - Random Practice (code problems)
//   - For each loop phase: a group label + every section as its own
//     SidebarMenuSubItem (no "+N more" truncation).
// Loop data is fetched lazily via companies.get.
// ─────────────────────────────────────────────────────────────────────────

function ActiveCompanyItem({ slug, name }: { slug: string; name: string }) {
  const { t } = useTranslation();
  const companyQuery = trpc.companies.get.useQuery({ slug });
  const params = useParams();
  const { pathname } = useLocation();

  const loop = companyQuery.data?.loop;
  const isCompanyActive = params.companySlug === slug;
  const overviewActive = pathname === `/${slug}`;
  const practiceActive = pathname === `/${slug}/practice`;

  return (
    <Collapsible defaultOpen={isCompanyActive} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger
          render={
            <SidebarMenuButton isActive={isCompanyActive}>
              <ChevronRightIcon className="size-3.5 transition-transform group-data-[state=open]/collapsible:rotate-90" />
              <span>{name}</span>
            </SidebarMenuButton>
          }
        />

        {loop && (
          <CollapsibleContent>
            <SidebarMenuSub>
              {/* Overview — top-level link to company home */}
              <SidebarMenuSubItem>
                <SidebarMenuSubButton
                  isActive={overviewActive}
                  render={
                    <Link to={`/${slug}`}>
                      <PlayIcon className="size-3" />
                      <span>{t("nav.overview")}</span>
                    </Link>
                  }
                />
              </SidebarMenuSubItem>

              {/* Random practice — shuffles code problems */}
              <SidebarMenuSubItem>
                <SidebarMenuSubButton
                  isActive={practiceActive}
                  render={
                    <Link to={`/${slug}/practice`}>
                      <ShuffleIcon className="size-3" />
                      <span>{t("nav.practice")}</span>
                    </Link>
                  }
                />
              </SidebarMenuSubItem>
            </SidebarMenuSub>

            {/* One group per loop phase, each with its own list of sections */}
            {loop.phases.map((phase) => (
              <PhaseGroup
                key={phase.id}
                phaseName={phase.name}
                sections={phase.sections}
                companySlug={slug}
              />
            ))}
          </CollapsibleContent>
        )}
      </SidebarMenuItem>
    </Collapsible>
  );
}

// A phase (e.g. "General Coding Assessment" or "Power Day — Virtual Onsite")
// renders as a small group label + its own SidebarMenuSub. Each section is
// one SidebarMenuSubItem with one SidebarMenuSubButton — proper HTML
// structure (fixes Opus-review Bug #8).
function PhaseGroup({
  phaseName,
  sections,
  companySlug,
}: {
  phaseName: string;
  sections: Array<{ id: string; name: string; kind: string }>;
  companySlug: string;
}) {
  const { t } = useTranslation();
  return (
    <>
      <div className="px-5 pt-3 pb-1 text-[10px] uppercase tracking-wider text-sidebar-foreground/50 font-semibold group-data-[collapsible=icon]:hidden">
        {phaseName}
      </div>
      <SidebarMenuSub>
        {sections.map((section) => {
          const hasContent = SECTIONS_WITH_CONTENT.has(section.id);
          return (
            <SidebarMenuSubItem key={section.id}>
              {hasContent ? (
                <SidebarMenuSubButton
                  render={
                    <Link to={`/${companySlug}/section/${section.id}`}>
                      <span className="truncate">{section.name}</span>
                    </Link>
                  }
                />
              ) : (
                <SidebarMenuSubButton className="opacity-45 cursor-not-allowed">
                  <span className="truncate flex-1">{section.name}</span>
                  <span className="ml-auto text-[9px] uppercase tracking-wider text-sidebar-foreground/40">
                    {t("catalog.soon")}
                  </span>
                </SidebarMenuSubButton>
              )}
            </SidebarMenuSubItem>
          );
        })}
      </SidebarMenuSub>
    </>
  );
}
