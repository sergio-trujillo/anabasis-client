import { useEffect } from 'react'

type Shortcut = {
  key: string
  ctrl?: boolean
  shift?: boolean
  handler: () => void
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      for (const s of shortcuts) {
        const ctrlOrMeta = e.ctrlKey || e.metaKey
        if (
          e.key === s.key &&
          (!s.ctrl || ctrlOrMeta) &&
          (!s.shift || e.shiftKey) &&
          (s.shift || !e.shiftKey)
        ) {
          e.preventDefault()
          s.handler()
          return
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}
