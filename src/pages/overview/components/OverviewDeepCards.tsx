import { MagicCard } from "@/components/ui/magic-card";
import { cn } from "@/lib/utils";
import type { DeepItem } from "../lib";
import { OverviewSection } from "./OverviewSection";

export function OverviewDeepCards({
	header,
	sub,
	items,
	labels,
}: {
	header: string;
	sub?: string;
	items: DeepItem[];
	labels: {
		pattern?: string;
		pacing?: string;
		trap?: string;
		evaluated?: string;
		pitfalls?: string;
	};
}) {
	return (
		<OverviewSection header={header} sub={sub}>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
				{items.map((item, i) => (
					<MagicCard key={item.title} className="p-5 space-y-3">
						<div className="flex items-center gap-2">
							<span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary text-[11px] font-semibold ring-1 ring-primary/20 tabular-nums">
								{i + 1}
							</span>
							<h4 className="font-heading text-base font-semibold">
								{item.title}
							</h4>
						</div>
						<p className="text-sm text-muted-foreground leading-relaxed">
							{item.body}
						</p>
						<div className="space-y-2 pt-1">
							{item.pattern && labels.pattern && (
								<DetailRow label={labels.pattern} value={item.pattern} />
							)}
							{item.evaluated && labels.evaluated && (
								<DetailRow label={labels.evaluated} value={item.evaluated} />
							)}
							{item.pacing && labels.pacing && (
								<DetailRow label={labels.pacing} value={item.pacing} />
							)}
							{item.trap && labels.trap && (
								<DetailRow label={labels.trap} value={item.trap} tone="warn" />
							)}
							{item.pitfalls && labels.pitfalls && (
								<div className="text-xs space-y-1 pt-1">
									<div className="uppercase tracking-wider text-amber-600 font-semibold text-[10px]">
										{labels.pitfalls}
									</div>
									<ul className="space-y-1">
										{item.pitfalls.map((p, j) => (
											<li
												key={j}
												className="flex gap-2 leading-relaxed text-muted-foreground"
											>
												<span className="text-amber-600">•</span>
												<span>{p}</span>
											</li>
										))}
									</ul>
								</div>
							)}
						</div>
					</MagicCard>
				))}
			</div>
		</OverviewSection>
	);
}

function DetailRow({
	label,
	value,
	tone = "muted",
}: {
	label: string;
	value: string;
	tone?: "muted" | "warn";
}) {
	return (
		<div className="text-xs space-y-0.5">
			<div
				className={cn(
					"uppercase tracking-wider font-semibold text-[10px]",
					tone === "warn" ? "text-amber-600" : "text-muted-foreground/70",
				)}
			>
				{label}
			</div>
			<div className="text-sm leading-relaxed">{value}</div>
		</div>
	);
}
