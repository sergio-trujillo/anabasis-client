// Theme provider — adapted from Praxema's praxema-client/src/components/theme-provider.tsx.
//
// F1 ships only the 2 themes that are wired in index.css:
//   - lone-dusk-bro (dark, default)
//   - legit-ide     (light)
//
// F2 will add the other 7 base themes + 4 seasonal themes from Praxema if
// the user wants the full 12-theme experience. The provider API stays the
// same so no consumers need to change.
//
// "D" key cycles between the available themes.

/* eslint-disable react-refresh/only-export-components */
import * as React from "react";

export const BASE_THEMES = {
  "lone-dusk-bro": { label: "Lone Dusk Bro", mode: "dark" as const },
  "legit-ide": { label: "Totally Legit IDE", mode: "light" as const },
} satisfies Record<string, { label: string; mode: "dark" | "light" }>;

export type ThemeName = keyof typeof BASE_THEMES;
const BASE_THEME_NAMES = Object.keys(BASE_THEMES) as ThemeName[];

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: ThemeName;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  cycleTheme: () => void;
};

const ThemeProviderContext = React.createContext<ThemeProviderState | undefined>(
  undefined,
);

function isThemeName(value: string | null): value is ThemeName {
  return value !== null && value in BASE_THEMES;
}

export function ThemeProvider({
  children,
  defaultTheme = "lone-dusk-bro",
  storageKey = "anabasis-theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<ThemeName>(() => {
    if (typeof window === "undefined") return defaultTheme;
    const stored = localStorage.getItem(storageKey);
    return isThemeName(stored) ? stored : defaultTheme;
  });

  const setTheme = (nextTheme: ThemeName) => {
    localStorage.setItem(storageKey, nextTheme);
    setThemeState(nextTheme);
  };

  const cycleTheme = () => {
    setThemeState((current) => {
      const idx = BASE_THEME_NAMES.indexOf(current);
      const next =
        idx >= 0
          ? (BASE_THEME_NAMES[(idx + 1) % BASE_THEME_NAMES.length] as ThemeName)
          : (BASE_THEME_NAMES[0] as ThemeName);
      localStorage.setItem(storageKey, next);
      return next;
    });
  };

  // Apply the theme class to <html>. Imperative DOM mutation is the right
  // tool here — there's no declarative React API for setting `<html>` classes.
  React.useEffect(() => {
    const root = document.documentElement;
    const config = BASE_THEMES[theme];
    if (!config) return;
    root.classList.remove("light", "dark");
    for (const name of BASE_THEME_NAMES) {
      root.classList.remove(`theme-${name}`);
    }
    root.classList.add(config.mode);
    root.classList.add(`theme-${theme}`);
  }, [theme]);

  // "D" key cycles themes — same shortcut as Praxema. Skip when typing in
  // a text field so it doesn't fight the user.
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "d" && e.key !== "D") return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if ((e.target as HTMLElement | null)?.isContentEditable) return;
      cycleTheme();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cross-tab sync: react to localStorage changes from another tab.
  React.useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.storageArea !== localStorage) return;
      if (e.key !== storageKey) return;
      if (isThemeName(e.newValue)) setThemeState(e.newValue);
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [storageKey]);

  const value = { theme, setTheme, cycleTheme };

  return (
    <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>
  );
}

export function useTheme() {
  const ctx = React.useContext(ThemeProviderContext);
  if (ctx === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
