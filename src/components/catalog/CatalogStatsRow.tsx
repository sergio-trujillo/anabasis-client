import { ClockIcon, FlagIcon, SparklesIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Fade } from "@/components/animate-ui/primitives/effects/fade";
import { MagicCard } from "@/components/ui/magic-card";
import { NumberTicker } from "@/components/ui/number-ticker";

type Props = {
	active: number;
	soon: number;
	total: number;
};

export function CatalogStatsRow({ active, soon, total }: Props) {
	const { t } = useTranslation();
	const stats = [
		{ label: t("catalog.statsActive"), value: active, icon: FlagIcon },
		{ label: t("catalog.statsSoon"), value: soon, icon: ClockIcon },
		{ label: t("catalog.statsTotal"), value: total, icon: SparklesIcon },
	];
	return (
		<Fade delay={0.1}>
			<section
				aria-label={t("catalog.statsAria")}
				className="grid grid-cols-3 gap-4"
			>
				{stats.map(({ label, value, icon: Icon }) => (
					<MagicCard key={label} className="p-5 flex items-center gap-4">
						<span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
							<Icon className="size-5" />
						</span>
						<div className="min-w-0">
							<div className="text-3xl font-bold font-heading tabular-nums">
								<NumberTicker value={value} />
							</div>
							<div className="text-[11px] uppercase tracking-wider text-muted-foreground truncate">
								{label}
							</div>
						</div>
					</MagicCard>
				))}
			</section>
		</Fade>
	);
}
