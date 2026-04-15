import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { OverviewSection } from "./OverviewSection";
import { PaperBulletList, PaperSceneBreak } from "./PaperHelpers";

export function OverviewGlossary({
	header,
	sub,
	rows,
	columns,
}: {
	header: string;
	sub: string;
	rows: Array<{
		category: string;
		products: string;
		why: string;
		example?: string;
		signals?: string[];
		pitfalls?: string[];
	}>;
	columns: {
		category: string;
		products: string;
		why: string;
		inPractice?: string;
		signals?: string;
		pitfalls?: string;
	};
}) {
	return (
		<OverviewSection header={header} sub={sub}>
			<article className="mx-auto max-w-3xl space-y-16 py-4">
				{rows.map((r, i) => (
					<section key={r.category} className="space-y-7">
						<header className="space-y-3">
							<div className="flex items-center gap-3">
								<span className="font-mono text-xs text-muted-foreground/70 tabular-nums tracking-wider">
									§ {String(i + 1).padStart(2, "0")}
								</span>
								<Separator orientation="vertical" className="h-3.5" />
								<span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70 font-semibold">
									{columns.category}
								</span>
							</div>
							<h3 className="font-heading text-3xl font-semibold tracking-tight leading-tight">
								{r.category}
							</h3>
						</header>

						<p className="text-[15px] leading-[1.9] text-foreground/90">
							{r.why}
						</p>

						<dl className="border-l-2 border-border pl-6 py-1 space-y-1.5">
							<dt className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-semibold">
								{columns.products}
							</dt>
							<dd className="text-[15px] leading-[1.8] text-muted-foreground">
								{r.products}
							</dd>
						</dl>

						{(r.example ||
							(r.signals && r.signals.length > 0) ||
							(r.pitfalls && r.pitfalls.length > 0)) && (
							<Card className="bg-muted/30 shadow-none">
								<CardContent className="space-y-6">
									{r.example && (
										<div className="space-y-2">
											<div className="text-[10px] uppercase tracking-[0.22em] text-primary/90 font-semibold">
												{columns.inPractice ?? "In practice"}
											</div>
											<p className="text-[15px] leading-[1.9] italic text-foreground/85">
												{r.example}
											</p>
										</div>
									)}

									{r.signals && r.signals.length > 0 && (
										<PaperBulletList
											label={columns.signals ?? "When to reach for it"}
											tone="emerald"
											items={r.signals}
										/>
									)}

									{r.pitfalls && r.pitfalls.length > 0 && (
										<PaperBulletList
											label={columns.pitfalls ?? "Common mistakes"}
											tone="amber"
											items={r.pitfalls}
										/>
									)}
								</CardContent>
							</Card>
						)}

						{i < rows.length - 1 && <PaperSceneBreak />}
					</section>
				))}
			</article>
		</OverviewSection>
	);
}
