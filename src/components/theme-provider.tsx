/* eslint-disable react-refresh/only-export-components */
import * as React from "react"

export const BASE_THEMES = {
  "lone-dusk-bro": { label: "Lone Dusk Bro", mode: "dark" as const },
  groovebox: { label: "Groovebox", mode: "dark" as const },
  "just-my-type": { label: "Just My Type", mode: "dark" as const },
  "404-not-found": { label: "404 Not Found", mode: "dark" as const },
  "pastel-brujeria": { label: "Pastel Brujeria", mode: "dark" as const },
  "lost-in-shibuya": { label: "Lost in Shibuya", mode: "dark" as const },
  frostbyte: { label: "Frostbyte", mode: "dark" as const },
  "legit-ide": { label: "Totally Legit IDE", mode: "light" as const },
  "ad-majorem": { label: "Sathanas Gloriam", mode: "dark" as const },
} satisfies Record<string, { label: string; mode: "dark" | "light" }>

export const SEASONAL_THEMES = {
  halloween: { label: "Spooky Terminal", mode: "dark" as const, cssClass: "season-halloween" },
  "dia-de-muertos": { label: "Cempasuchil", mode: "dark" as const, cssClass: "season-dia-de-muertos" },
  christmas: { label: "North Pole IDE", mode: "dark" as const, cssClass: "season-christmas" },
  friday13: { label: "Glitch Mode", mode: "dark" as const, cssClass: "season-friday13" },
} satisfies Record<string, { label: string; mode: "dark" | "light"; cssClass: string }>

// All possible themes (base + seasonal)
export const THEMES = { ...BASE_THEMES, ...SEASONAL_THEMES } as Record<
  string,
  { label: string; mode: "dark" | "light"; cssClass?: string }
>

export type ThemeName = keyof typeof BASE_THEMES | keyof typeof SEASONAL_THEMES
const BASE_THEME_NAMES = Object.keys(BASE_THEMES) as ThemeName[]
const ALL_THEME_KEYS = Object.keys(THEMES) as ThemeName[]

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: ThemeName
  storageKey?: string
  disableTransitionOnChange?: boolean
}

type ThemeProviderState = {
  theme: ThemeName
  setTheme: (theme: ThemeName) => void
  cycleTheme: () => void
}

const ThemeProviderContext = React.createContext<
  ThemeProviderState | undefined
>(undefined)

function isThemeName(value: string | null): value is ThemeName {
  return value !== null && value in THEMES
}

function disableTransitionsTemporarily() {
  const style = document.createElement("style")
  style.appendChild(
    document.createTextNode(
      "*,*::before,*::after{-webkit-transition:none!important;transition:none!important}"
    )
  )
  document.head.appendChild(style)

  return () => {
    window.getComputedStyle(document.body)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        style.remove()
      })
    })
  }
}

export function ThemeProvider({
  children,
  defaultTheme = "lone-dusk-bro",
  storageKey = "theme",
  disableTransitionOnChange = true,
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<ThemeName>(() => {
    const storedTheme = localStorage.getItem(storageKey)
    if (isThemeName(storedTheme)) {
      return storedTheme
    }

    return defaultTheme
  })

  const setTheme = React.useCallback(
    (nextTheme: ThemeName) => {
      localStorage.setItem(storageKey, nextTheme)
      setThemeState(nextTheme)
    },
    [storageKey]
  )

  const cycleTheme = React.useCallback(() => {
    setThemeState((current) => {
      // Cycle only through base themes (D key shortcut)
      const currentIndex = BASE_THEME_NAMES.indexOf(current)
      const nextTheme = currentIndex >= 0
        ? BASE_THEME_NAMES[(currentIndex + 1) % BASE_THEME_NAMES.length]
        : BASE_THEME_NAMES[0]
      localStorage.setItem(storageKey, nextTheme)
      return nextTheme
    })
  }, [storageKey])

  const applyTheme = React.useCallback(
    (nextTheme: ThemeName) => {
      const root = document.documentElement
      const config = THEMES[nextTheme]
      if (!config) return
      const { mode } = config
      const restoreTransitions = disableTransitionOnChange
        ? disableTransitionsTemporarily()
        : null

      root.classList.remove("light", "dark")
      // Remove all theme classes (base + seasonal)
      for (const name of ALL_THEME_KEYS) {
        root.classList.remove(`theme-${name}`)
      }
      for (const s of Object.values(SEASONAL_THEMES)) {
        root.classList.remove(s.cssClass)
      }

      root.classList.add(mode)

      // Base themes use theme-{name}, seasonal use their cssClass
      if (nextTheme in SEASONAL_THEMES) {
        const seasonal = SEASONAL_THEMES[nextTheme as keyof typeof SEASONAL_THEMES]
        root.classList.add(seasonal.cssClass)
      } else {
        root.classList.add(`theme-${nextTheme}`)
      }

      if (restoreTransitions) {
        restoreTransitions()
      }
    },
    [disableTransitionOnChange]
  )

  React.useEffect(() => {
    applyTheme(theme)
  }, [theme, applyTheme])


  React.useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.storageArea !== localStorage) {
        return
      }

      if (event.key !== storageKey) {
        return
      }

      if (isThemeName(event.newValue)) {
        setThemeState(event.newValue)
        return
      }

      setThemeState(defaultTheme)
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [defaultTheme, storageKey])

  const value = React.useMemo(
    () => ({
      theme,
      setTheme,
      cycleTheme,
    }),
    [theme, setTheme, cycleTheme]
  )

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}
