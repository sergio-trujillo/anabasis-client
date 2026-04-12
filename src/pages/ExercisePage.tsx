// Exercise page — fetches by id, discriminates by type, renders the
// matching domain component. Wrapped in AppLayout for the sidebar shell.

import { useParams } from "react-router";
import { CodeExercise } from "@/components/exercise/CodeExercise";
import { InterviewerChatExercise } from "@/components/exercise/InterviewerChatExercise";
import { McqExercise } from "@/components/exercise/McqExercise";
import { OpenPromptExercise } from "@/components/exercise/OpenPromptExercise";
import { AppLayout } from "@/components/layout/AppLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";

export function ExercisePage() {
  const { exerciseId = "" } = useParams();
  const { data, isPending, error } = trpc.exercises.get.useQuery({ id: exerciseId });

  return (
    <AppLayout>
      <div className="px-6 py-8 max-w-3xl mx-auto w-full">
        {isPending && (
          <div className="space-y-4">
            <Skeleton className="h-8 w-72" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        )}

        {error && <p className="text-destructive">{error.message}</p>}

        {data && (
          <>
            <h1 className="text-2xl font-bold font-heading mb-6">{data.title.en}</h1>
            {data.type === "mcq" && <McqExercise exercise={data} />}
            {data.type === "code" && <CodeExercise exercise={data} />}
            {data.type === "open-prompt" && <OpenPromptExercise exercise={data} />}
            {data.type === "interviewer-chat" && <InterviewerChatExercise exercise={data} />}
          </>
        )}
      </div>
    </AppLayout>
  );
}
