import { useState, useRef, useCallback } from 'react'

const STORAGE_PREFIX = 'anabasis-code:'
const DEBOUNCE_MS = 500
const SAVED_INDICATOR_MS = 1500

function getSavedCode(slug: string): string | null {
  return localStorage.getItem(`${STORAGE_PREFIX}${slug}`)
}

function saveCode(slug: string, code: string) {
  localStorage.setItem(`${STORAGE_PREFIX}${slug}`, code)
}

function clearSavedCode(slug: string) {
  localStorage.removeItem(`${STORAGE_PREFIX}${slug}`)
}

export function useEditorCode(slug: string, starterCode: string) {
  const [code, setCode] = useState(() => getSavedCode(slug) ?? starterCode)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const slugRef = useRef(slug)
  const prevStarterRef = useRef(starterCode)

  // When slug changes, load the saved code or starter code
  if (slugRef.current !== slug) {
    slugRef.current = slug
    prevStarterRef.current = starterCode
    const saved = getSavedCode(slug)
    setCode(saved ?? starterCode)
    setSaveStatus('idle')
  }

  // When starterCode arrives (async load), update if user hasn't edited yet
  if (prevStarterRef.current !== starterCode) {
    prevStarterRef.current = starterCode
    const saved = getSavedCode(slug)
    if (!saved) setCode(starterCode)
  }

  const handleChange = useCallback((value: string) => {
    setCode(value)
    setSaveStatus('saving')

    if (timerRef.current) clearTimeout(timerRef.current)
    if (savedTimerRef.current) clearTimeout(savedTimerRef.current)

    timerRef.current = setTimeout(() => {
      saveCode(slug, value)
      setSaveStatus('saved')
      savedTimerRef.current = setTimeout(() => setSaveStatus('idle'), SAVED_INDICATOR_MS)
    }, DEBOUNCE_MS)
  }, [slug])

  const handleReset = useCallback(() => {
    clearSavedCode(slug)
    setCode(starterCode)
    setSaveStatus('idle')
  }, [slug, starterCode])

  const isDirty = code !== starterCode

  return { code, handleChange, handleReset, isDirty, saveStatus }
}
