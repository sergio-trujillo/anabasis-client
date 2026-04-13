// Mock Power Day — 4-round simulated Capital One virtual onsite.
//
// Delegates each round to the existing per-type exercise component so we
// get LLM chat, rubric judge, and javac/JUnit for free:
//   round 0 (coding 1)                 → CodeExercise
//   round 1 (coding 2 / job fit)       → CodeExercise
//   round 2 (behavioral / sys design)  → OpenPromptExercise OR InterviewerChatExercise
//   round 3 (business case)            → InterviewerChatExercise OR OpenPromptExercise
//
// Single global 3-hour countdown (4 rounds × 45 min nominal) — no per-round
// gating in v1. Timer informs but doesn't block; the user can finish early.
// Reload resets (OD-5 — no persistence in v1).

import { ClockIcon, FlagIcon, TimerIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { Fade } from "@/components/animate-ui/primitives/effects/fade";
import { GradientText } from "@/components/animate-ui/primitives/texts/gradient";
import { CodeExercise } from "@/components/exercise/CodeExercise";
import { InterviewerChatExercise } from "@/components/exercise/InterviewerChatExercise";
import { OpenPromptExercise } from "@/components/exercise/OpenPromptExercise";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";

export function MockPowerDayPage() {
  const { companySlug = "capital-one" } = useParams();
  const examQuery = trpc.mock.buildPowerDay.useQuery({ companySlug });

  if (examQuery.isPending) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6 max-w-6xl mx-auto space-y-4">
          <Skeleton className="h-12 w-80" />
          <Skeleton className="h-96 rounded-lg" />
        </div>
      </div>
    );
  }

  const data = examQuery.data as ExamData | undefined;
  if (!data || data.rounds.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6 max-w-6xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No Mock Power Day available for this company yet.
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return <Runner key={data.examId} exam={data} />;
}

// tRPC type inference is temporarily degraded while legacy Praxema pages
// remain in-tree. Define the round/exam shapes explicitly — they mirror
// mock.buildPowerDay's server-side contract.
type AnyExerciseShape =
  | { id: string; type: "code"; section: string; title: { en: string; es?: string | null }; difficulty: string; language: string; statement: { en: string; es?: string | null }; starterCode: string; testCode: string }
  | { id: string; type: "mcq"; section: string; title: { en: string; es?: string | null }; prompt: { en: string; es?: string | null }; options: Array<{ id: string; label: { en: string; es?: string | null } }>; correctOptionId: string; explanation: { en: string; es?: string | null } }
  | { id: string; type: "open-prompt"; section: string; title: { en: string; es?: string | null }; question: { en: string; es?: string | null }; rubric: { must_include: string[]; must_avoid: string[]; value_alignment?: string; min_words?: number } }
  | { id: string; type: "interviewer-chat"; section: string; title: { en: string; es?: string | null }; topic: string; persona: string; must_explore: string[]; opening_message: string; max_turns: number };

type Round = {
  position: number;
  name: string;
  kind: "coding" | "behavioral-or-sysdesign" | "business-case";
  exercise: AnyExerciseShape;
};

type ExamData = {
  examId: string;
  companySlug: string;
  roundDurationSeconds: number;
  rounds: Round[];
  startedAt: string;
};

function Runner({ exam }: { exam: ExamData }) {
  const [activeRound, setActiveRound] = useState(0);
  const [completedRounds, setCompletedRounds] = useState<Set<number>>(new Set());
  const [finished, setFinished] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const totalSeconds = exam.roundDurationSeconds * exam.rounds.length;
  const startMs = useRef(new Date(exam.startedAt).getTime());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const elapsedSec = Math.max(0, Math.floor((now - startMs.current) / 1000));
  const remainingSec = Math.max(0, totalSeconds - elapsedSec);
  const timedOut = remainingSec === 0;
  const locked = finished || timedOut;

  const active = exam.rounds[activeRound];

  function markCompleteAndAdvance() {
    setCompletedRounds((prev) => new Set(prev).add(activeRound));
    if (activeRound < exam.rounds.length - 1) {
      setActiveRound(activeRound + 1);
    }
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden">
      {/* Constrained header area — timer + round strip */}
      <div className="shrink-0 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto w-full max-w-7xl space-y-3 p-2">
          <Header
            remainingSec={remainingSec}
            totalSeconds={totalSeconds}
            locked={locked}
            onFinish={() => setFinished(true)}
          />
          <RoundStrip
            rounds={exam.rounds}
            completedRounds={completedRounds}
            activeRound={activeRound}
            onSelect={(n) => !locked && setActiveRound(n)}
            locked={locked}
          />
        </div>
      </div>

      {/* Full-width body */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {locked ? (
          <div className="mx-auto w-full max-w-7xl px-6 py-6">
            <FinalSummary exam={exam} completedRounds={completedRounds} elapsedSec={elapsedSec} />
          </div>
        ) : (
          <div className="mx-auto w-full max-w-7xl px-6 py-6 space-y-4">
            <RoundHeader round={active} />
            <RoundBody round={active} />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={markCompleteAndAdvance}
                disabled={activeRound >= exam.rounds.length - 1}
              >
                Mark complete → next round
              </Button>
              {activeRound === exam.rounds.length - 1 && (
                <Button
                  onClick={() => {
                    setCompletedRounds((prev) => new Set(prev).add(activeRound));
                    setFinished(true);
                  }}
                >
                  Finish Power Day
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Header — global timer + finish button
// ─────────────────────────────────────────────────────────────────────────

function Header({
  remainingSec,
  totalSeconds,
  locked,
  onFinish,
}: {
  remainingSec: number;
  totalSeconds: number;
  locked: boolean;
  onFinish: () => void;
}) {
  const hh = String(Math.floor(remainingSec / 3600)).padStart(1, "0");
  const mm = String(Math.floor((remainingSec % 3600) / 60)).padStart(2, "0");
  const ss = String(remainingSec % 60).padStart(2, "0");
  const totalMin = Math.round(totalSeconds / 60);
  const urgent = remainingSec > 0 && remainingSec < 15 * 60;
  const timedOut = remainingSec === 0;

  return (
    <Fade>
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-border">
            <TimerIcon className="size-5" />
          </span>
          <div className="min-w-0">
            <h1 className="text-xl font-bold font-heading tracking-tight truncate">
              <GradientText
                text="Mock Power Day"
                gradient="linear-gradient(90deg, var(--primary) 0%, var(--chart-2) 50%, var(--primary) 100%)"
              />
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span>Capital One virtual onsite simulation</span>
              <span className="text-border">·</span>
              <span>4 rounds · {totalMin} min</span>
              <span className="text-border">·</span>
              <span className="font-mono">coding / sys-design / behavioral / case</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div
            className={`flex items-center gap-2 rounded-md px-3 py-2 font-mono text-lg tabular-nums ring-1 ring-inset transition-colors ${
              timedOut
                ? "bg-destructive/10 text-destructive ring-destructive/20"
                : urgent
                  ? "bg-amber-500/10 text-amber-600 ring-amber-500/20 dark:text-amber-400 animate-pulse"
                  : "bg-muted text-foreground ring-border"
            }`}
          >
            <ClockIcon className="size-4" />
            {hh}:{mm}:{ss}
          </div>
          <Button variant="destructive" onClick={onFinish} disabled={locked}>
            <FlagIcon className="size-4" />
            Finish
          </Button>
        </div>
      </header>
    </Fade>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// RoundStrip — 4 round tabs with completed dots
// ─────────────────────────────────────────────────────────────────────────

function RoundStrip({
  rounds,
  completedRounds,
  activeRound,
  onSelect,
  locked,
}: {
  rounds: Round[];
  completedRounds: Set<number>;
  activeRound: number;
  onSelect: (n: number) => void;
  locked: boolean;
}) {
  const kindLabel = (k: Round["kind"]) =>
    k === "coding" ? "code" : k === "behavioral-or-sysdesign" ? "chat" : "case";

  return (
    <div className="grid grid-cols-4 gap-2">
      {rounds.map((r, i) => {
        const isActive = i === activeRound;
        const done = completedRounds.has(i);
        return (
          <button
            key={r.exercise.id}
            type="button"
            onClick={() => onSelect(i)}
            disabled={locked && !isActive}
            className={`rounded-md border px-3 py-2 text-left transition ${
              isActive
                ? "border-primary bg-primary/5"
                : done
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : "border-border hover:bg-muted"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                Round {i + 1}
              </span>
              <Badge variant="outline" className="text-[10px] h-4 px-1.5">
                {kindLabel(r.kind)}
              </Badge>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-sm font-medium truncate flex-1">{r.name}</span>
              {done && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400">✓</span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// RoundHeader + RoundBody — delegates to the type-specific component
// ─────────────────────────────────────────────────────────────────────────

function RoundHeader({ round }: { round: Round }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold font-heading">{round.name}</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Round {round.position + 1} · {round.exercise.type}
        </p>
      </div>
      <Badge variant="outline">{round.exercise.type}</Badge>
    </div>
  );
}

function RoundBody({ round }: { round: Round }) {
  const ex = round.exercise;
  // The concrete exercise components type their props via
  // inferRouterOutputs<AppRouter>["exercises"]["get"] which is currently
  // degraded. Cast through unknown to the component's local expectation;
  // runtime shape matches the server's AnyExercise by contract.
  if (ex.type === "code") {
    return <CodeExercise exercise={ex as unknown as Parameters<typeof CodeExercise>[0]["exercise"]} />;
  }
  if (ex.type === "open-prompt") {
    return <OpenPromptExercise exercise={ex as unknown as Parameters<typeof OpenPromptExercise>[0]["exercise"]} />;
  }
  if (ex.type === "interviewer-chat") {
    return <InterviewerChatExercise exercise={ex as unknown as Parameters<typeof InterviewerChatExercise>[0]["exercise"]} />;
  }
  return (
    <Card>
      <CardContent className="p-6 text-muted-foreground text-sm">
        Unsupported round type.
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// FinalSummary — shown when finished or timed out
// ─────────────────────────────────────────────────────────────────────────

function FinalSummary({
  exam,
  completedRounds,
  elapsedSec,
}: {
  exam: ExamData;
  completedRounds: Set<number>;
  elapsedSec: number;
}) {
  const hh = Math.floor(elapsedSec / 3600);
  const mm = Math.floor((elapsedSec % 3600) / 60);
  const completedCount = completedRounds.size;
  const totalRounds = exam.rounds.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-heading">Power Day complete</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-baseline gap-3">
          <span className="text-5xl font-bold font-heading tabular-nums">{completedCount}</span>
          <span className="text-2xl text-muted-foreground">/ {totalRounds}</span>
          <span className="text-sm text-muted-foreground ml-2">rounds marked complete</span>
          <span className="text-sm text-muted-foreground ml-auto tabular-nums font-mono">
            {hh}h {mm}m elapsed
          </span>
        </div>

        <ul className="divide-y divide-border">
          {exam.rounds.map((r, i) => {
            const done = completedRounds.has(i);
            return (
              <li key={r.exercise.id} className="flex items-center justify-between py-3 gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`text-sm font-mono ${done ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}
                  >
                    {done ? "✓" : "—"}
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">
                      Round {i + 1}: {r.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {r.exercise.type} · {r.exercise.section}
                    </div>
                  </div>
                </div>
                <div className="text-xs tabular-nums font-mono text-muted-foreground">
                  {done ? "complete" : "not attempted"}
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
