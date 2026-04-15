import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { OverviewSection } from "./OverviewSection";
import { PaperBulletList, PaperSceneBreak } from "./PaperHelpers";

export function OverviewAntiPatternsAccordion({
	header,
	sub,
	items,
	labels,
}: {
	header: string;
	sub?: string;
	items: Array<{
		bad: string;
		why: string;
		fix: string;
		examples?: string[];
		triggers?: string[];
	}>;
	labels: {
		bad: string;
		why: string;
		fix: string;
		examples?: string;
		triggers?: string;
	};
}) {
	return (
		<OverviewSection header={header} sub={sub}>
			<article className="mx-auto max-w-3xl space-y-16 py-4">
				{items.map((ap, i) => (
					<section key={i} className="space-y-7">
						<header className="space-y-3">
							<div className="flex items-center gap-3">
								<span className="font-mono text-xs text-muted-foreground/70 tabular-nums tracking-wider">
									§ {String(i + 1).padStart(2, "0")}
								</span>
								<Separator orientation="vertical" className="h-3.5" />
								<span className="text-[10px] uppercase tracking-[0.22em] text-rose-600/90 font-semibold">
									{labels.bad}
								</span>
							</div>
							<h3 className="font-heading text-3xl font-semibold tracking-tight leading-tight">
								{ap.bad}
							</h3>
						</header>

						<blockquote className="border-l-2 border-amber-500/50 pl-6 py-1 space-y-2">
							<div className="text-[10px] uppercase tracking-[0.22em] text-amber-600/90 font-semibold">
								{labels.why}
							</div>
							<p className="text-[15px] leading-[1.9] text-muted-foreground">
								{ap.why}
							</p>
						</blockquote>

						<Card className="bg-muted/30 shadow-none">
							<CardContent className="space-y-6">
								<div className="space-y-2">
									<div className="text-[10px] uppercase tracking-[0.22em] text-emerald-600/90 font-semibold">
										{labels.fix}
									</div>
									<p className="text-[15px] leading-[1.9] italic text-foreground/85">
										{ap.fix}
									</p>
								</div>

								{ap.triggers && ap.triggers.length > 0 && (
									<PaperBulletList
										label={labels.triggers ?? "Triggers"}
										tone="amber"
										items={ap.triggers}
									/>
								)}

								{ap.examples && ap.examples.length > 0 && (
									<PaperBulletList
										label={labels.examples ?? "Examples"}
										tone="rose"
										items={ap.examples}
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
