import { ClockIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Separator } from "@/components/ui/separator";
import { OverviewAntiPatternsAccordion } from "./components/OverviewAntiPatternsAccordion";
import { OverviewConcepts } from "./components/OverviewConcepts";
import { OverviewCtas } from "./components/OverviewCtas";
import { OverviewGlossary } from "./components/OverviewGlossary";
import { OverviewPrepTimeline } from "./components/OverviewPrepTimeline";
import { OverviewRoundsTabs } from "./components/OverviewRoundsTabs";
import { OverviewShell } from "./components/OverviewShell";
import { OverviewTimeline } from "./components/OverviewTimeline";
import { OverviewValuesTabs } from "./components/OverviewValuesTabs";
import { type DeepItem, type SectionCta, tArray } from "./lib";

export function PowerDayOverview({ companySlug }: { companySlug: string }) {
	const { t } = useTranslation();
	const k = (key: string) => t(`sectionOverview.powerDay.${key}`);

	const timeline = tArray<{ time: string; label: string; note: string }>(
		t,
		"sectionOverview.powerDay.timeline",
	);
	const roundsDeep = tArray<DeepItem>(t, "sectionOverview.powerDay.roundsDeep");
	const valuesDeep = tArray<{
		title: string;
		body: string;
		signal: string;
		antiSignal: string;
		petPeeve: string;
	}>(t, "sectionOverview.powerDay.valuesDeep");
	const glossary = tArray<{ category: string; products: string; why: string }>(
		t,
		"sectionOverview.powerDay.glossary",
	);
	const antiPatterns = tArray<{ bad: string; why: string; fix: string }>(
		t,
		"sectionOverview.powerDay.antiPatterns",
	);
	const prep = tArray<{ when: string; tasks: string[] }>(
		t,
		"sectionOverview.powerDay.prep",
	);
	const concepts = tArray<{
		term: string;
		definition: string;
		why: string;
		example: string;
		signals?: string[];
		pitfalls?: string[];
	}>(t, "sectionOverview.powerDay.concepts");

	const ctas: SectionCta[] = [
		{
			to: `/${companySlug}/mock-power-day`,
			label: k("ctaStart"),
			icon: ClockIcon,
			variant: "default",
		},
		{
			to: `/${companySlug}/mock-gca`,
			label: k("ctaGca"),
			icon: ClockIcon,
			variant: "secondary",
		},
	];

	return (
		<OverviewShell
			kicker={k("kicker")}
			title={k("title")}
			summary={k("summary")}
		>
			<OverviewTimeline header={k("timelineHeader")} items={timeline} />
			<Separator />
			<OverviewConcepts
				header={k("conceptsHeader")}
				sub={k("conceptsSub")}
				items={concepts}
				labels={{
					definition: t("overviewLabels.definition", {
						defaultValue: "What it is",
					}),
					whyMatters: t("overviewLabels.whyMatters", {
						defaultValue: "Why Capital One cares",
					}),
					inPractice: t("overviewLabels.inPractice", {
						defaultValue: "In practice",
					}),
					signals: t("overviewLabels.conceptSignals", {
						defaultValue: "Signals you're doing it well",
					}),
					pitfalls: t("overviewLabels.conceptPitfalls", {
						defaultValue: "Common mistakes",
					}),
				}}
			/>
			<Separator />
			<OverviewRoundsTabs
				header={k("roundsHeader")}
				items={roundsDeep}
				labels={{
					evaluated: t("overviewLabels.evaluated", {
						defaultValue: "What they evaluate",
					}),
					pacing: t("overviewLabels.pacing", { defaultValue: "Pacing" }),
					pitfalls: t("overviewLabels.pitfalls", {
						defaultValue: "Common pitfalls",
					}),
				}}
			/>
			<Separator />
			<OverviewValuesTabs
				header={k("valuesHeader")}
				items={valuesDeep}
				labels={{
					signal: t("overviewLabels.signal", { defaultValue: "Signal" }),
					antiSignal: t("overviewLabels.antiSignal", {
						defaultValue: "Anti-signal",
					}),
					petPeeve: t("overviewLabels.petPeeve", { defaultValue: "Pet peeve" }),
				}}
			/>
			<Separator />
			<OverviewGlossary
				header={k("glossaryHeader")}
				sub={k("glossarySub")}
				rows={glossary}
				columns={{
					category: t("overviewLabels.category", { defaultValue: "Category" }),
					products: t("overviewLabels.products", { defaultValue: "Products" }),
					why: t("overviewLabels.why", { defaultValue: "Why it exists" }),
				}}
			/>
			<Separator />
			<OverviewAntiPatternsAccordion
				header={k("antiPatternsHeader")}
				items={antiPatterns}
				labels={{
					bad: t("overviewLabels.bad", { defaultValue: "Anti-pattern" }),
					why: t("overviewLabels.why", { defaultValue: "Why it costs you" }),
					fix: t("overviewLabels.fix", { defaultValue: "Say this instead" }),
				}}
			/>
			<Separator />
			<OverviewPrepTimeline header={k("prepHeader")} items={prep} />
			<OverviewCtas ctas={ctas} />
		</OverviewShell>
	);
}
