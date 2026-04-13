// useInterviewerChat — the glue between React state and the server
// orchestrated chat router. Decoupled from UI so tests can use it directly.
//
// Lifecycle:
//   1. start(scenarioId) → server creates a session, returns sessionId
//      and opening message. We seed local history.
//   2. send(candidateMessage) → optimistic append of candidate turn,
//      then await server reply (or close+eval if maxTurns reached).
//   3. When the server returns closed: true, we stop accepting input,
//      store the EVAL, and expose it via `eval` + `closed`.
//
// The hook never talks to Ollama directly — that's the server's job.
//
// **Opus-review fixes applied:**
//   #3 Synchronous sendingRef guard — closure-level `closed`/`sending`
//      capture would let a double-click both pass the guard. A ref
//      updated synchronously before the first await closes the race.
//   #4 isMountedRef guard around post-await setState — prevents "set
//      state on unmounted component" when the user navigates mid-send.

import { useCallback, useEffect, useRef, useState } from "react";
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

  // Fix #3 — synchronous guards via refs. These update before any await,
  // so a concurrent send() sees the guard even if the React state hasn't
  // flushed yet.
  const sendingRef = useRef(false);
  const closedRef = useRef(false);

  // Fix #4 — know when we're unmounted to avoid setState leaks.
  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const startMut = trpc.chat.start.useMutation();
  const sendMut = trpc.chat.send.useMutation();

  const start = useCallback(
    async (scenarioId: string) => {
      // Reset for a fresh session.
      closedRef.current = false;
      sendingRef.current = false;

      if (isMountedRef.current) {
        setHistory([]);
        setClosed(false);
        setEvalResult(null);
        setCandidateCount(0);
      }

      const res = await startMut.mutateAsync({ scenarioId });

      if (!isMountedRef.current) return;
      setSessionId(res.sessionId);
      setMaxTurns(res.maxTurns);
      setHistory([{ role: "interviewer", content: res.openingMessage }]);
    },
    [startMut],
  );

  const send = useCallback(
    async (candidateMessage: string) => {
      // Synchronous guards — ref, not state.
      if (!sessionId) return;
      if (closedRef.current) return;
      if (sendingRef.current) return;
      sendingRef.current = true;

      try {
        if (isMountedRef.current) {
          setHistory((h) => [...h, { role: "candidate", content: candidateMessage }]);
          setCandidateCount((c) => c + 1);
        }

        const res = await sendMut.mutateAsync({ sessionId, candidateMessage });

        if (!isMountedRef.current) return;

        if (res.closed) {
          closedRef.current = true;
          setHistory((h) => [
            ...h,
            { role: "interviewer", content: res.closingLine },
          ]);
          setEvalResult(res.eval);
          setClosed(true);
        } else {
          setHistory((h) => [...h, { role: "interviewer", content: res.reply }]);
        }
      } finally {
        sendingRef.current = false;
      }
    },
    [sessionId, sendMut],
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
