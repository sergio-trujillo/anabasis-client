import { MagicCard } from "@/components/ui/magic-card";
import { OverviewSection } from "./OverviewSection";

export function OverviewPanelCards({
	header,
	sub,
	items,
	labels,
}: {
	header: string;
	sub?: string;
	items: Array<{
		title: string;
		body: string;
		level: string;
		probes: string;
		tip: string;
	}>;
	labels: { level: string; probes: string; tip: string };
}) {
	return (
		<OverviewSection header={header} sub={sub}>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
				{items.map((m, i) => (
					<MagicCard key={m.title} className="p-5 space-y-3">
						<div className="flex items-center gap-2">
							<span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary text-[11px] font-semibold ring-1 ring-primary/20 tabular-nums">
								{String(i + 1).padStart(2, "0")}
							</span>
							<h4 className="font-heading text-base font-semibold leading-tight">
								{m.title}
							</h4>
						</div>
						<p className="text-sm leading-relaxed">{m.body}</p>
						<div className="space-y-2 pt-1 border-t border-border/50">
							<div className="space-y-0.5 text-xs">
								<div className="uppercase tracking-wider text-[10px] font-semibold text-muted-foreground/70">
									{labels.level}
								</div>
								<div className="text-muted-foreground leading-relaxed">
									{m.level}
								</div>
							</div>
							<div className="space-y-0.5 text-xs">
								<div className="uppercase tracking-wider text-[10px] font-semibold text-primary/80">
									{labels.probes}
								</div>
								<div className="leading-relaxed">{m.probes}</div>
							</div>
							<div className="space-y-0.5 text-xs border-l-2 border-emerald-500/40 pl-3 py-1 bg-emerald-500/5 rounded-r-md">
								<div className="uppercase tracking-wider text-[10px] font-semibold text-emerald-600">
									{labels.tip}
								</div>
								<div className="leading-relaxed italic">{m.tip}</div>
							</div>
						</div>
					</MagicCard>
				))}
			</div>
		</OverviewSection>
	);
}
