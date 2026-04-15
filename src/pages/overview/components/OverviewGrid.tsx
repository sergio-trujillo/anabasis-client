import { Badge } from "@/components/ui/badge";
import { MagicCard } from "@/components/ui/magic-card";
import { OverviewSection } from "./OverviewSection";

export function OverviewGrid({
	header,
	items,
}: {
	header: string;
	items: Array<{ title: string; body: string; weight?: string }>;
}) {
	return (
		<OverviewSection header={header}>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
				{items.map((item, i) => (
					<MagicCard key={item.title} className="p-5 space-y-2">
						<div className="flex items-center justify-between gap-2">
							<div className="flex items-center gap-2">
								<span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary text-[11px] font-semibold ring-1 ring-primary/20 tabular-nums">
									{i + 1}
								</span>
								<h4 className="font-heading text-base font-semibold truncate">
									{item.title}
								</h4>
							</div>
							{item.weight && (
								<Badge variant="outline" className="text-[10px] shrink-0">
									{item.weight}
								</Badge>
							)}
						</div>
						<p className="text-sm text-muted-foreground leading-relaxed">
							{item.body}
						</p>
					</MagicCard>
				))}
			</div>
		</OverviewSection>
	);
}
