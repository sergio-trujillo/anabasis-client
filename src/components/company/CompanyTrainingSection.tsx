import {
	ArrowRightIcon,
	ClockIcon,
	ShuffleIcon,
	SparklesIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { BorderBeam } from "@/components/ui/border-beam";
import { MagicCard } from "@/components/ui/magic-card";
import { cn } from "@/lib/utils";
import { type PlanItem, tArray } from "./lib";

export function CompanyTrainingSection({
	companySlug,
}: {
	companySlug: string;
}) {
	const { t } = useTranslation();
	const k = (key: string) => t(`companyOverview.capitalOne.${key}`);
	const plan = tArray<PlanItem>(t, "companyOverview.capitalOne.plan");
	const planIcons: Record<PlanItem["to"], typeof ClockIcon> = {
		"mock-power-day": ClockIcon,
		"mock-gca": ClockIcon,
		practice: ShuffleIcon,
	};

	return (
		<section className="space-y-3">
			<div className="space-y-1">
				<h2 className="text-xs uppercase tracking-wider text-muted-foreground">
					{k("planHeader")}
				</h2>
				<p className="text-xs text-muted-foreground/80 max-w-3xl">
					{k("planSub")}
				</p>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
				{plan.map((p, i) => {
					const Icon = planIcons[p.to] ?? SparklesIcon;
					const primary = i === 0;
					return (
						<Link
							key={p.to}
							to={`/${companySlug}/${p.to}`}
							className="group block"
						>
							<MagicCard
								className={cn(
									"relative overflow-hidden h-full p-5 transition-all",
									"hover:border-primary/40",
								)}
							>
								{primary && (
									<BorderBeam
										size={140}
										duration={10}
										colorFrom="var(--primary)"
										colorTo="var(--chart-2)"
									/>
								)}
								<div className="flex items-center gap-2 mb-3">
									<span
										className={cn(
											"flex size-9 items-center justify-center rounded-lg ring-1",
											primary
												? "bg-primary/10 text-primary ring-primary/20"
												: "bg-muted/40 text-muted-foreground ring-border/60 group-hover:text-foreground",
										)}
									>
										<Icon className="size-4" />
									</span>
									<div className="min-w-0 flex-1">
										<h3 className="font-heading text-sm font-semibold truncate">
											{p.title}
										</h3>
										<div className="text-[10px] uppercase tracking-wider text-muted-foreground/80 truncate">
											{p.subtitle}
										</div>
									</div>
								</div>
								<p className="text-xs text-muted-foreground leading-relaxed">
									{p.body}
								</p>
								<div
									className={cn(
										"inline-flex items-center gap-1.5 text-xs mt-4 font-medium",
										primary ? "text-primary" : "text-foreground",
									)}
								>
									{p.cta}
									<ArrowRightIcon className="size-3 transition-transform group-hover:translate-x-0.5" />
								</div>
							</MagicCard>
						</Link>
					);
				})}
			</div>
		</section>
	);
}
