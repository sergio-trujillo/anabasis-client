// Open-prompt exercise — LLM rubric judge. Uses shadcn Card + Textarea + Button.

import { useState } from "react";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@server/routers/_app";
import { Reasoning } from "@/components/chat/Reasoning";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";

type ExerciseOutput = inferRouterOutputs<AppRouter>["exercises"]["get"];
type OpenPrompt = Extract<ExerciseOutput, { type: "open-prompt" }>;

export function OpenPromptExercise({ exercise }: { exercise: OpenPrompt }) {
  const [answer, setAnswer] = useState("");
  const judge = trpc.judge.judgeOpenPrompt.useMutation();

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-normal">
            Question
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed">{exercise.question.en}</p>
        </CardContent>
      </Card>

      <Textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Your answer… use STAR (Situation, Task, Action, Result) and include numbers."
        className="min-h-[200px]"
      />

      <Button
        onClick={() =>
          judge.mutate({
            question: exercise.question.en,
            answer,
            rubric: exercise.rubric,
          })
        }
        disabled={answer.trim().length < 20 || judge.isPending}
      >
        {judge.isPending ? "Judge is reading (~15 s)…" : "Submit for evaluation"}
      </Button>

      {judge.error && <p className="text-destructive text-sm">{judge.error.message}</p>}

      {judge.data && (
        <Reasoning
          score={judge.data.score}
          title={judge.data.passed ? "Strong answer" : "Room to tighten up"}
        >
          <p className="italic text-muted-foreground">{judge.data.reasoning}</p>

          {judge.data.hits.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wider text-chart-2 mb-1">Hits</p>
              <ul className="list-disc list-inside text-sm">
                {judge.data.hits.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
          )}

          {judge.data.misses.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wider text-chart-3 mb-1">Missed</p>
              <ul className="list-disc list-inside text-sm">
                {judge.data.misses.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </div>
          )}

          {judge.data.warnings.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wider text-destructive mb-1">Warnings</p>
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
