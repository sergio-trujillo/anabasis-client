// Mock Power Day dashboard — /:companySlug/mock-power-day.
// Lists 10 curated loop scenarios; clicking one opens the runner at
// /:companySlug/mock-power-day/:mockId (MockPowerDayRunnerPage).

import { useParams } from 'react-router'
import { MockDashboard } from './MockExamPage'
import { POWER_DAY_SCENARIOS } from '@/data/mock-scenarios'

export function MockPowerDayPage() {
  const { companySlug = '' } = useParams()
  return (
    <MockDashboard
      companySlug={companySlug}
      scenarios={POWER_DAY_SCENARIOS}
      title="Mock Power Day"
      subtitle="3-hour virtual onsite · 4 rounds · pick a scenario"
      baseRoute={`/${companySlug}/mock-power-day`}
    />
  )
}
