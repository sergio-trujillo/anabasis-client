import { ChevronRightIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { MagicCard } from "@/components/ui/magic-card";
import { type DistinctiveItem, tArray } from "./lib";

export function CompanyDistinctiveSection({
	companySlug,
}: {
	companySlug: string;
}) {
	const { t } = useTranslation();
	const k = (key: string) => t(`companyOverview.capitalOne.${key}`);
	const distinctive = tArray<DistinctiveItem>(
		t,
		"companyOverview.capitalOne.distinctive",
	);

	return (
		<section className="space-y-3">
			<div className="space-y-1">
				<h2 className="text-xs uppercase tracking-wider text-muted-foreground">
					{k("distinctiveHeader")}
				</h2>
				<p className="text-xs text-muted-foreground/80 max-w-3xl">
					{k("distinctiveSub")}
				</p>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
				{distinctive.map((d, i) => (
					<MagicCard key={d.title} className="p-5 space-y-2">
						<div className="flex items-start gap-2">
							<span className="shrink-0 flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary text-[11px] font-semibold ring-1 ring-primary/20 tabular-nums mt-0.5">
								{i + 1}
							</span>
							<h3 className="font-heading text-base font-semibold leading-tight">
								{d.title}
							</h3>
						</div>
						<p className="text-sm text-muted-foreground leading-relaxed">
							{d.body}
						</p>
					</MagicCard>
				))}
			</div>
			<div className="flex flex-wrap gap-3 pt-2 text-xs">
				<Link
					to={`/${companySlug}/overview/power-day`}
					className="inline-flex items-center gap-1 text-primary hover:underline"
				>
					<ChevronRightIcon className="size-3" />
					{k("valuesLink")}
				</Link>
				<Link
					to={`/${companySlug}/overview/gca`}
					className="inline-flex items-center gap-1 text-primary hover:underline"
				>
					<ChevronRightIcon className="size-3" />
					{k("pipelineLink")}
				</Link>
			</div>
		</section>
	);
}
