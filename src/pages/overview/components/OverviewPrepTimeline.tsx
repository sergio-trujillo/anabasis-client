import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { OverviewSection } from "./OverviewSection";
import { PaperBulletList, PaperSceneBreak } from "./PaperHelpers";

export function OverviewPrepTimeline({
	header,
	items,
	labels,
}: {
	header: string;
	items: Array<{
		when: string;
		tasks: string[];
		rationale?: string;
		deliverables?: string[];
		pitfalls?: string[];
	}>;
	labels?: {
		tasks?: string;
		deliverables?: string;
		pitfalls?: string;
	};
}) {
	return (
		<OverviewSection header={header}>
			<article className="mx-auto max-w-3xl space-y-16 py-4">
				{items.map((block, i) => (
					<section key={block.when} className="space-y-7">
						<header className="space-y-3">
							<div className="flex items-center gap-3">
								<span className="font-mono text-xs text-muted-foreground/70 tabular-nums tracking-wider">
									§ {String(i + 1).padStart(2, "0")}
								</span>
								<Separator orientation="vertical" className="h-3.5" />
								<span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70 font-semibold">
									Phase
								</span>
							</div>
							<h3 className="font-heading text-3xl font-semibold tracking-tight leading-tight">
								{block.when}
							</h3>
						</header>

						{block.rationale && (
							<p className="text-[15px] leading-[1.9] text-foreground/90">
								{block.rationale}
							</p>
						)}

						<Card className="bg-muted/30 shadow-none">
							<CardContent className="space-y-6">
								<PaperBulletList
									label={labels?.tasks ?? "Tasks"}
									tone="primary"
									items={block.tasks}
								/>

								{block.deliverables && block.deliverables.length > 0 && (
									<PaperBulletList
										label={labels?.deliverables ?? "Deliverables"}
										tone="emerald"
										items={block.deliverables}
									/>
								)}

								{block.pitfalls && block.pitfalls.length > 0 && (
									<PaperBulletList
										label={labels?.pitfalls ?? "Pitfalls"}
										tone="amber"
										items={block.pitfalls}
									/>
								)}
							</CardContent>
						</Card>

						{i < items.length - 1 && <PaperSceneBreak />}
					</section>
				))}
			</article>
		</OverviewSection>
	);
}
