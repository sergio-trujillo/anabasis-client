import { MagicCard } from "@/components/ui/magic-card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { OverviewSection } from "./OverviewSection";

export function OverviewTimeline({
	header,
	items,
}: {
	header: string;
	items: Array<{ time: string; label: string; note: string }>;
}) {
	// Derive minute spans from "HH:MM – HH:MM" strings so we can render
	// proportional Progress bars.
	const parsed = items.map((it) => {
		const m = it.time.match(/(\d+):(\d+)\s*[–-]\s*(\d+):(\d+)/);
		if (!m) return { ...it, minutes: 0 };
		const start = parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
		const end = parseInt(m[3], 10) * 60 + parseInt(m[4], 10);
		return { ...it, minutes: end - start };
	});
	const maxMinutes = Math.max(...parsed.map((p) => p.minutes), 1);
	return (
		<OverviewSection header={header}>
			<MagicCard className="p-5">
				<ol className="space-y-3">
					{parsed.map((it, i) => {
						const isBreak =
							it.label.toLowerCase().includes("break") ||
							it.label.toLowerCase().includes("descanso");
						const pct = (it.minutes / maxMinutes) * 100;
						return (
							<li
								key={i}
								className="grid grid-cols-[110px_1fr_60px] gap-3 items-center"
							>
								<span className="font-mono text-xs text-muted-foreground tabular-nums">
									{it.time}
								</span>
								<div className="space-y-1 min-w-0">
									<div className="flex items-center gap-2 text-sm">
										<span
											className={cn(
												"inline-block size-1.5 rounded-full shrink-0",
												isBreak ? "bg-muted-foreground/40" : "bg-primary",
											)}
										/>
										<span
											className={cn(
												"font-medium truncate",
												isBreak && "text-muted-foreground",
											)}
										>
											{it.label}
										</span>
										<span className="text-xs text-muted-foreground truncate">
											· {it.note}
										</span>
									</div>
									<Progress
										value={pct}
										className={cn("h-1.5", isBreak && "opacity-40")}
									/>
								</div>
								<span className="font-mono text-[10px] text-muted-foreground/70 tabular-nums text-right">
									{it.minutes} min
								</span>
							</li>
						);
					})}
				</ol>
			</MagicCard>
		</OverviewSection>
	);
}
