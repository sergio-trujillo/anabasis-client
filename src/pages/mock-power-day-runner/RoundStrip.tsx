import { Badge } from "@/components/ui/badge";
import type { Round } from "./types";

export function RoundStrip({
	rounds,
	completedRounds,
	activeRound,
	onSelect,
	locked,
}: {
	rounds: Round[];
	completedRounds: Set<number>;
	activeRound: number;
	onSelect: (n: number) => void;
	locked: boolean;
}) {
	const kindLabel = (k: Round["kind"]) =>
		k === "coding" ? "code" : k === "behavioral-or-sysdesign" ? "chat" : "case";

	return (
		<div className="grid grid-cols-4 gap-2">
			{rounds.map((r, i) => {
				const isActive = i === activeRound;
				const done = completedRounds.has(i);
				return (
					<button
						key={r.exercise.id}
						type="button"
						onClick={() => onSelect(i)}
						disabled={locked && !isActive}
						className={`rounded-md border px-3 py-2 text-left transition ${
							isActive
								? "border-primary bg-primary/5"
								: done
									? "border-emerald-500/30 bg-emerald-500/5"
									: "border-border hover:bg-muted"
						}`}
					>
						<div className="flex items-center justify-between gap-2">
							<span className="text-xs uppercase tracking-wider text-muted-foreground">
								Round {i + 1}
							</span>
							<Badge variant="outline" className="text-[10px] h-4 px-1.5">
								{kindLabel(r.kind)}
							</Badge>
						</div>
						<div className="mt-1 flex items-center gap-2">
							<span className="text-sm font-medium truncate flex-1">
								{r.name}
							</span>
							{done && (
								<span className="text-xs text-emerald-600 dark:text-emerald-400">
									✓
								</span>
							)}
						</div>
					</button>
				);
			})}
		</div>
	);
}
