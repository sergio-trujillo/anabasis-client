// Interviewer chat exercise — server-orchestrated multi-turn LLM session.
// F0 lesson baked in: this component never asks the LLM to close. The
// server emits the closing line + judge call when turnCount hits maxTurns.

import { useEffect } from "react";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@server/routers/_app";
import { Conversation } from "@/components/chat/Conversation";
import { Loader } from "@/components/chat/Loader";
import { Message } from "@/components/chat/Message";
import { PromptInput } from "@/components/chat/PromptInput";
import { Reasoning } from "@/components/chat/Reasoning";
import { useInterviewerChat } from "@/hooks/useInterviewerChat";

type ExerciseOutput = inferRouterOutputs<AppRouter>["exercises"]["get"];
type Scenario = Extract<ExerciseOutput, { type: "interviewer-chat" }>;

export function InterviewerChatExercise({ exercise }: { exercise: Scenario }) {
  const chat = useInterviewerChat();

  useEffect(() => {
    chat.start(exercise.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.id]);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden flex flex-col h-[70vh]">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-card">
        <div className="text-sm text-muted-foreground line-clamp-1">
          <span className="text-muted-foreground/60 mr-1">Persona:</span>
          {exercise.persona.slice(0, 80)}…
        </div>
        <div className="text-xs text-muted-foreground font-mono">
          turn {chat.candidateCount} / {chat.maxTurns}
        </div>
      </div>

      <Conversation length={chat.history.length + (chat.isSending ? 1 : 0)}>
        {chat.history.map((turn, i) => (
          <Message key={`${turn.role}-${i}`} role={turn.role}>
            {turn.content}
          </Message>
        ))}
        {chat.isSending && <Loader />}

        {chat.eval && (
          <div className="pt-2">
            <Reasoning score={chat.eval.score} title="Interview evaluation">
              <p className="italic text-muted-foreground">{chat.eval.feedback}</p>

              {chat.eval.covered.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-chart-2 mb-1">Covered</p>
                  <ul className="list-disc list-inside text-sm">
                    {chat.eval.covered.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {chat.eval.missed.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-chart-3 mb-1">Missed</p>
                  <ul className="list-disc list-inside text-sm">
                    {chat.eval.missed.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Reasoning>
          </div>
        )}
      </Conversation>

      {!chat.closed && (
        <PromptInput
          disabled={chat.isSending || chat.isStarting}
          onSubmit={(v) => chat.send(v)}
          placeholder="Answer the interviewer…"
        />
      )}

      {chat.error && (
        <div className="px-4 py-2 text-xs text-destructive border-t border-border">
          {chat.error.message}
        </div>
      )}
    </div>
  );
}
