// MCQ exercise — deterministic evaluation. Uses shadcn Button + theme tokens.

import { useState } from "react";
import { CheckIcon, XIcon } from "lucide-react";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@server/routers/_app";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";

type ExerciseOutput = inferRouterOutputs<AppRouter>["exercises"]["get"];
type Mcq = Extract<ExerciseOutput, { type: "mcq" }>;

export function McqExercise({ exercise }: { exercise: Mcq }) {
  const [selected, setSelected] = useState<string | null>(null);
  const evalMcq = trpc.exercises.evaluateMcq.useMutation();
  const result = evalMcq.data;

  return (
    <div className="space-y-5">
      <p className="text-foreground leading-relaxed">{exercise.prompt.en}</p>

      <ul className="space-y-2">
        {exercise.options.map((opt) => {
          const isSelected = selected === opt.id;
          const isCorrect = result && opt.id === result.correctOptionId;
          const isWrongSelected = result && isSelected && opt.id !== result.correctOptionId;

          return (
            <li key={opt.id}>
              <button
                type="button"
                onClick={() => setSelected(opt.id)}
                disabled={evalMcq.isPending || !!result}
                className={cn(
                  "w-full text-left rounded-md border px-4 py-3 text-sm transition-colors",
                  isCorrect && "border-chart-2 bg-chart-2/10 text-foreground",
                  isWrongSelected && "border-destructive bg-destructive/10 text-foreground",
                  !isCorrect && !isWrongSelected && isSelected && "border-primary bg-accent",
                  !isSelected &&
                    !isCorrect &&
                    !isWrongSelected &&
                    "border-border bg-card hover:border-muted-foreground",
                )}
              >
                <span className="text-muted-foreground mr-2 font-mono">
                  {opt.id.toUpperCase()}.
                </span>
                {opt.label.en}
              </button>
            </li>
          );
        })}
      </ul>

      {!result && (
        <Button
          onClick={() => selected && evalMcq.mutate({ id: exercise.id, optionId: selected })}
          disabled={!selected || evalMcq.isPending}
        >
          {evalMcq.isPending ? "Checking…" : "Submit"}
        </Button>
      )}

      {result && (
        <div
          className={cn(
            "rounded-lg border p-4",
            result.correct
              ? "border-chart-2/40 bg-chart-2/5"
              : "border-destructive/40 bg-destructive/5",
          )}
        >
          <p className="font-semibold text-sm mb-1 flex items-center gap-2">
            {result.correct ? (
              <CheckIcon className="size-4 text-chart-2" />
            ) : (
              <XIcon className="size-4 text-destructive" />
            )}
            {result.correct ? "Correct" : "Not quite"}
          </p>
          <p className="text-sm text-muted-foreground">{result.explanation.en}</p>
        </div>
      )}
    </div>
  );
}
