// Section page — /:companySlug/section/:sectionId
// Lists all exercises whose `section` matches :sectionId.
// Special-cases "gca-mock" / "power-day-mock" by redirecting to the
// dedicated timed pages, and "gca-overview" / "power-day-overview"
// by rendering the full overview landing.

import {
	ArrowRightIcon,
	ChevronRightIcon,
	ClockIcon,
	SparklesIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, Navigate, useParams } from "react-router";
import { Fade } from "@/components/animate-ui/primitives/effects/fade";
import { GradientText } from "@/components/animate-ui/primitives/texts/gradient";
import {
	ExercisesDataTable,
	type ExerciseRow,
} from "@/components/problem/ExercisesDataTable";
import { iconForKind, kindLabel } from "@/components/problem/sectionKind";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { Badge } from "@/components/ui/badge";
import { BorderBeam } from "@/components/ui/border-beam";
import { buttonVariants } from "@/components/ui/button";
import { MagicCard } from "@/components/ui/magic-card";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { GcaOverview } from "./overview/GcaOverview";
import type { SectionCta } from "./overview/lib";
import { PowerDayOverview } from "./overview/PowerDayOverview";

type ExerciseListItem = ExerciseRow;

export function SectionPage() {
	const { t: _t } = useTranslation();
	const { companySlug = "", sectionId = "" } = useParams();

	// Redirect mock sections to their dedicated timed pages.
	if (sectionId === "gca-mock") {
		return <Navigate to={`/${companySlug}/mock-gca`} replace />;
	}
	if (sectionId === "power-day-mock") {
		return <Navigate to={`/${companySlug}/mock-power-day`} replace />;
	}

	const companyQuery = trpc.companies.get.useQuery({ slug: companySlug });
	const exercisesQuery = trpc.exercises.list.useQuery();

	const loop = (
		companyQuery.data as
			| {
					loop: {
						phases: Array<{
							id: string;
							name: string;
							sections: Array<{ id: string; name: string; kind: string }>;
						}>;
					} | null;
			  }
			| undefined
	)?.loop;

	const section = loop?.phases
		.flatMap((p) => p.sections.map((s) => ({ ...s, phaseName: p.name })))
		.find((s) => s.id === sectionId);

	const allExercises =
		(exercisesQuery.data as ExerciseListItem[] | undefined) ?? [];
	const DIFF_ORDER: Record<string, number> = { easy: 0, medium: 1, hard: 2 };
	const filtered = allExercises
		.filter((ex) => ex.section === sectionId)
		.slice()
		.sort((a, b) => {
			const da = DIFF_ORDER[a.difficulty ?? ""] ?? 99;
			const db = DIFF_ORDER[b.difficulty ?? ""] ?? 99;
			return da - db;
		});

	const isPending = companyQuery.isPending || exercisesQuery.isPending;
	const Icon = iconForKind(section?.kind ?? "default");

	return (
		<div className="flex-1 overflow-y-auto">
			<div className="relative min-h-[calc(100vh-3.5rem)]">
				<AnimatedGridPattern
					numSquares={36}
					maxOpacity={0.06}
					duration={3}
					className="absolute inset-0 -z-10 [mask-image:radial-gradient(700px_circle_at_top,white,transparent)]"
				/>
				<div className="relative p-2 w-full space-y-4">
					{isPending && (
						<div className="space-y-4">
							<Skeleton className="h-10 w-80" />
							<Skeleton className="h-24 w-full rounded-xl" />
							<Skeleton className="h-64 w-full rounded-xl" />
						</div>
					)}

					{!isPending && (
						<>
							<Fade>
								<header className="flex items-center gap-3">
									<span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-border">
										<Icon className="size-4" />
									</span>
									<div className="flex-1 min-w-0">
										<div className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
											<Link
												to={`/${companySlug}`}
												className="hover:text-foreground transition-colors"
											>
												{(
													companyQuery.data as
														| { company?: { name?: string } }
														| undefined
												)?.company?.name ?? "Company"}
											</Link>
											{section && (
												<>
													<ChevronRightIcon className="size-3" />
													<span>{section.phaseName}</span>
												</>
											)}
										</div>
										<h1 className="text-lg font-bold font-heading tracking-tight truncate leading-tight">
											<GradientText
												text={section?.name ?? sectionId}
												gradient="linear-gradient(90deg, var(--primary) 0%, var(--chart-2) 50%, var(--primary) 100%)"
											/>
										</h1>
									</div>
									{section && (
										<Badge variant="outline" className="text-[10px] shrink-0">
											{kindLabel(section.kind)}
										</Badge>
									)}
								</header>
							</Fade>

							{sectionId === "gca-overview" ? (
								<Fade delay={0.1}>
									<GcaOverview companySlug={companySlug} />
								</Fade>
							) : sectionId === "power-day-overview" ? (
								<Fade delay={0.1}>
									<PowerDayOverview companySlug={companySlug} />
								</Fade>
							) : filtered.length === 0 ? (
								<Fade delay={0.1}>
									<EmptySectionState
										companySlug={companySlug}
										sectionId={sectionId}
										section={section ?? null}
									/>
								</Fade>
							) : (
								<Fade delay={0.1}>
									<ExercisesDataTable
										companySlug={companySlug}
										exercises={filtered}
									/>
								</Fade>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
}

type Section = { id: string; name: string; kind: string };

function EmptySectionState({
	companySlug,
	sectionId,
	section,
}: {
	companySlug: string;
	sectionId: string;
	section: Section | null;
}) {
	const { t } = useTranslation();

	if (!section) {
		return (
			<MagicCard className="p-10 text-center">
				<p className="text-sm text-muted-foreground">
					{t("section.notFound", {
						defaultValue: "Section not listed in the company loop.",
					})}
				</p>
				<Link
					to={`/${companySlug}`}
					className="inline-flex items-center gap-1 text-xs text-primary mt-4 hover:underline"
				>
					<ChevronRightIcon className="size-3 rotate-180" />
					{t("section.backToCompany", { defaultValue: "Back to company" })}
				</Link>
			</MagicCard>
		);
	}

	const ctas = ctasForKind(companySlug, sectionId, section.kind);
	const Icon = iconForKind(section.kind);

	return (
		<MagicCard className="relative overflow-hidden p-8 md:p-10">
			<BorderBeam size={180} duration={12} />
			<div className="max-w-2xl mx-auto text-center space-y-5">
				<div className="inline-flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
					<Icon className="size-6" />
				</div>

				<div className="space-y-2">
					<h3 className="font-heading text-2xl font-semibold tracking-tight">
						{t("section.emptyHeadline", {
							defaultValue: "This section is exercised dynamically",
							section: section.name,
						})}
					</h3>
					<p className="text-sm text-muted-foreground leading-relaxed">
						{emptyBodyForKind(section.kind, t)}
					</p>
				</div>

				{ctas.length > 0 && (
					<div className="flex flex-wrap gap-2 justify-center pt-2">
						{ctas.map((cta) => (
							<Link
								key={cta.to}
								to={cta.to}
								className={cn(
									buttonVariants({
										variant: cta.variant,
										size: "default",
									}),
									"gap-2",
								)}
							>
								<cta.icon className="size-4" />
								{cta.label}
								<ArrowRightIcon className="size-3.5" />
							</Link>
						))}
					</div>
				)}

				<Link
					to={`/${companySlug}`}
					className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
				>
					<ChevronRightIcon className="size-3 rotate-180" />
					{t("section.backToCompany", { defaultValue: "Back to company" })}
				</Link>
			</div>
		</MagicCard>
	);
}

function ctasForKind(
	companySlug: string,
	_sectionId: string,
	kind: string,
): SectionCta[] {
	switch (kind) {
		case "code":
		case "code+defense":
			return [
				{
					to: `/${companySlug}/mock-power-day`,
					label: "Mock Power Day",
					icon: ClockIcon,
					variant: "default",
				},
				{
					to: `/${companySlug}/mock-gca`,
					label: "Mock GCA",
					icon: ClockIcon,
					variant: "secondary",
				},
			];
		case "interviewer-chat":
		case "behavioral":
		case "business-case":
			return [
				{
					to: `/${companySlug}/mock-power-day`,
					label: "Mock Power Day",
					icon: ClockIcon,
					variant: "default",
				},
			];
		case "lesson+drills":
			return [
				{
					to: `/${companySlug}/practice`,
					label: "Random practice",
					icon: SparklesIcon,
					variant: "secondary",
				},
			];
		default:
			return [];
	}
}

function emptyBodyForKind(
	kind: string,
	t: (k: string, o?: { defaultValue: string }) => string,
): string {
	switch (kind) {
		case "code":
		case "code+defense":
			return t("section.emptyCode", {
				defaultValue:
					"Coding rounds draw from the GCA exercise pool at runtime. Launch a Mock Power Day (3 hr onsite) or a Mock GCA (70-min timed) to exercise this round against live problems.",
			});
		case "interviewer-chat":
			return t("section.emptyChat", {
				defaultValue:
					"System-design rounds run as interviewer chats. The scenarios live inside the Power Day loop — start a Mock Power Day to rotate through them.",
			});
		case "behavioral":
			return t("section.emptyBehavioral", {
				defaultValue:
					"Behavioral rounds use open-prompt drills and interviewer chats. Start a Mock Power Day to land on one of them at random.",
			});
		case "business-case":
			return t("section.emptyCase", {
				defaultValue:
					"Business-case rounds blend frameworks and interviewer-chat scenarios. The Mock Power Day picks one to drill.",
			});
		case "lesson+drills":
			return t("section.emptyLesson", {
				defaultValue:
					"Lesson content is still being authored. Random practice is the closest thing until this section ships.",
			});
		default:
			return t("section.empty", {
				defaultValue:
					"No exercises authored yet for this section. Content authoring is ongoing.",
			});
	}
}
