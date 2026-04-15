import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { DeepItem } from "../lib";
import { OverviewSection } from "./OverviewSection";
import { PaperBulletList, PaperSceneBreak } from "./PaperHelpers";

export function OverviewRoundsTabs({
	header,
	items,
	labels,
}: {
	header: string;
	items: DeepItem[];
	labels: {
		evaluated: string;
		pacing: string;
		pitfalls: string;
		signals?: string;
		inPractice?: string;
		playbook?: string;
	};
}) {
	return (
		<OverviewSection header={header}>
			<article className="mx-auto max-w-3xl space-y-16 py-4">
				{items.map((it, i) => {
					const cleanTitle = it.title.replace(
						/^(Round|Ronda)\s+\d+\s*[—-]\s*/i,
						"",
					);
					return (
						<section key={it.title} className="space-y-7">
							<header className="space-y-3">
								<div className="flex items-center gap-3">
									<span className="font-mono text-xs text-muted-foreground/70 tabular-nums tracking-wider">
										§ {String(i + 1).padStart(2, "0")}
									</span>
									<Separator orientation="vertical" className="h-3.5" />
									<span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70 font-semibold">
										R{i + 1}
									</span>
								</div>
								<h3 className="font-heading text-3xl font-semibold tracking-tight leading-tight">
									{cleanTitle}
								</h3>
							</header>

							<p className="text-[15px] leading-[1.9] text-foreground/90">
								{it.body}
							</p>

							{(it.evaluated || it.pacing) && (
								<dl className="grid grid-cols-1 md:grid-cols-2 gap-6 border-l-2 border-border pl-6 py-1">
									{it.evaluated && (
										<div className="space-y-1.5">
											<dt className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-semibold">
												{labels.evaluated}
											</dt>
											<dd className="text-[15px] leading-[1.8] text-foreground/85">
												{it.evaluated}
											</dd>
										</div>
									)}
									{it.pacing && (
										<div className="space-y-1.5">
											<dt className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-semibold">
												{labels.pacing}
											</dt>
											<dd className="text-[15px] leading-[1.8] text-muted-foreground">
												{it.pacing}
											</dd>
										</div>
									)}
								</dl>
							)}

							{(it.example ||
								(it.signals && it.signals.length > 0) ||
								(it.pitfalls && it.pitfalls.length > 0) ||
								(it.playbook && it.playbook.length > 0)) && (
								<Card className="bg-muted/30 shadow-none">
									<CardContent className="space-y-6">
										{it.example && (
											<div className="space-y-2">
												<div className="text-[10px] uppercase tracking-[0.22em] text-primary/90 font-semibold">
													{labels.inPractice ?? "In practice"}
												</div>
												<p className="text-[15px] leading-[1.9] italic text-foreground/85">
													{it.example}
												</p>
											</div>
										)}

										{it.signals && it.signals.length > 0 && (
											<PaperBulletList
												label={labels.signals ?? "Signals"}
												tone="emerald"
												items={it.signals}
											/>
										)}

										{it.pitfalls && it.pitfalls.length > 0 && (
											<PaperBulletList
												label={labels.pitfalls}
												tone="amber"
												items={it.pitfalls}
											/>
										)}

										{it.playbook && it.playbook.length > 0 && (
											<PaperBulletList
												label={labels.playbook ?? "Playbook"}
												tone="primary"
												items={it.playbook}
											/>
										)}
									</CardContent>
								</Card>
							)}

							{i < items.length - 1 && <PaperSceneBreak />}
						</section>
					);
				})}
			</article>
		</OverviewSection>
	);
}
