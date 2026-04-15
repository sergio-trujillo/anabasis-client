// Anabasis sidebar — reused shadcn sidebar primitives from Praxema's shell,
// content replaced with Anabasis domain (companies → phases → sections).
//
// Data: trpc.companies.list. Capital One is the only `active` campaign in v1;
// 5 `coming-soon` entries render disabled.

import { LockIcon, MountainSnowIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
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
	const companiesQuery = trpc.companies.list.useQuery();
	const companies = companiesQuery.data ?? [];
	const active = companies.filter((c) => c.status === "active");
	const comingSoon = companies.filter((c) => c.status === "coming-soon");

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader>
				<Link
					to="/"
					className="flex items-center gap-3 px-2 py-3 rounded-lg hover:bg-sidebar-accent transition-colors group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
				>
					<div className="flex aspect-square size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:rounded-lg">
						<MountainSnowIcon className="size-5 group-data-[collapsible=icon]:size-4" />
					</div>
					<div className="flex flex-col leading-none group-data-[collapsible=icon]:hidden">
						<span className="text-base font-bold tracking-tight">Anabasis</span>
						<span className="text-[11px] text-muted-foreground">
							ἀνάβασις · the ascent
						</span>
					</div>
				</Link>
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
