import { Badge } from "@/components/ui/badge";
import { bilingual } from "@/lib/i18n";
import type { ExamProblem, RunResult } from "./types";

export function SlotStrip({
	problems,
	results,
	activeSlot,
	onSelect,
	locked,
}: {
	problems: ExamProblem[];
	results: (RunResult | null)[];
	activeSlot: number;
	onSelect: (n: number) => void;
	locked: boolean;
}) {
	return (
		<div className="grid grid-cols-4 gap-2">
			{problems.map((p, i) => {
				const r = results[i];
				const passed = r?.success && r.failedTests === 0 && r.passedTests > 0;
				const attempted = !!r;
				const isActive = i === activeSlot;
				return (
					<button
						key={p.exercise.id}
						type="button"
						onClick={() => onSelect(i)}
						disabled={locked && !isActive}
						className={`rounded-md border px-3 py-2 text-left transition ${
							isActive
								? "border-primary bg-primary/5"
								: "border-border hover:bg-muted"
						}`}
					>
						<div className="flex items-center justify-between gap-2">
							<span className="text-xs uppercase tracking-wider text-muted-foreground">
								Problem {i + 1}
							</span>
							<Badge variant="outline" className="text-xs">
								{p.weight}
							</Badge>
						</div>
						<div className="mt-1 flex items-center gap-2">
							<span className="text-sm font-medium truncate flex-1">
								{bilingual(p.exercise.title)}
							</span>
							{attempted && (
								<span
									className={`text-xs ${passed ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}`}
								>
									{passed ? "✓" : "✗"}
								</span>
							)}
						</div>
					</button>
				);
			})}
		</div>
	);
}
