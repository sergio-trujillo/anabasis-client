import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FinalSummary } from "./FinalSummary";
import { Header } from "./Header";
import { RoundBody, RoundHeader } from "./RoundContent";
import { RoundStrip } from "./RoundStrip";
import type { ExamData } from "./types";

export function Runner({ exam }: { exam: ExamData }) {
	const [activeRound, setActiveRound] = useState(0);
	const [completedRounds, setCompletedRounds] = useState<Set<number>>(
		new Set(),
	);
	const [finished, setFinished] = useState(false);
	const [now, setNow] = useState(() => Date.now());

	const totalSeconds = exam.roundDurationSeconds * exam.rounds.length;
	const startMs = useRef(new Date(exam.startedAt).getTime());

	useEffect(() => {
		const id = setInterval(() => setNow(Date.now()), 1000);
		return () => clearInterval(id);
	}, []);

	const elapsedSec = Math.max(0, Math.floor((now - startMs.current) / 1000));
	const remainingSec = Math.max(0, totalSeconds - elapsedSec);
	const timedOut = remainingSec === 0;
	const locked = finished || timedOut;

	const active = exam.rounds[activeRound];

	function markCompleteAndAdvance() {
		setCompletedRounds((prev) => new Set(prev).add(activeRound));
		if (activeRound < exam.rounds.length - 1) {
			setActiveRound(activeRound + 1);
		}
	}

	return (
		<div className="flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden">
			<div className="shrink-0 border-b bg-background/80 backdrop-blur">
				<div className="w-full space-y-3 p-2">
					<Header
						remainingSec={remainingSec}
						totalSeconds={totalSeconds}
						locked={locked}
						onFinish={() => setFinished(true)}
					/>
					<RoundStrip
						rounds={exam.rounds}
						completedRounds={completedRounds}
						activeRound={activeRound}
						onSelect={(n) => !locked && setActiveRound(n)}
						locked={locked}
					/>
				</div>
			</div>

			<div className="min-h-0 flex-1 overflow-y-auto">
				{locked ? (
					<div className="w-full p-2">
						<FinalSummary
							exam={exam}
							completedRounds={completedRounds}
							elapsedSec={elapsedSec}
						/>
					</div>
				) : (
					<div className="w-full p-2 space-y-4">
						<RoundHeader round={active} />
						<RoundBody round={active} />
						<div className="flex justify-end gap-2">
							<Button
								variant="outline"
								onClick={markCompleteAndAdvance}
								disabled={activeRound >= exam.rounds.length - 1}
							>
								Mark complete → next round
							</Button>
							{activeRound === exam.rounds.length - 1 && (
								<Button
									onClick={() => {
										setCompletedRounds((prev) =>
											new Set(prev).add(activeRound),
										);
										setFinished(true);
									}}
								>
									Finish Power Day
								</Button>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
