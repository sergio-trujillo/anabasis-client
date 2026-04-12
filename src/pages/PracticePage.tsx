// Practice page — random code problem from the Capital One pool.
//
// Three-panel layout inspired by Praxema's problem page, adapted for
// interview-prep semantics:
//   - Left  : problem statement (bilingual)
//   - Center: Monaco editor (lazy-loaded via CodeEditor wrapper)
//   - Right : JUnit test results + output
//
// "Next problem" button shuffles to another random code exercise.
// F2 minimum: pool = all `code`-type exercises returned by exercises.list.
// F3 grows the pool to 80+ without touching this component.

import { RotateCcwIcon, ShuffleIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@server/routers/_app";
import { CodeEditor } from "@/components/CodeEditor";
import { AppLayout } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { bilingual } from "@/lib/i18n";
import { trpc } from "@/lib/trpc";

type ExerciseListItem = inferRouterOutputs<AppRouter>["exercises"]["list"][number];
type Code = Extract<ExerciseListItem, { type: "code" }>;

function pickRandom<T>(arr: T[], notId?: string): T | undefined {
  if (arr.length === 0) return undefined;
  const pool = notId && arr.length > 1 ? arr.filter((x) => (x as { id?: string }).id !== notId) : arr;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function PracticePage() {
  const { t } = useTranslation();
  const exercisesQuery = trpc.exercises.list.useQuery();

  // Filter to code problems, pick a random one.
  const [currentId, setCurrentId] = useState<string | null>(null);
  const codePool: Code[] =
    exercisesQuery.data?.filter((ex): ex is Code => ex.type === "code") ?? [];

  const current = currentId
    ? codePool.find((ex) => ex.id === currentId)
    : pickRandom(codePool);

  // Seed currentId on first data arrival so refresh keeps the same problem
  // until the user clicks "next".
  if (!currentId && current) {
    setCurrentId(current.id);
  }

  return (
    <AppLayout>
      <div className="px-6 py-6 max-w-7xl mx-auto w-full space-y-6">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-heading">{t("practice.title")}</h1>
            <p className="text-sm text-muted-foreground mt-1">{t("practice.subtitle")}</p>
          </div>
          <Button
            variant="secondary"
            onClick={() => {
              const next = pickRandom(codePool, currentId ?? undefined);
              if (next) setCurrentId(next.id);
            }}
            disabled={codePool.length <= 1}
          >
            <ShuffleIcon className="size-4" />
            {t("practice.nextProblem")}
          </Button>
        </header>

        {exercisesQuery.isPending && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Skeleton className="h-96 rounded-lg" />
            <Skeleton className="h-96 rounded-lg" />
          </div>
        )}

        {exercisesQuery.data && codePool.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              {t("practice.emptyPool")}
            </CardContent>
          </Card>
        )}

        {current && <PracticeBoard exercise={current} />}
      </div>
    </AppLayout>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Three-panel board — resets local state whenever the exercise id changes
// (keyed in parent via `key={current.id}` below).
// ─────────────────────────────────────────────────────────────────────────

function PracticeBoard({ exercise }: { exercise: Code }) {
  // Remount-on-change keeps the editor state scoped to the active problem.
  return <Board key={exercise.id} exercise={exercise} />;
}

function Board({ exercise }: { exercise: Code }) {
  const { t } = useTranslation();
  const [code, setCode] = useState(exercise.starterCode);
  const runJava = trpc.runner.runJava.useMutation();
  const data = runJava.data;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* ── Left: statement ── */}
      <Card className="lg:row-span-2 min-h-[300px]">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base font-heading">{bilingual(exercise.title)}</CardTitle>
            <Badge variant="outline">{exercise.difficulty}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
            {bilingual(exercise.statement)}
          </p>
        </CardContent>
      </Card>

      {/* ── Center: editor ── */}
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between gap-2 pb-3">
          <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-normal">
            {t("practice.editorLabel")} · Solution.java
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCode(exercise.starterCode)}
            disabled={code === exercise.starterCode}
            title={t("practice.resetCode")}
          >
            <RotateCcwIcon className="size-3.5" />
          </Button>
        </CardHeader>
        <CardContent>
          <CodeEditor value={code} onChange={setCode} height={320} />
          <div className="flex justify-end mt-3">
            <Button
              onClick={() =>
                runJava.mutate({ studentCode: code, testCode: exercise.testCode })
              }
              disabled={runJava.isPending}
            >
              {runJava.isPending ? t("code.running") : t("code.run")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Right: results ── */}
      <Card className="lg:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-normal">
            {t("practice.resultsLabel")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {!data && !runJava.isPending && (
            <p className="text-sm text-muted-foreground">{t("practice.noResultsYet")}</p>
          )}

          {data && (
            <>
              <div className="flex items-center gap-3">
                <Badge variant={data.success ? "default" : "destructive"}>
                  {data.success ? t("code.pass") : t("code.fail")}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {t("code.testsSummary", {
                    passed: data.passedTests,
                    total: data.totalTests,
                    ms: data.timeMs,
                  })}
                </span>
              </div>

              {data.compilationError && (
                <pre className="text-xs text-destructive whitespace-pre-wrap bg-muted rounded p-3 overflow-x-auto font-mono">
                  {data.compilationError}
                </pre>
              )}

              {data.testResults.length > 0 && (
                <ul className="space-y-1">
                  {data.testResults.map((r, i) => (
                    <li
                      key={`${r.name}-${i}`}
                      className="text-xs flex items-start gap-2 text-foreground"
                    >
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
