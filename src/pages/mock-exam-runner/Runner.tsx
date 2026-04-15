import { useEffect, useMemo, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";
import { ExamHeader } from "./ExamHeader";
import { FinalScore } from "./FinalScore";
import { ProblemBoard } from "./ProblemBoard";
import { SlotStrip } from "./SlotStrip";
import type { ExamData, RunResult } from "./types";

// Remount on fresh exam so timer + state reset cleanly on "Start over".
export function ExamRunner({ exam }: { exam: ExamData }) {
	return <Runner key={exam.examId} exam={exam} />;
}

function Runner({ exam }: { exam: ExamData }) {
	const [activeSlot, setActiveSlot] = useState(0);
	const [codes, setCodes] = useState<string[]>(() =>
		exam.problems.map((p) => p.exercise.starterCode),
	);
	const [results, setResults] = useState<(RunResult | null)[]>(() =>
		exam.problems.map(() => null),
	);
	const [finished, setFinished] = useState(false);
	const [now, setNow] = useState(() => Date.now());

	const startMs = useRef(new Date(exam.startedAt).getTime());
	useEffect(() => {
		const id = setInterval(() => setNow(Date.now()), 1000);
		return () => clearInterval(id);
	}, []);

	const elapsedSec = Math.max(0, Math.floor((now - startMs.current) / 1000));
	const remainingSec = Math.max(0, exam.durationSeconds - elapsedSec);
	const timedOut = remainingSec === 0;
	const locked = finished || timedOut;

	const runJava = trpc.runner.runJava.useMutation({
		onSuccess: (data) => {
			setResults((prev) => {
				const next = [...prev];
				next[activeSlot] = data as RunResult;
				return next;
			});
		},
	});

	const score = useMemo(() => {
		let total = 0;
		exam.problems.forEach((p, i) => {
			const r = results[i];
			if (r?.success && r.failedTests === 0 && r.passedTests > 0) {
				total += p.weight;
			}
		});
		return total;
	}, [exam.problems, results]);

	const active = exam.problems[activeSlot];

	return (
		<div className="flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden">
			<div className="shrink-0 border-b bg-background/80 backdrop-blur">
				<div className="w-full space-y-3 p-2">
					<ExamHeader
						remainingSec={remainingSec}
						locked={locked}
						onFinish={() => setFinished(true)}
					/>
					<SlotStrip
						problems={exam.problems}
						results={results}
						activeSlot={activeSlot}
						onSelect={setActiveSlot}
						locked={locked}
					/>
				</div>
			</div>

			<div className="min-h-0 flex-1">
				{locked ? (
					<div className="w-full p-2">
						<FinalScore exam={exam} results={results} score={score} />
					</div>
				) : (
					<ProblemBoard
						problem={active}
						code={codes[activeSlot]}
						onCodeChange={(v) =>
							setCodes((prev) => {
								const next = [...prev];
								next[activeSlot] = v;
								return next;
							})
						}
						onReset={() =>
							setCodes((prev) => {
								const next = [...prev];
								next[activeSlot] = active.exercise.starterCode;
								return next;
							})
						}
						onRun={() =>
							runJava.mutate({
								studentCode: codes[activeSlot],
								testCode: active.exercise.testCode,
							})
						}
						running={runJava.isPending}
						result={results[activeSlot]}
					/>
				)}
			</div>
		</div>
	);
}
