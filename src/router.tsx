// Anabasis routes.
//   ✅ /                              → CatalogPage        (Fase 5a)
//   ✅ /:companySlug                  → CompanyPage        (Fase 5a)
//   ✅ /:companySlug/practice         → PracticePage       (Fase 5b)
//   ✅ /:companySlug/exercise/:id     → ExercisePage       (Fase 5b)
//   ✅ /:companySlug/mock-gca         → MockExamPage       (Fase 5c)
//   ✅ /:companySlug/mock-power-day   → MockPowerDayPage   (Fase 5c)

import { Routes, Route } from 'react-router'
import { CatalogPage } from '@/pages/CatalogPage'
import { CompanyPage } from '@/pages/CompanyPage'
import { ExercisePage } from '@/pages/ExercisePage'
import { MockExamPage } from '@/pages/MockExamPage'
import { MockPowerDayPage } from '@/pages/MockPowerDayPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { PracticePage } from '@/pages/PracticePage'
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RouteErrorBoundary><CatalogPage /></RouteErrorBoundary>} />
      <Route path="/:companySlug" element={<RouteErrorBoundary><CompanyPage /></RouteErrorBoundary>} />
      <Route path="/:companySlug/practice" element={<RouteErrorBoundary><PracticePage /></RouteErrorBoundary>} />
      <Route path="/:companySlug/mock-gca" element={<RouteErrorBoundary><MockExamPage /></RouteErrorBoundary>} />
      <Route path="/:companySlug/mock-power-day" element={<RouteErrorBoundary><MockPowerDayPage /></RouteErrorBoundary>} />
      <Route path="/:companySlug/exercise/:exerciseId" element={<RouteErrorBoundary><ExercisePage /></RouteErrorBoundary>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
