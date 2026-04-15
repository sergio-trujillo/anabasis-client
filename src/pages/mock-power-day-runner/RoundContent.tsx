import { CodeExercise } from "@/components/exercise/CodeExercise";
import { InterviewerChatExercise } from "@/components/exercise/InterviewerChatExercise";
import { OpenPromptExercise } from "@/components/exercise/OpenPromptExercise";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Round } from "./types";

export function RoundHeader({ round }: { round: Round }) {
	return (
		<div className="flex items-center justify-between">
			<div>
				<h2 className="text-xl font-bold font-heading">{round.name}</h2>
				<p className="text-sm text-muted-foreground mt-0.5">
					Round {round.position + 1} · {round.exercise.type}
				</p>
			</div>
			<Badge variant="outline">{round.exercise.type}</Badge>
		</div>
	);
}

export function RoundBody({ round }: { round: Round }) {
	const ex = round.exercise;
	// The concrete exercise components type their props via
	// inferRouterOutputs<AppRouter>["exercises"]["get"] which is currently
	// degraded. Cast through unknown to the component's local expectation;
	// runtime shape matches the server's AnyExercise by contract.
	if (ex.type === "code") {
		return (
			<CodeExercise
				exercise={
					ex as unknown as Parameters<typeof CodeExercise>[0]["exercise"]
				}
			/>
		);
	}
	if (ex.type === "open-prompt") {
		return (
			<OpenPromptExercise
				exercise={
					ex as unknown as Parameters<typeof OpenPromptExercise>[0]["exercise"]
				}
			/>
		);
	}
	if (ex.type === "interviewer-chat") {
		return (
			<InterviewerChatExercise
				exercise={
					ex as unknown as Parameters<
						typeof InterviewerChatExercise
					>[0]["exercise"]
				}
			/>
		);
	}
	return (
		<Card>
			<CardContent className="p-6 text-muted-foreground text-sm">
				Unsupported round type.
			</CardContent>
		</Card>
	);
}
