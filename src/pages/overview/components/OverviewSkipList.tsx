import { MagicCard } from "@/components/ui/magic-card";
import { OverviewSection } from "./OverviewSection";

export function OverviewSkipList({
	header,
	items,
}: {
	header: string;
	items: string[];
}) {
	return (
		<OverviewSection header={header}>
			<MagicCard className="p-5">
				<ul className="space-y-2.5">
					{items.map((item, i) => (
						<li
							key={i}
							className="flex items-start gap-3 text-sm leading-relaxed"
						>
							<span className="shrink-0 size-5 flex items-center justify-center rounded-full bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20 text-[10px] font-semibold tabular-nums mt-0.5">
								{i + 1}
							</span>
							<span>{item}</span>
						</li>
					))}
				</ul>
			</MagicCard>
		</OverviewSection>
	);
}
