// AppHeader — sticky top bar with sidebar trigger, breadcrumb, and theme toggle.
// Adapted from Praxema's AppHeader. Stripped: progress/XP/streaks (Anabasis is
// goal-driven, not gamified), SettingsSheet (F2), i18n (F2).

import { Fragment } from "react";
import { Link, useLocation, useParams } from "react-router";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { trpc } from "@/lib/trpc";

export function AppHeader() {
  const { theme, cycleTheme } = useTheme();
  const segments = useBreadcrumbs();
  const isDark = theme === "lone-dusk-bro";

  return (
    <header className="sticky top-0 z-40 flex h-12 shrink-0 items-center justify-between border-b bg-background px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden sm:inline-flex">
              <BreadcrumbLink render={<Link to="/">Anabasis</Link>} />
            </BreadcrumbItem>
            {segments.map((seg) => (
              <Fragment key={seg.path}>
                <BreadcrumbSeparator className="hidden sm:inline-flex" />
                {seg.isLast ? (
                  <BreadcrumbItem>
                    <BreadcrumbPage className="max-w-[200px] truncate sm:max-w-none">
                      {seg.label}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                ) : (
                  <BreadcrumbItem className="hidden sm:inline-flex">
                    <BreadcrumbLink render={<Link to={seg.path}>{seg.label}</Link>} />
                  </BreadcrumbItem>
                )}
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          title="Toggle theme (D)"
          onClick={cycleTheme}
        >
          {isDark ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
        </Button>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Breadcrumb derivation — Anabasis routes are:
//   /                              → (just Anabasis crumb)
//   /:companySlug                  → Anabasis / Company
//   /:companySlug/exercise/:id     → Anabasis / Company / Exercise title
// ─────────────────────────────────────────────────────────────────────────

type Crumb = { label: string; path: string; isLast: boolean };

function useBreadcrumbs(): Crumb[] {
  const { pathname } = useLocation();
  const params = useParams();
  const parts = pathname.split("/").filter(Boolean);

  // Fetch company name + exercise title only when needed.
  const companyQuery = trpc.companies.get.useQuery(
    { slug: params.companySlug ?? "" },
    { enabled: !!params.companySlug },
  );
  const exerciseQuery = trpc.exercises.get.useQuery(
    { id: params.exerciseId ?? "" },
    { enabled: !!params.exerciseId },
  );

  if (parts.length === 0) return [];

  const crumbs: Crumb[] = [];

  if (params.companySlug) {
    crumbs.push({
      label: companyQuery.data?.company.name ?? params.companySlug,
      path: `/${params.companySlug}`,
      isLast: !params.exerciseId,
    });
  }

  if (params.exerciseId) {
    crumbs.push({
      label: exerciseQuery.data?.title.en ?? "Exercise",
      path: pathname,
      isLast: true,
    });
  }

  return crumbs;
}
