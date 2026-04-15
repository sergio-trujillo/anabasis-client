import { ClockIcon, FlagIcon, TimerIcon } from "lucide-react";
import { Fade } from "@/components/animate-ui/primitives/effects/fade";
import { GradientText } from "@/components/animate-ui/primitives/texts/gradient";
import { Button } from "@/components/ui/button";

export function ExamHeader({
	remainingSec,
	locked,
	onFinish,
}: {
	remainingSec: number;
	locked: boolean;
	onFinish: () => void;
}) {
	const mm = String(Math.floor(remainingSec / 60)).padStart(2, "0");
	const ss = String(remainingSec % 60).padStart(2, "0");
	const urgent = remainingSec > 0 && remainingSec < 5 * 60;
	const timedOut = remainingSec === 0;

	return (
		<Fade>
			<header className="flex items-center justify-between gap-4">
				<div className="flex items-center gap-3 min-w-0">
					<span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-border">
						<TimerIcon className="size-5" />
					</span>
					<div className="min-w-0">
						<h1 className="text-xl font-bold font-heading tracking-tight truncate">
							<GradientText
								text="Mock GCA"
								gradient="linear-gradient(90deg, var(--primary) 0%, var(--chart-2) 50%, var(--primary) 100%)"
							/>
						</h1>
						<p className="text-xs text-muted-foreground mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
							<span>CodeSignal-style assessment</span>
							<span className="text-border">·</span>
							<span>4 problems · 70 min</span>
							<span className="text-border">·</span>
							<span className="font-mono">100 / 200 / 300 / 400 pts</span>
						</p>
					</div>
				</div>
				<div className="flex items-center gap-3 shrink-0">
					<div
						className={`flex items-center gap-2 rounded-md px-3 py-2 font-mono text-lg tabular-nums ring-1 ring-inset transition-colors ${
							timedOut
								? "bg-destructive/10 text-destructive ring-destructive/20"
								: urgent
									? "bg-amber-500/10 text-amber-600 ring-amber-500/20 dark:text-amber-400 animate-pulse"
									: "bg-muted text-foreground ring-border"
						}`}
					>
						<ClockIcon className="size-4" />
						{mm}:{ss}
					</div>
					<Button variant="destructive" onClick={onFinish} disabled={locked}>
						<FlagIcon className="size-4" />
						Finish
					</Button>
				</div>
			</header>
		</Fade>
	);
}
