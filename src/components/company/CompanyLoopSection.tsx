import { ChevronRightIcon } from "lucide-react";
import { Link } from "react-router";
import {
	hrefForSection,
	iconForKind,
	kindLabel,
} from "@/components/problem/sectionKind";
import { Badge } from "@/components/ui/badge";
import { MagicCard } from "@/components/ui/magic-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import type { Phase, Section } from "./lib";

type Bucket = { group?: string; items: Section[] };

function bucketsForPhase(phase: Phase): Bucket[] {
	const out: Bucket[] = [];
	for (const section of phase.sections) {
		const last = out[out.length - 1];
		if (section.group && last && last.group === section.group) {
			last.items.push(section);
		} else {
			out.push({ group: section.group, items: [section] });
		}
	}
	return out;
}

export function CompanyLoopSection({ companySlug }: { companySlug: string }) {
	const companyQuery = trpc.companies.get.useQuery({ slug: companySlug });
	const loop = (
		companyQuery.data as { loop: { phases: Phase[] } | null } | undefined
	)?.loop;
	if (!loop || loop.phases.length === 0) return null;
	return <LoopTabs companySlug={companySlug} phases={loop.phases} />;
}

export function LoopTabs({
	companySlug,
	phases,
}: {
	companySlug: string;
	phases: Phase[];
}) {
	if (phases.length === 0) return null;

	return (
		<section className="space-y-3">
			<h2 className="text-xs uppercase tracking-wider text-muted-foreground">
				The full loop · {phases.length} phase{phases.length === 1 ? "" : "s"}
			</h2>

			<Tabs defaultValue={phases[0].id}>
				<TabsList className="h-auto flex-wrap gap-1 bg-muted/40 p-1">
					{phases.map((phase, i) => (
						<TabsTrigger
							key={phase.id}
							value={phase.id}
							className="data-[state=active]:bg-background text-xs"
						>
							<span className="font-mono text-[10px] opacity-50 mr-1.5 tabular-nums">
								{String(i + 1).padStart(2, "0")}
							</span>
							{phase.name}
						</TabsTrigger>
					))}
				</TabsList>
				{phases.map((phase) => (
					<TabsContent key={phase.id} value={phase.id} className="mt-3">
						<PhaseCard companySlug={companySlug} phase={phase} />
					</TabsContent>
				))}
			</Tabs>
		</section>
	);
}

function PhaseCard({
	companySlug,
	phase,
}: {
	companySlug: string;
	phase: Phase;
}) {
	return (
		<MagicCard className="p-6 h-full">
			<header className="mb-5 pb-4 border-b border-border/60">
				<div className="flex items-center gap-2 mb-1">
					<span className="inline-flex size-1.5 rounded-full bg-primary" />
					<h3 className="font-heading text-base font-semibold tracking-tight">
						{phase.name}
					</h3>
				</div>
				{phase.description && (
					<p className="text-xs text-muted-foreground mt-2 leading-relaxed">
						{phase.description}
					</p>
				)}
			</header>
			<ul className="space-y-3">
				{bucketsForPhase(phase).map((bucket, bi) => (
					<li key={`${bucket.group ?? "flat"}-${bi}`}>
						{bucket.group && (
							<div className="mb-1.5 px-3 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
								{bucket.group}
							</div>
						)}
						<ul
							className={
								bucket.group
									? "space-y-1 pl-3 border-l border-border/60"
									: "space-y-1"
							}
						>
							{bucket.items.map((section) => {
								const Icon = iconForKind(section.kind);
								const isMock = section.id.endsWith("-mock");
								return (
									<li key={section.id}>
										<Link
											to={hrefForSection(companySlug, section)}
											className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-muted transition-colors border border-transparent hover:border-border"
										>
											<span
												className={
													"flex size-8 items-center justify-center rounded-md ring-1 ring-border/60 " +
													(isMock
														? "bg-primary/10 text-primary"
														: "bg-muted/40 text-muted-foreground group-hover:text-foreground")
												}
											>
												<Icon className="size-4" />
											</span>
											<div className="flex-1 min-w-0">
												<div className="font-medium truncate">
													{section.name}
												</div>
												<div className="text-[10px] uppercase tracking-wider text-muted-foreground/80">
													{kindLabel(section.kind)}
												</div>
											</div>
											{isMock ? (
												<Badge className="bg-primary/10 text-primary hover:bg-primary/10 border-0">
													Timed
												</Badge>
											) : null}
											<ChevronRightIcon className="size-4 text-muted-foreground/60 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
										</Link>
									</li>
								);
							})}
						</ul>
					</li>
				))}
			</ul>
		</MagicCard>
	);
}
