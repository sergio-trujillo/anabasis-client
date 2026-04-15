import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { OverviewSection } from "./OverviewSection";
import { PaperBulletList, PaperSceneBreak } from "./PaperHelpers";

export function OverviewValuesTabs({
	header,
	items,
	labels,
}: {
	header: string;
	items: Array<{
		title: string;
		body: string;
		signal: string;
		antiSignal: string;
		petPeeve: string;
		signals?: string[];
		antiSignals?: string[];
		petPeeves?: string[];
		example?: string;
	}>;
	labels: {
		signal: string;
		antiSignal: string;
		petPeeve: string;
		inPractice?: string;
	};
}) {
	return (
		<OverviewSection header={header}>
			<article className="mx-auto max-w-3xl space-y-16 py-4">
				{items.map((v, i) => {
					const signals =
						v.signals && v.signals.length > 0 ? v.signals : [v.signal];
					const antiSignals =
						v.antiSignals && v.antiSignals.length > 0
							? v.antiSignals
							: [v.antiSignal];
					const petPeeves =
						v.petPeeves && v.petPeeves.length > 0 ? v.petPeeves : [v.petPeeve];
					return (
						<section key={v.title} className="space-y-7">
							<header className="space-y-3">
								<div className="flex items-center gap-3">
									<span className="font-mono text-xs text-muted-foreground/70 tabular-nums tracking-wider">
										§ {String(i + 1).padStart(2, "0")}
									</span>
									<Separator orientation="vertical" className="h-3.5" />
									<span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70 font-semibold">
										Value
									</span>
								</div>
								<h3 className="font-heading text-3xl font-semibold tracking-tight leading-tight">
									{v.title}
								</h3>
							</header>

							<p className="text-[15px] leading-[1.9] text-foreground/90">
								{v.body}
							</p>

							<Card className="bg-muted/30 shadow-none">
								<CardContent className="space-y-6">
									{v.example && (
										<div className="space-y-2">
											<div className="text-[10px] uppercase tracking-[0.22em] text-primary/90 font-semibold">
												{labels.inPractice ?? "In practice"}
											</div>
											<p className="text-[15px] leading-[1.9] italic text-foreground/85">
												{v.example}
											</p>
										</div>
									)}

									<PaperBulletList
										label={labels.signal}
										tone="emerald"
										items={signals}
									/>
									<PaperBulletList
										label={labels.antiSignal}
										tone="rose"
										items={antiSignals}
									/>
									<PaperBulletList
										label={labels.petPeeve}
										tone="amber"
										items={petPeeves}
									/>
								</CardContent>
							</Card>

							{i < items.length - 1 && <PaperSceneBreak />}
						</section>
					);
				})}
			</article>
		</OverviewSection>
	);
}
