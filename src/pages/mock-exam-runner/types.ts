export type RunResult = {
	success: boolean;
	passedTests: number;
	failedTests: number;
	totalTests: number;
	timeMs: number;
	compilationError?: string;
	testResults: {
		name: string;
		displayName?: string;
		status: string;
		message?: string;
	}[];
};

// tRPC type inference is temporarily degraded while legacy Praxema pages
// still reference incompatible types on the AppRouter. Define the shapes
// explicitly until Fase 6 removes those files.
export type CodeExerciseShape = {
	id: string;
	type: "code";
	section: string;
	title: { en: string; es?: string | null };
	difficulty: string;
	language: string;
	statement: { en: string; es?: string | null };
	starterCode: string;
	testCode: string;
};

export type ExamProblem = {
	position: number;
	weight: number;
	targetDifficulty: string;
	exercise: CodeExerciseShape;
};

export type ExamData = {
	examId: string;
	companySlug: string;
	durationSeconds: number;
	problems: ExamProblem[];
	startedAt: string;
};
