// Exercise page — /:companySlug/exercise/:exerciseId.
// Fetches exercise by id, dispatches to the type-specific component:
//   mcq                → McqExercise
//   code               → CodeExercise   (Monaco + runner.runJava)
//   open-prompt        → OpenPromptExercise (rubric judge)
//   interviewer-chat   → InterviewerChatExercise (multi-turn session)
//
// Ported from anabasis-client v1 with Fade entrance and MagicCard shell.

import { useParams } from 'react-router'
import { Fade } from '@/components/animate-ui/primitives/effects/fade'
import { CodeExercise } from '@/components/exercise/CodeExercise'
import { InterviewerChatExercise } from '@/components/exercise/InterviewerChatExercise'
import { McqExercise } from '@/components/exercise/McqExercise'
import { OpenPromptExercise } from '@/components/exercise/OpenPromptExercise'
import { AppLayout } from '@/components/layout/AppLayout'
import { MagicCard } from '@/components/ui/magic-card'
import { Skeleton } from '@/components/ui/skeleton'
import { bilingual } from '@/lib/i18n'
import { trpc } from '@/lib/trpc'

export function ExercisePage() {
  const { exerciseId = '' } = useParams()
  const { data, isPending, error } = trpc.exercises.get.useQuery({ id: exerciseId })

  return (
    <AppLayout>
      <div className="px-6 py-8 max-w-4xl mx-auto w-full">
        {isPending && (
          <div className="space-y-4">
            <Skeleton className="h-8 w-72" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        )}

        {error && <p className="text-destructive">{error.message}</p>}

        {data && (
          <Fade>
            <MagicCard className="p-8">
              <h1 className="text-2xl font-bold font-heading mb-6">{bilingual(data.title)}</h1>
              {data.type === 'mcq' && <McqExercise exercise={data} />}
              {data.type === 'code' && <CodeExercise exercise={data} />}
              {data.type === 'open-prompt' && <OpenPromptExercise exercise={data} />}
              {data.type === 'interviewer-chat' && <InterviewerChatExercise exercise={data} />}
            </MagicCard>
          </Fade>
        )}
      </div>
    </AppLayout>
  )
}
