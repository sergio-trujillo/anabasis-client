import {
	CheckCircle2Icon,
	ClockIcon,
	FileCode2Icon,
	SparklesIcon,
	UsersIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { MagicCard } from "@/components/ui/magic-card";
import { type JourneyStep, tArray } from "./lib";

export function CompanyJourneySection({
	companySlug: _companySlug,
}: {
	companySlug: string;
}) {
	const { t } = useTranslation();
	const k = (key: string) => t(`companyOverview.capitalOne.${key}`);
	const journey = tArray<JourneyStep>(t, "companyOverview.capitalOne.journey");
	const stepIcons = [UsersIcon, FileCode2Icon, ClockIcon, CheckCircle2Icon];

	return (
		<section className="space-y-3">
			<div className="space-y-1">
				<h2 className="text-xs uppercase tracking-wider text-muted-foreground">
					{k("journeyHeader")}
				</h2>
				<p className="text-xs text-muted-foreground/80 max-w-3xl">
					{k("journeySub")}
				</p>
			</div>
			<div className="relative">
				<div
					className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-border to-transparent -z-10"
					aria-hidden="true"
				/>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 relative">
					{journey.map((j, i) => {
						const Icon = stepIcons[i] ?? SparklesIcon;
						return (
							<MagicCard key={j.step} className="p-5 space-y-3 relative">
								<div className="flex items-center gap-2">
									<span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary ring-1 ring-primary/20">
										<Icon className="size-3.5" />
									</span>
									<span className="text-[10px] uppercase tracking-wider text-muted-foreground tabular-nums font-semibold">
										{String(i + 1).padStart(2, "0")}
									</span>
								</div>
								<div className="space-y-1">
									<h3 className="font-heading text-base font-semibold leading-tight">
										{j.step}
									</h3>
									<Badge variant="outline" className="text-[10px] h-5 px-1.5">
										{j.duration}
									</Badge>
								</div>
								<p className="text-xs text-muted-foreground leading-relaxed">
									{j.what}
								</p>
								<div className="text-xs pt-2 border-t border-border/50">
									<div className="uppercase tracking-wider text-[9px] font-semibold text-muted-foreground/70 mb-0.5">
										{t("overviewLabels.evaluated", {
											defaultValue: "What they evaluate",
										})}
									</div>
									<div className="leading-relaxed">{j.evaluated}</div>
								</div>
							</MagicCard>
						);
					})}
				</div>
			</div>
		</section>
	);
}
