import { MagicCard } from "@/components/ui/magic-card";

export function OverviewTips({
	header,
	tips,
}: {
	header: string;
	tips: string[];
}) {
	return (
		<section className="space-y-3">
			<h3 className="text-xs uppercase tracking-wider text-muted-foreground">
				{header}
			</h3>
			<MagicCard className="p-5">
				<ul className="space-y-2.5">
					{tips.map((tip, i) => (
						<li key={i} className="flex items-start gap-3 text-sm">
							<span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-semibold tabular-nums mt-0.5 ring-1 ring-primary/20">
								{i + 1}
							</span>
							<span className="leading-relaxed">{tip}</span>
						</li>
					))}
				</ul>
			</MagicCard>
		</section>
	);
}
