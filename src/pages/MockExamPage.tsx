// Mock GCA exam page — 70-minute timed shuffle of 4 code problems
// weighted 100 / 200 / 300 / 400 (Capital One's CodeSignal GCA format).
//
// State model:
//   - Server picks the 4 problems on mount via mock.buildExam.
//   - Client maintains per-slot code + run result; no server-side session.
//   - Timer is client-only (reload = reset, acceptable for v1 per OD-5).
//   - When timer hits 0 OR user clicks "Finish", lock inputs + reveal score.
//
// Scoring: per-problem, credit = weight if all tests passed, else 0. Partial
// credit is real GCA behavior but deferred — v1 ships all-or-nothing per
// problem. Final score = sum of awarded weights (max 1000).

import { ClockIcon, FlagIcon, RotateCcwIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { bilingual } from "@/lib/i18n";
import { trpc } from "@/lib/trpc";

type RunResult = {
  success: boolean;
  passedTests: number;
  failedTests: number;
  totalTests: number;
  timeMs: number;
  compilationError?: string;
  testResults: { name: string; displayName?: string; status: string; message?: string }[];
};

export function MockExamPage() {
  const { companySlug = "capital-one" } = useParams();
  const examQuery = trpc.mock.buildExam.useQuery({ companySlug });

  if (examQuery.isPending) {
    return (
      <>
        <div className="px-6 py-6 max-w-7xl mx-auto space-y-4">
          <Skeleton className="h-12 w-80" />
          <Skeleton className="h-96 rounded-lg" />
        </div>
      </>
    );
  }

  const data = examQuery.data as ExamData | undefined;
  if (!data || data.problems.length === 0) {
    return (
      <>
        <div className="px-6 py-6 max-w-7xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No Mock GCA available for this company yet.
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return <ExamRunner exam={data} />;
}

// ─────────────────────────────────────────────────────────────────────────
// ExamRunner — remounted when a fresh exam is built, so timer + state reset
// cleanly on "Start over".
// ─────────────────────────────────────────────────────────────────────────

// tRPC type inference is temporarily degraded while legacy Praxema pages
// still reference incompatible types on the AppRouter. Define the shapes
// explicitly until Fase 6 removes those files.
type CodeExerciseShape = {
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

type ExamProblem = {
  position: number;
  weight: number;
  targetDifficulty: string;
  exercise: CodeExerciseShape;
};

type ExamData = {
  examId: string;
  companySlug: string;
  durationSeconds: number;
  problems: ExamProblem[];
  startedAt: string;
};

function ExamRunner({ exam }: { exam: ExamData }) {
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

  // Timer tick — one interval, we derive remaining from startedAt.
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
    <>
      <div className="px-6 py-6 max-w-7xl mx-auto w-full space-y-4">
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

        {locked ? (
          <FinalScore exam={exam} results={results} score={score} />
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
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Header — running timer + finish button
// ─────────────────────────────────────────────────────────────────────────

function ExamHeader({
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
    <header className="flex items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold font-heading">Mock GCA</h1>
        <p className="text-sm text-muted-foreground mt-1">
          4 problems · 70 minutes · weights 100/200/300/400
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div
          className={`flex items-center gap-2 rounded-md px-3 py-2 font-mono text-lg tabular-nums ${
            timedOut
              ? "bg-destructive/10 text-destructive"
              : urgent
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                : "bg-muted text-foreground"
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
  );
}

// ─────────────────────────────────────────────────────────────────────────
// SlotStrip — 4 problem tabs with pass/fail indicators
// ─────────────────────────────────────────────────────────────────────────

function SlotStrip({
  problems,
  results,
  activeSlot,
  onSelect,
  locked,
}: {
  problems: ExamProblem[];
  results: (RunResult | null)[];
  activeSlot: number;
  onSelect: (n: number) => void;
  locked: boolean;
}) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {problems.map((p, i) => {
        const r = results[i];
        const passed = r?.success && r.failedTests === 0 && r.passedTests > 0;
        const attempted = !!r;
        const isActive = i === activeSlot;
        return (
          <button
            key={p.exercise.id}
            type="button"
            onClick={() => onSelect(i)}
            disabled={locked && !isActive}
            className={`rounded-md border px-3 py-2 text-left transition ${
              isActive
                ? "border-primary bg-primary/5"
                : "border-border hover:bg-muted"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                Problem {i + 1}
              </span>
              <Badge variant="outline" className="text-xs">
                {p.weight}
              </Badge>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-sm font-medium truncate flex-1">
                {bilingual(p.exercise.title)}
              </span>
              {attempted && (
                <span
                  className={`text-xs ${passed ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}`}
                >
                  {passed ? "✓" : "✗"}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// ProblemBoard — 3-panel layout (statement / editor / results)
// ─────────────────────────────────────────────────────────────────────────

function ProblemBoard({
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="lg:row-span-2 min-h-[300px]">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base font-heading">
              {bilingual(problem.exercise.title)}
            </CardTitle>
            <Badge variant="outline">{problem.exercise.difficulty}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
            {bilingual(problem.exercise.statement)}
          </p>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between gap-2 pb-3">
          <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-normal">
            Solution.java
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            disabled={code === problem.exercise.starterCode}
          >
            <RotateCcwIcon className="size-3.5" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-[320px] rounded-md overflow-hidden border">
            <CodeEditor value={code} onChange={onCodeChange} />
          </div>
          <div className="flex justify-end mt-3">
            <Button onClick={onRun} disabled={running}>
              {running ? "Running…" : "Run tests"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-normal">
            Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {!result && !running && (
            <p className="text-sm text-muted-foreground">
              Run your solution to see test results.
            </p>
          )}
          {result && (
            <>
              <div className="flex items-center gap-3">
                <Badge variant={result.success ? "default" : "destructive"}>
                  {result.success ? "PASS" : "FAIL"}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {result.passedTests}/{result.totalTests} tests · {result.timeMs}ms
                </span>
              </div>
              {result.compilationError && (
                <pre className="text-xs text-destructive whitespace-pre-wrap bg-muted rounded p-3 overflow-x-auto font-mono">
                  {result.compilationError}
                </pre>
              )}
              {result.testResults.length > 0 && (
                <ul className="space-y-1">
                  {result.testResults.map((r, i) => (
                    <li key={`${r.name}-${i}`} className="text-xs flex items-start gap-2">
                      <span className="font-mono">
                        {r.status === "passed" ? "✓" : "✗"}
                      </span>
                      <span className="flex-1">
                        <code className="font-mono">{r.displayName || r.name}</code>
                        {r.message && (
                          <div className="text-destructive mt-0.5">{r.message}</div>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// FinalScore — shown when finished or timed out
// ─────────────────────────────────────────────────────────────────────────

function FinalScore({
  exam,
  results,
  score,
}: {
  exam: ExamData;
  results: (RunResult | null)[];
  score: number;
}) {
  const maxScore = exam.problems.reduce((s, p) => s + p.weight, 0);
  const pct = maxScore === 0 ? 0 : Math.round((score / maxScore) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-heading">Exam complete</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-baseline gap-3">
          <span className="text-5xl font-bold font-heading tabular-nums">{score}</span>
          <span className="text-2xl text-muted-foreground">/ {maxScore}</span>
          <span className="text-sm text-muted-foreground ml-2">({pct}%)</span>
        </div>

        <ul className="divide-y divide-border">
          {exam.problems.map((p, i) => {
            const r = results[i];
            const passed = r?.success && r.failedTests === 0 && r.passedTests > 0;
            const awarded = passed ? p.weight : 0;
            return (
              <li key={p.exercise.id} className="flex items-center justify-between py-3 gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`text-sm font-mono ${passed ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}`}
                  >
                    {passed ? "✓" : r ? "✗" : "—"}
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">
                      Problem {i + 1}: {bilingual(p.exercise.title)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {p.exercise.difficulty} · {r ? `${r.passedTests}/${r.totalTests} tests` : "not attempted"}
                    </div>
                  </div>
                </div>
                <div className="text-sm tabular-nums font-mono">
                  {awarded} / {p.weight}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="flex gap-2">
          <Button onClick={() => window.location.reload()}>Start over</Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            Back
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
