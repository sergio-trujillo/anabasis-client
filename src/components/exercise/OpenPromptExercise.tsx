// Open-prompt exercise — LLM rubric judge. Uses shadcn Card + Textarea + Button.

import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@server/routers/_app";
import { Reasoning } from "@/components/chat/Reasoning";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { bilingual } from "@/lib/i18n";
import { trpc } from "@/lib/trpc";

type ExerciseOutput = inferRouterOutputs<AppRouter>["exercises"]["get"];
type OpenPrompt = Extract<ExerciseOutput, { type: "open-prompt" }>;

export function OpenPromptExercise({ exercise }: { exercise: OpenPrompt }) {
  const { t } = useTranslation();
  const [answer, setAnswer] = useState("");
  const judge = trpc.judge.judgeOpenPrompt.useMutation();
  const questionText = bilingual(exercise.question);

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-normal">
            {t("openPrompt.question")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed">{questionText}</p>
        </CardContent>
      </Card>

      <Textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder={t("openPrompt.placeholder")}
        className="min-h-[200px]"
      />

      <Button
        onClick={() =>
          judge.mutate({
            question: questionText,
            answer,
            rubric: exercise.rubric,
          })
        }
        disabled={answer.trim().length < 20 || judge.isPending}
      >
        {judge.isPending ? t("openPrompt.evaluating") : t("openPrompt.submit")}
      </Button>

      {judge.error && <p className="text-destructive text-sm">{judge.error.message}</p>}

      {judge.data && (
        <Reasoning
          score={judge.data.score}
          title={judge.data.passed ? t("openPrompt.strongAnswer") : t("openPrompt.roomToTighten")}
        >
          <p className="italic text-muted-foreground">{judge.data.reasoning}</p>

          {judge.data.hits.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wider text-chart-2 mb-1">
                {t("openPrompt.hits")}
              </p>
              <ul className="list-disc list-inside text-sm">
                {judge.data.hits.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
          )}

          {judge.data.misses.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wider text-chart-3 mb-1">
                {t("openPrompt.misses")}
              </p>
              <ul className="list-disc list-inside text-sm">
                {judge.data.misses.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </div>
          )}

          {judge.data.warnings.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wider text-destructive mb-1">
                {t("openPrompt.warnings")}
              </p>
              <ul className="list-disc list-inside text-sm">
                {judge.data.warnings.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </div>
          )}
        </Reasoning>
      )}
    </div>
  );
}
