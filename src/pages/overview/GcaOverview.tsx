import { ClockIcon, SparklesIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { OverviewAntiPatterns } from "./components/OverviewAntiPatterns";
import { OverviewCtas } from "./components/OverviewCtas";
import { OverviewDeepCards } from "./components/OverviewDeepCards";
import { OverviewFingerprints } from "./components/OverviewFingerprints";
import { OverviewGrid } from "./components/OverviewGrid";
import { OverviewShell } from "./components/OverviewShell";
import { OverviewSkipList } from "./components/OverviewSkipList";
import { OverviewTips } from "./components/OverviewTips";
import { type DeepItem, type SectionCta, tArray } from "./lib";

export function GcaOverview({ companySlug }: { companySlug: string }) {
	const { t } = useTranslation();
	const k = (key: string) => t(`sectionOverview.gca.${key}`);

	const scoring = tArray<{ title: string; body: string }>(
		t,
		"sectionOverview.gca.scoring",
	);
	const modulesDeep = tArray<DeepItem>(t, "sectionOverview.gca.modulesDeep");
	const fingerprints = tArray<{ category: string; signal: string }>(
		t,
		"sectionOverview.gca.fingerprints",
	);
	const skip = tArray<string>(t, "sectionOverview.gca.skip");
	const antiPatterns = tArray<{ bad: string; why: string; fix: string }>(
		t,
		"sectionOverview.gca.antiPatterns",
	);
	const tips = [k("tip1"), k("tip2"), k("tip3"), k("tip4")];

	const weights = ["100", "200", "300", "400"];
	const modulesWithWeight = modulesDeep.map((m, i) => ({
		...m,
		body: `${m.body}`,
		weight: weights[i],
	})) as (DeepItem & { weight: string })[];

	const ctas: SectionCta[] = [
		{
			to: `/${companySlug}/mock-gca`,
			label: k("ctaStart"),
			icon: ClockIcon,
			variant: "default",
		},
		{
			to: `/${companySlug}/practice`,
			label: k("ctaPractice"),
			icon: SparklesIcon,
			variant: "secondary",
		},
	];

	return (
		<OverviewShell
			kicker={k("kicker")}
			title={k("title")}
			summary={k("summary")}
		>
			<OverviewGrid header={k("scoringHeader")} items={scoring} />
			<OverviewDeepCards
				header={k("modulesHeader")}
				items={modulesWithWeight}
				labels={{
					pattern: t("overviewLabels.pattern", { defaultValue: "Pattern" }),
					pacing: t("overviewLabels.pacing", { defaultValue: "Pacing" }),
					trap: t("overviewLabels.trap", { defaultValue: "Trap" }),
				}}
			/>
			<OverviewFingerprints
				header={k("fingerprintsHeader")}
				rows={fingerprints}
				columns={{
					category: t("overviewLabels.pattern", { defaultValue: "Pattern" }),
					signal: t("overviewLabels.signal", { defaultValue: "Signal" }),
				}}
			/>
			<OverviewSkipList header={k("skipHeader")} items={skip} />
			<OverviewAntiPatterns
				header={k("antiPatternsHeader")}
				items={antiPatterns}
				labels={{
					bad: t("overviewLabels.bad", { defaultValue: "Anti-pattern" }),
					why: t("overviewLabels.why", { defaultValue: "Why it costs you" }),
					fix: t("overviewLabels.fix", { defaultValue: "Say this instead" }),
				}}
			/>
			<OverviewTips header={k("tipsHeader")} tips={tips} />
			<OverviewCtas ctas={ctas} />
		</OverviewShell>
	);
}
