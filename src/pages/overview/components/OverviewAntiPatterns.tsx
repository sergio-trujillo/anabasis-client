import { MagicCard } from "@/components/ui/magic-card";
import { OverviewSection } from "./OverviewSection";

export function OverviewAntiPatterns({
	header,
	items,
	labels,
}: {
	header: string;
	items: Array<{ bad: string; why: string; fix: string }>;
	labels: { bad: string; why: string; fix: string };
}) {
	return (
		<OverviewSection header={header}>
			<div className="grid grid-cols-1 gap-3">
				{items.map((ap, i) => (
					<MagicCard key={i} className="p-5 space-y-3">
						<div className="flex items-start gap-3">
							<span className="shrink-0 size-6 flex items-center justify-center rounded-md bg-rose-500/10 text-rose-600 ring-1 ring-rose-500/20 text-xs font-semibold">
								✗
							</span>
							<div className="min-w-0">
								<div className="uppercase tracking-wider text-[10px] font-semibold text-rose-600">
									{labels.bad}
								</div>
								<div className="text-sm font-medium mt-0.5 leading-relaxed">
									{ap.bad}
								</div>
							</div>
						</div>
						<div className="text-sm text-muted-foreground leading-relaxed pl-9">
							<span className="uppercase tracking-wider text-[10px] font-semibold text-amber-600">
								{labels.why}
							</span>
							<span className="ml-2">{ap.why}</span>
						</div>
						<div className="text-sm leading-relaxed pl-9 pt-1 border-t border-border/50">
							<span className="uppercase tracking-wider text-[10px] font-semibold text-emerald-600">
								{labels.fix}
							</span>
							<span className="ml-2 text-foreground">{ap.fix}</span>
						</div>
					</MagicCard>
				))}
			</div>
		</OverviewSection>
	);
}
