import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ExamData } from "./types";

export function FinalSummary({
	exam,
	completedRounds,
	elapsedSec,
}: {
	exam: ExamData;
	completedRounds: Set<number>;
	elapsedSec: number;
}) {
	const hh = Math.floor(elapsedSec / 3600);
	const mm = Math.floor((elapsedSec % 3600) / 60);
	const completedCount = completedRounds.size;
	const totalRounds = exam.rounds.length;

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-xl font-heading">
					Power Day complete
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="flex items-baseline gap-3">
					<span className="text-5xl font-bold font-heading tabular-nums">
						{completedCount}
					</span>
					<span className="text-2xl text-muted-foreground">/ {totalRounds}</span>
					<span className="text-sm text-muted-foreground ml-2">
						rounds marked complete
					</span>
					<span className="text-sm text-muted-foreground ml-auto tabular-nums font-mono">
						{hh}h {mm}m elapsed
					</span>
				</div>

				<ul className="divide-y divide-border">
					{exam.rounds.map((r, i) => {
						const done = completedRounds.has(i);
						return (
							<li
								key={r.exercise.id}
								className="flex items-center justify-between py-3 gap-3"
							>
								<div className="flex items-center gap-3 min-w-0">
									<span
										className={`text-sm font-mono ${done ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}
									>
										{done ? "✓" : "—"}
									</span>
									<div className="min-w-0">
										<div className="text-sm font-medium truncate">
											Round {i + 1}: {r.name}
										</div>
										<div className="text-xs text-muted-foreground">
											{r.exercise.type} · {r.exercise.section}
										</div>
									</div>
								</div>
								<div className="text-xs tabular-nums font-mono text-muted-foreground">
									{done ? "complete" : "not attempted"}
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
