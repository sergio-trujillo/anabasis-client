// Section page — /:companySlug/section/:sectionId
// Lists all exercises whose `section` matches the route param.
// Special-cases the "mock" sections by redirecting to the dedicated
// Mock GCA / Mock Power Day routes.

import { Link, Navigate, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Fade } from '@/components/animate-ui/primitives/effects/fade'
import { GradientText } from '@/components/animate-ui/primitives/texts/gradient'
import { Badge } from '@/components/ui/badge'
import { MagicCard } from '@/components/ui/magic-card'
import { Skeleton } from '@/components/ui/skeleton'
import { bilingual } from '@/lib/i18n'
import { trpc } from '@/lib/trpc'

const TYPE_VARIANT: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  mcq: 'default',
  code: 'secondary',
  'open-prompt': 'outline',
  'interviewer-chat': 'default',
}

export function SectionPage() {
  const { t } = useTranslation()
  const { companySlug = '', sectionId = '' } = useParams()

  // Redirect mock sections to their dedicated timed pages.
  if (sectionId === 'gca-mock') {
    return <Navigate to={`/${companySlug}/mock-gca`} replace />
  }
  if (sectionId === 'power-day-mock') {
    return <Navigate to={`/${companySlug}/mock-power-day`} replace />
  }

  const companyQuery = trpc.companies.get.useQuery({ slug: companySlug })
  const exercisesQuery = trpc.exercises.list.useQuery()

  const loop = (companyQuery.data as { loop: { phases: Array<{ sections: Array<{ id: string; name: string; kind: string }> }> } | null } | undefined)?.loop

  // Find section metadata in loop.json (for the pretty name + kind).
  const section = loop?.phases
    .flatMap((p) => p.sections)
    .find((s) => s.id === sectionId)

  type ExerciseListItem = {
    id: string
    type: 'mcq' | 'code' | 'open-prompt' | 'interviewer-chat'
    section: string
    title: { en: string; es?: string | null }
    difficulty?: string
  }
  const allExercises = (exercisesQuery.data as ExerciseListItem[] | undefined) ?? []
  const filtered = allExercises.filter((ex) => ex.section === sectionId)

  // Count per type for a quick overview header.
  const countsByType = filtered.reduce<Record<string, number>>((acc, ex) => {
    acc[ex.type] = (acc[ex.type] ?? 0) + 1
    return acc
  }, {})

  const isPending = companyQuery.isPending || exercisesQuery.isPending

  return (
    <div className="px-6 py-10 max-w-5xl mx-auto w-full space-y-6">
      {isPending && (
        <div className="space-y-4">
          <Skeleton className="h-10 w-80" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        </div>
      )}

      {!isPending && (
        <Fade>
          <header className="space-y-2">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              <Link to={`/${companySlug}`} className="hover:text-foreground transition-colors">
                {companyQuery.data?.company?.name ?? 'Company'}
              </Link>
              {section && <span> · {section.kind}</span>}
            </div>
            <h1 className="text-3xl font-bold font-heading tracking-tight">
              <GradientText
                text={section?.name ?? sectionId}
                gradient="linear-gradient(90deg, var(--primary) 0%, var(--chart-2) 50%, var(--primary) 100%)"
              />
            </h1>
            {filtered.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {Object.entries(countsByType).map(([type, count]) => (
                  <Badge key={type} variant={TYPE_VARIANT[type] ?? 'default'}>
                    {count} × {t(`exercise.types.${type}`, { defaultValue: type })}
                  </Badge>
                ))}
              </div>
            )}
          </header>
        </Fade>
      )}

      {!isPending && filtered.length === 0 && (
        <Fade>
          <MagicCard className="p-8 text-center">
            <p className="text-muted-foreground">
              {section
                ? t('section.empty', {
                    defaultValue: 'No exercises authored yet for this section.',
                  })
                : t('section.notFound', {
                    defaultValue: 'Section not found.',
                  })}
            </p>
          </MagicCard>
        </Fade>
      )}

      {!isPending && filtered.length > 0 && (
        <ul className="space-y-2">
          {filtered.map((ex, i) => (
            <Fade key={ex.id} delay={i * 0.015}>
              <li>
                <Link to={`/${companySlug}/exercise/${ex.id}`}>
                  <MagicCard className="p-4 hover:border-primary/50 transition-colors group">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium font-heading truncate">
                          {bilingual(ex.title)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {ex.difficulty && (
                          <Badge variant="outline" className="text-xs">
                            {ex.difficulty}
                          </Badge>
                        )}
                        <Badge variant={TYPE_VARIANT[ex.type] ?? 'default'}>
                          {t(`exercise.types.${ex.type}`, { defaultValue: ex.type })}
                        </Badge>
                      </div>
                    </div>
                  </MagicCard>
                </Link>
              </li>
            </Fade>
          ))}
        </ul>
      )}
    </div>
  )
}
