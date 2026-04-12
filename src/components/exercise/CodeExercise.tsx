// Code exercise — javac + JUnit via the runner router. Monaco editor
// (lazy-loaded) + Button + Card.

import { useState } from "react";
import { CheckIcon, XIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@server/routers/_app";
import { CodeEditor } from "@/components/CodeEditor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { bilingual } from "@/lib/i18n";
import { trpc } from "@/lib/trpc";

type ExerciseOutput = inferRouterOutputs<AppRouter>["exercises"]["get"];
type Code = Extract<ExerciseOutput, { type: "code" }>;

export function CodeExercise({ exercise }: { exercise: Code }) {
  const { t } = useTranslation();
  const [code, setCode] = useState(exercise.starterCode);
  const runJava = trpc.runner.runJava.useMutation();
  const data = runJava.data;

  return (
    <div className="space-y-5">
      <p className="text-foreground leading-relaxed whitespace-pre-wrap">
        {bilingual(exercise.statement)}
      </p>

      <div className="space-y-2">
        <Label>{t("code.label")}</Label>
        <CodeEditor value={code} onChange={setCode} height={320} />
      </div>

      <Button
        onClick={() => runJava.mutate({ studentCode: code, testCode: exercise.testCode })}
        disabled={runJava.isPending}
      >
        {runJava.isPending ? t("code.running") : t("code.run")}
      </Button>

      {data && (
        <Card>
          <CardContent className="p-4 space-y-3">
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
                {data.testResults.map((t, i) => (
                  <li
                    key={`${t.name}-${i}`}
                    className="text-xs flex items-start gap-2 text-foreground"
                  >
                    {t.status === "passed" ? (
                      <CheckIcon className="size-3.5 text-chart-2 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XIcon className="size-3.5 text-destructive flex-shrink-0 mt-0.5" />
                    )}
                    <span className="flex-1">
                      <code className="font-mono">{t.displayName || t.name}</code>
                      {t.message && (
                        <div className="text-destructive mt-0.5">{t.message}</div>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
