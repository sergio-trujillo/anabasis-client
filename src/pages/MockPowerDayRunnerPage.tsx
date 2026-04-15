// Mock Power Day — 4-round simulated Capital One virtual onsite.
//
// Delegates each round to the existing per-type exercise component so we
// get LLM chat, rubric judge, and javac/JUnit for free:
//   round 0 (coding 1)                 → CodeExercise
//   round 1 (coding 2 / job fit)       → CodeExercise
//   round 2 (behavioral / sys design)  → OpenPromptExercise OR InterviewerChatExercise
//   round 3 (business case)            → InterviewerChatExercise OR OpenPromptExercise
//
// Single global 3-hour countdown (4 rounds × 45 min nominal) — no per-round
// gating in v1. Timer informs but doesn't block; the user can finish early.
// Reload resets (OD-5 — no persistence in v1).

import { useParams } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";
import { Runner } from "./mock-power-day-runner/Runner";
import type { ExamData } from "./mock-power-day-runner/types";

export function MockPowerDayRunnerPage() {
	const { companySlug = "capital-one" } = useParams();
	const examQuery = trpc.mock.buildPowerDay.useQuery({ companySlug });

	if (examQuery.isPending) {
		return (
			<div className="flex-1 overflow-y-auto">
				<div className="p-2 w-full space-y-4">
					<Skeleton className="h-12 w-80" />
					<Skeleton className="h-96 rounded-lg" />
				</div>
			</div>
		);
	}

	const data = examQuery.data as ExamData | undefined;
	if (!data || data.rounds.length === 0) {
		return (
			<div className="flex-1 overflow-y-auto">
				<div className="p-2 w-full">
					<Card>
						<CardContent className="p-8 text-center text-muted-foreground">
							No Mock Power Day available for this company yet.
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	return <Runner key={data.examId} exam={data} />;
}
