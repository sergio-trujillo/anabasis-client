// Anabasis routes.
//   ✅ /                              → CatalogPage        (Fase 5a)
//   ✅ /:companySlug                  → CompanyPage        (Fase 5a)
//   ✅ /:companySlug/practice         → PracticePage       (Fase 5b)
//   ✅ /:companySlug/exercise/:id     → ExercisePage       (Fase 5b)
//   ✅ /:companySlug/section/:id      → SectionPage        (Fase 6)
//   ✅ /:companySlug/mock-gca         → MockExamPage       (Fase 5c)
//   ✅ /:companySlug/mock-power-day   → MockPowerDayPage   (Fase 5c)

import { Navigate, Route, Routes, useParams } from 'react-router'
import { CatalogPage } from '@/pages/CatalogPage'
import { CompanyPage } from '@/pages/CompanyPage'
import { ExercisePage } from '@/pages/ExercisePage'
import { MockExamPage } from '@/pages/MockExamPage'
import { MockExamRunnerPage } from '@/pages/MockExamRunnerPage'
import { MockPowerDayPage } from '@/pages/MockPowerDayPage'
import { MockPowerDayRunnerPage } from '@/pages/MockPowerDayRunnerPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { OverviewLandingPage } from '@/pages/overview/OverviewLandingPage'
import { OverviewLayout } from '@/pages/overview/OverviewLayout'
import { OverviewSubPage } from '@/pages/overview/OverviewSubPage'
import { PracticePage } from '@/pages/PracticePage'
import { SectionPage } from '@/pages/SectionPage'
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RouteErrorBoundary><CatalogPage /></RouteErrorBoundary>} />
      <Route path="/:companySlug" element={<RouteErrorBoundary><CompanyPage /></RouteErrorBoundary>} />
      <Route path="/:companySlug/practice" element={<RouteErrorBoundary><PracticePage /></RouteErrorBoundary>} />
      <Route path="/:companySlug/mock-gca" element={<RouteErrorBoundary><MockExamPage /></RouteErrorBoundary>} />
      <Route path="/:companySlug/mock-gca/:mockId" element={<RouteErrorBoundary><MockExamRunnerPage /></RouteErrorBoundary>} />
      <Route path="/:companySlug/mock-power-day" element={<RouteErrorBoundary><MockPowerDayPage /></RouteErrorBoundary>} />
      <Route path="/:companySlug/mock-power-day/:mockId" element={<RouteErrorBoundary><MockPowerDayRunnerPage /></RouteErrorBoundary>} />
      <Route path="/:companySlug/exercise/:exerciseId" element={<RouteErrorBoundary><ExercisePage /></RouteErrorBoundary>} />

      {/* Legacy overview URLs redirect into the new docs-style routes. */}
      <Route
        path="/:companySlug/section/gca-overview"
        element={<OverviewRedirect topic="gca" />}
      />
      <Route
        path="/:companySlug/section/power-day-overview"
        element={<OverviewRedirect topic="power-day" />}
      />

      <Route
        path="/:companySlug/overview/:topic"
        element={<RouteErrorBoundary><OverviewLayout /></RouteErrorBoundary>}
      >
        <Route index element={<OverviewLandingPage />} />
        <Route path=":page" element={<OverviewSubPage />} />
      </Route>

      <Route path="/:companySlug/section/:sectionId" element={<RouteErrorBoundary><SectionPage /></RouteErrorBoundary>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

function OverviewRedirect({ topic }: { topic: 'gca' | 'power-day' }) {
  const { companySlug = 'capital-one' } = useParams()
  return <Navigate to={`/${companySlug}/overview/${topic}`} replace />
}
