import { Route, Routes } from "react-router";
import { CatalogPage } from "./pages/CatalogPage";
import { CompanyPage } from "./pages/CompanyPage";
import { ExercisePage } from "./pages/ExercisePage";
import { MockExamPage } from "./pages/MockExamPage";
import { MockPowerDayPage } from "./pages/MockPowerDayPage";
import { PracticePage } from "./pages/PracticePage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<CatalogPage />} />
      <Route path="/:companySlug" element={<CompanyPage />} />
      <Route path="/:companySlug/practice" element={<PracticePage />} />
      <Route path="/:companySlug/mock-gca" element={<MockExamPage />} />
      <Route path="/:companySlug/mock-power-day" element={<MockPowerDayPage />} />
      <Route path="/:companySlug/exercise/:exerciseId" element={<ExercisePage />} />
    </Routes>
  );
}
