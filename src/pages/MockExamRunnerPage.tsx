// Mock GCA exam page — 70-minute timed shuffle of 4 code problems
// weighted 100 / 200 / 300 / 400 (Capital One's CodeSignal GCA format).
//
// State model:
//   - Server picks the 4 problems on mount via mock.buildExam.
//   - Client maintains per-slot code + run result; no server-side session.
//   - Timer is client-only (reload = reset, acceptable for v1 per OD-5).
//   - When timer hits 0 OR user clicks "Finish", lock inputs + reveal score.

import { useParams } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";
import { ExamRunner } from "./mock-exam-runner/Runner";
import type { ExamData } from "./mock-exam-runner/types";

export function MockExamRunnerPage() {
	const { companySlug = "capital-one" } = useParams();
	const examQuery = trpc.mock.buildExam.useQuery({ companySlug });

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
	if (!data || data.problems.length === 0) {
		return (
			<div className="flex-1 overflow-y-auto">
				<div className="p-2 w-full">
					<Card>
						<CardContent className="p-8 text-center text-muted-foreground">
							No Mock GCA available for this company yet.
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	return <ExamRunner exam={data} />;
}
