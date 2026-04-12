import { Route, Routes } from "react-router";
import { CatalogPage } from "./pages/CatalogPage";
import { CompanyPage } from "./pages/CompanyPage";
import { ExercisePage } from "./pages/ExercisePage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<CatalogPage />} />
      <Route path="/:companySlug" element={<CompanyPage />} />
      <Route path="/:companySlug/exercise/:exerciseId" element={<ExercisePage />} />
    </Routes>
  );
}
