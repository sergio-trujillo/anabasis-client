import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { bilingual } from "@/lib/i18n";
import type { ExamData, RunResult } from "./types";

export function FinalScore({
	exam,
	results,
	score,
}: {
	exam: ExamData;
	results: (RunResult | null)[];
	score: number;
}) {
	const maxScore = exam.problems.reduce((s, p) => s + p.weight, 0);
	const pct = maxScore === 0 ? 0 : Math.round((score / maxScore) * 100);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-xl font-heading">Exam complete</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="flex items-baseline gap-3">
					<span className="text-5xl font-bold font-heading tabular-nums">
						{score}
					</span>
					<span className="text-2xl text-muted-foreground">/ {maxScore}</span>
					<span className="text-sm text-muted-foreground ml-2">({pct}%)</span>
				</div>

				<ul className="divide-y divide-border">
					{exam.problems.map((p, i) => {
						const r = results[i];
						const passed =
							r?.success && r.failedTests === 0 && r.passedTests > 0;
						const awarded = passed ? p.weight : 0;
						return (
							<li
								key={p.exercise.id}
								className="flex items-center justify-between py-3 gap-3"
							>
								<div className="flex items-center gap-3 min-w-0">
									<span
										className={`text-sm font-mono ${passed ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}`}
									>
										{passed ? "✓" : r ? "✗" : "—"}
									</span>
									<div className="min-w-0">
										<div className="text-sm font-medium truncate">
											Problem {i + 1}: {bilingual(p.exercise.title)}
										</div>
										<div className="text-xs text-muted-foreground">
											{p.exercise.difficulty} ·{" "}
											{r
												? `${r.passedTests}/${r.totalTests} tests`
												: "not attempted"}
										</div>
									</div>
								</div>
								<div className="text-sm tabular-nums font-mono">
									{awarded} / {p.weight}
								</div>
							</li>
						);
					})}
				</ul>

				<div className="flex gap-2">
					<Button onClick={() => window.location.reload()}>Start over</Button>
					<Button variant="outline" onClick={() => window.history.back()}>
						Back
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
