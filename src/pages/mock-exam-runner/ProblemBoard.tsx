import { CodeProblemLayout } from "@/components/problem/CodeProblemLayout";
import { Badge } from "@/components/ui/badge";
import type { ExamProblem, RunResult } from "./types";

export function ProblemBoard({
	problem,
	code,
	onCodeChange,
	onReset,
	onRun,
	running,
	result,
}: {
	problem: ExamProblem;
	code: string;
	onCodeChange: (v: string) => void;
	onReset: () => void;
	onRun: () => void;
	running: boolean;
	result: RunResult | null;
}) {
	return (
		<CodeProblemLayout
			title={problem.exercise.title}
			statement={problem.exercise.statement}
			difficulty={problem.exercise.difficulty}
			code={code}
			onCodeChange={onCodeChange}
			onRun={onRun}
			isRunning={running}
			onReset={onReset}
			result={result}
			solution={
				(
					problem.exercise as {
						solution?: {
							code: string;
							explanation?: { en: string; es?: string | null };
							complexity?: { en: string; es?: string | null };
						};
					}
				).solution
			}
			rightSlot={
				<Badge variant="outline" className="text-xs">
					{problem.weight} pts
				</Badge>
			}
		/>
	);
}
