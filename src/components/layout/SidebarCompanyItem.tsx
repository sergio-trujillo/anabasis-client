import { BookOpenIcon, BuildingIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router";
import type { Company } from "@/components/catalog/types";
import { Badge } from "@/components/ui/badge";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { trpc } from "@/lib/trpc";

type Section = {
	id: string;
	name: string;
	kind: string;
	/** Optional sub-grouping label. Sections sharing a group render as a
	 * nested collapsible inside the phase. */
	group?: string;
};

type Phase = {
	id: string;
	name: string;
	description: string;
	sections: Section[];
};

type Loop = {
	displayName: string;
	phases: Phase[];
};

function sectionHref(companySlug: string, sectionId: string): string {
	switch (sectionId) {
		case "gca-mock":
			return `/${companySlug}/mock-gca`;
		case "power-day-mock":
			return `/${companySlug}/mock-power-day`;
		case "gca-overview":
			return `/${companySlug}/overview/gca`;
		case "power-day-overview":
			return `/${companySlug}/overview/power-day`;
		default:
			return `/${companySlug}/section/${sectionId}`;
	}
}

export function SidebarCompanyItem({ company }: { company: Company }) {
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const companyQuery = trpc.companies.get.useQuery({ slug: company.slug });
	const loop = (companyQuery.data as { loop: Loop | null } | undefined)?.loop;
	const isCompanyRoot = pathname === `/${company.slug}`;
	const isInCompany = isCompanyRoot || pathname.startsWith(`/${company.slug}/`);

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
							{t("sidebar.companyOverview", { defaultValue: "Overview" })}
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
	);
}

type BucketItem = { section: Section; href: string };
type Bucket = { group?: string; items: BucketItem[] };

function bucketsFor(phase: Phase, companySlug: string): Bucket[] {
	const buckets: Bucket[] = [];
	for (const section of phase.sections) {
		const href = sectionHref(companySlug, section.id);
		const last = buckets[buckets.length - 1];
		if (section.group && last && last.group === section.group) {
			last.items.push({ section, href });
		} else {
			buckets.push({ group: section.group, items: [{ section, href }] });
		}
	}
	return buckets;
}

function PhaseGroup({
	phase,
	companySlug,
	currentPath,
}: {
	phase: Phase;
	companySlug: string;
	currentPath: string;
}) {
	const buckets = bucketsFor(phase, companySlug);
	const isPhaseActive = buckets.some((b) =>
		b.items.some((it) => currentPath === it.href),
	);

	const [open, setOpen] = useState(isPhaseActive);
	useEffect(() => {
		if (isPhaseActive) setOpen(true);
	}, [isPhaseActive]);

	return (
		<Collapsible
			open={open}
			onOpenChange={setOpen}
			className="group/collapsible"
			render={<SidebarMenuSubItem />}
		>
			<CollapsibleTrigger className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-[10px] font-medium uppercase tracking-wide transition-colors text-muted-foreground hover:text-foreground hover:bg-muted data-[state=open]:text-foreground">
				<ChevronRightIcon className="size-3 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
				<span className="flex-1 truncate text-left">{phase.name}</span>
			</CollapsibleTrigger>
			<CollapsibleContent>
				<SidebarMenuSub>
					{buckets.flatMap((bucket, bi) =>
						bucket.group
							? [
									<NestedGroup
										key={`${bucket.group}-${bi}`}
										label={bucket.group}
										items={bucket.items}
										currentPath={currentPath}
									/>,
								]
							: bucket.items.map(({ section, href }) => (
									<SidebarMenuSubItem key={section.id}>
										<SidebarMenuSubButton
											isActive={currentPath === href}
											render={<Link to={href}>{section.name}</Link>}
										/>
									</SidebarMenuSubItem>
								)),
					)}
				</SidebarMenuSub>
			</CollapsibleContent>
		</Collapsible>
	);
}

function NestedGroup({
	label,
	items,
	currentPath,
}: {
	label: string;
	items: BucketItem[];
	currentPath: string;
}) {
	const isActive = items.some((it) => currentPath === it.href);
	const [open, setOpen] = useState(isActive);
	useEffect(() => {
		if (isActive) setOpen(true);
	}, [isActive]);

	return (
		<Collapsible
			open={open}
			onOpenChange={setOpen}
			className="group/subcollapsible"
			render={<SidebarMenuSubItem />}
		>
			<CollapsibleTrigger className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-xs font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-muted data-[state=open]:text-foreground">
				<ChevronRightIcon className="size-3 transition-transform duration-200 group-data-[state=open]/subcollapsible:rotate-90" />
				<span className="flex-1 truncate text-left">{label}</span>
			</CollapsibleTrigger>
			<CollapsibleContent>
				<SidebarMenuSub>
					{items.map(({ section, href }) => (
						<SidebarMenuSubItem key={section.id}>
							<SidebarMenuSubButton
								isActive={currentPath === href}
								render={<Link to={href}>{section.name}</Link>}
							/>
						</SidebarMenuSubItem>
					))}
				</SidebarMenuSub>
			</CollapsibleContent>
		</Collapsible>
	);
}
