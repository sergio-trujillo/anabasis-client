// Anabasis sidebar — reused shadcn sidebar primitives from Praxema's shell,
// content replaced with Anabasis domain (companies → phases → sections).
//
// Data: trpc.companies.list. Capital One is the only `active` campaign in v1;
// 5 `coming-soon` entries render disabled.

import { LockIcon, MountainSnowIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import type { Company } from "@/components/catalog/types";
import { NavUser } from "@/components/nav-user";
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
	SidebarRail,
} from "@/components/ui/sidebar";
import { trpc } from "@/lib/trpc";
import { SidebarCompanyItem } from "./layout/SidebarCompanyItem";

// Placeholder user for the sidebar footer — Anabasis is single-user local,
// no auth (STATUS OD-1). Treat this as identifying the machine, not a person.
const PLACEHOLDER_USER = {
	name: "Sergio",
	email: "local@anabasis",
	avatar: "",
};

export function AppSidebar() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const companiesQuery = trpc.companies.list.useQuery();
	const companies = companiesQuery.data ?? [];
	const active = companies.filter((c) => c.status === "active");
	const comingSoon = companies.filter((c) => c.status === "coming-soon");

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							size="lg"
							tooltip="Anabasis · ἀνάβασις"
							onClick={() => navigate("/")}
						>
							<div className="flex aspect-square size-8 items-center justify-center rounded-lg border bg-sidebar-accent text-sidebar-accent-foreground">
								<MountainSnowIcon className="size-4" />
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-heading font-semibold">
									Anabasis
								</span>
								<span className="truncate text-xs text-muted-foreground">
									ἀνάβασις · the ascent
								</span>
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>
						{t("nav.activeCampaigns", { defaultValue: "Active campaigns" })}
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{active.map((company) => (
								<SidebarCompanyItem
									key={company.slug}
									company={company as Company}
								/>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				{comingSoon.length > 0 && (
					<SidebarGroup>
						<SidebarGroupLabel>
							{t("nav.comingSoon", { defaultValue: "Coming soon" })}
						</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{comingSoon.map((c) => (
									<SidebarMenuItem key={c.slug}>
										<SidebarMenuButton
											disabled
											tooltip={`${c.name} · coming soon`}
										>
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
	);
}
