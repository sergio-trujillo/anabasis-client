// i18next bootstrap — bilingual (en + es) with localStorage persistence.
//
// Mirrors Praxema's pattern (praxema-client/src/lib/i18n.ts):
//   - Both locales loaded upfront
//   - lng defaults to `en`, persisted under `anabasis-lang`
//   - `languageChanged` event → write-back to localStorage
//   - Fallback to en if a key is missing from the active locale
//
// Exercise content also carries bilingual fields { en, es } — consumers
// pick the active side via `i18n.language` (see `bilingual()` helper).

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enCommon from "../locales/en/common.json";
import esCommon from "../locales/es/common.json";

const STORAGE_KEY = "anabasis-lang";
const savedLng = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;

export const SUPPORTED_LANGUAGES = ["en", "es"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

function isSupported(lng: string | null): lng is SupportedLanguage {
  return lng === "en" || lng === "es";
}

i18n.use(initReactI18next).init({
  lng: isSupported(savedLng) ? savedLng : "en",
  fallbackLng: "en",
  defaultNS: "common",
  ns: ["common"],
  resources: {
    en: { common: enCommon },
    es: { common: esCommon },
  },
  interpolation: {
    escapeValue: false,
  },
  returnNull: false,
});

i18n.on("languageChanged", (lng) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, lng);
  }
});

/**
 * Picks the right side of a bilingual field based on the current language.
 * Falls back to en if the active locale is missing or the value is empty.
 */
export function bilingual(
  field: { en: string; es?: string | null } | null | undefined,
): string {
  if (!field) return "";
  const active = i18n.language as SupportedLanguage;
  if (active === "es" && field.es) return field.es;
  return field.en;
}

export default i18n;
