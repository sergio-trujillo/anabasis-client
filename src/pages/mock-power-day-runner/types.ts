// tRPC type inference is temporarily degraded while legacy Praxema pages
// remain in-tree. Define the round/exam shapes explicitly — they mirror
// mock.buildPowerDay's server-side contract.
export type AnyExerciseShape =
	| {
			id: string;
			type: "code";
			section: string;
			title: { en: string; es?: string | null };
			difficulty: string;
			language: string;
			statement: { en: string; es?: string | null };
			starterCode: string;
			testCode: string;
	  }
	| {
			id: string;
			type: "mcq";
			section: string;
			title: { en: string; es?: string | null };
			prompt: { en: string; es?: string | null };
			options: Array<{
				id: string;
				label: { en: string; es?: string | null };
			}>;
			correctOptionId: string;
			explanation: { en: string; es?: string | null };
	  }
	| {
			id: string;
			type: "open-prompt";
			section: string;
			title: { en: string; es?: string | null };
			question: { en: string; es?: string | null };
			rubric: {
				must_include: string[];
				must_avoid: string[];
				value_alignment?: string;
				min_words?: number;
			};
	  }
	| {
			id: string;
			type: "interviewer-chat";
			section: string;
			title: { en: string; es?: string | null };
			topic: string;
			persona: string;
			must_explore: string[];
			opening_message: string;
			max_turns: number;
	  };

export type Round = {
	position: number;
	name: string;
	kind: "coding" | "behavioral-or-sysdesign" | "business-case";
	exercise: AnyExerciseShape;
};

export type ExamData = {
	examId: string;
	companySlug: string;
	roundDurationSeconds: number;
	rounds: Round[];
	startedAt: string;
};
