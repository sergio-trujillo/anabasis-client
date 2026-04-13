import { useState } from 'react'

export type SeasonId = 'halloween' | 'dia-de-muertos' | 'christmas' | 'friday13'

interface SeasonConfig {
  id: SeasonId
  icon: 'pumpkin' | 'skull' | 'tree' | 'glitch'
  subtitle: string
}

const SEASONS: SeasonConfig[] = [
  { id: 'halloween', icon: 'pumpkin', subtitle: '🎃 Trick or Debug' },
  { id: 'dia-de-muertos', icon: 'skull', subtitle: '💀 Código Eterno' },
  { id: 'christmas', icon: 'tree', subtitle: '🎄 Ho Ho Deploy' },
  { id: 'friday13', icon: 'glitch', subtitle: '⚡ SEGFAULT' },
]

function isFriday13(date: Date): boolean {
  return date.getDay() === 5 && date.getDate() === 13
}

function detectSeason(date: Date): SeasonConfig | null {
  const month = date.getMonth() + 1
  const day = date.getDate()

  if (isFriday13(date)) return SEASONS.find(s => s.id === 'friday13')!
  if (month === 11 && day >= 1 && day <= 3) return SEASONS.find(s => s.id === 'dia-de-muertos')!
  if (month === 10 && day >= 25 && day <= 31) return SEASONS.find(s => s.id === 'halloween')!
  if ((month === 12 && day >= 15) || (month === 1 && day <= 5)) return SEASONS.find(s => s.id === 'christmas')!

  return null
}

/** Detects which season is active based on date. Does NOT apply CSS —
 *  the ThemeProvider handles that when the user selects the seasonal theme. */
export function useSeasonalTheme() {
  const [season] = useState<SeasonConfig | null>(() => detectSeason(new Date()))
  return season
}

/** For testing: force a specific season to appear in the theme selector */
export function useForceSeasonalTheme(seasonId: SeasonId | null) {
  const [season] = useState<SeasonConfig | null>(
    seasonId ? SEASONS.find(s => s.id === seasonId) ?? null : null
  )
  return season
}
