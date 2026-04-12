// useInterviewerChat — the glue between React state and the server
// orchestrated chat router. Decoupled from UI so the test for T10 can
// use this hook directly.
//
// Lifecycle:
//   1. `start(scenarioId)` → server creates a session, returns sessionId
//      and opening message. We seed local history.
//   2. `send(candidateMessage)` → optimistic append of candidate turn,
//      then await server reply (or close+eval if maxTurns reached).
//   3. When the server returns `closed: true`, we stop accepting input,
//      store the EVAL, and expose it via `eval` + `closed`.
//
// The hook never talks to Ollama directly — that's the server's job.

import { useCallback, useState } from "react";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@server/routers/_app";
import { trpc } from "../lib/trpc";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type SendOutput = RouterOutputs["chat"]["send"];
type EvalResult = Extract<SendOutput, { closed: true }>["eval"];

type LocalTurn = { role: "interviewer" | "candidate"; content: string };

export function useInterviewerChat() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [history, setHistory] = useState<LocalTurn[]>([]);
  const [closed, setClosed] = useState(false);
  const [evalResult, setEvalResult] = useState<EvalResult | null>(null);
  const [maxTurns, setMaxTurns] = useState(6);
  const [candidateCount, setCandidateCount] = useState(0);

  const startMut = trpc.chat.start.useMutation();
  const sendMut = trpc.chat.send.useMutation();

  const start = useCallback(
    async (scenarioId: string) => {
      setHistory([]);
      setClosed(false);
      setEvalResult(null);
      setCandidateCount(0);

      const res = await startMut.mutateAsync({ scenarioId });
      setSessionId(res.sessionId);
      setMaxTurns(res.maxTurns);
      setHistory([{ role: "interviewer", content: res.openingMessage }]);
    },
    [startMut],
  );

  const send = useCallback(
    async (candidateMessage: string) => {
      if (!sessionId || closed) return;

      // Optimistic append.
      setHistory((h) => [...h, { role: "candidate", content: candidateMessage }]);
      setCandidateCount((c) => c + 1);

      const res = await sendMut.mutateAsync({ sessionId, candidateMessage });

      if (res.closed) {
        setHistory((h) => [
          ...h,
          { role: "interviewer", content: res.closingLine },
        ]);
        setEvalResult(res.eval);
        setClosed(true);
      } else {
        setHistory((h) => [...h, { role: "interviewer", content: res.reply }]);
      }
    },
    [sessionId, closed, sendMut],
  );

  return {
    sessionId,
    history,
    closed,
    eval: evalResult,
    maxTurns,
    candidateCount,
    start,
    send,
    isStarting: startMut.isPending,
    isSending: sendMut.isPending,
    error: startMut.error ?? sendMut.error ?? null,
  };
}
