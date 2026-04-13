import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type OutputPosition = 'bottom' | 'right'

export const EDITOR_FONT_SIZES = [12, 13, 14, 15, 16, 18, 20] as const
export type EditorFontSize = (typeof EDITOR_FONT_SIZES)[number]

export const EDITOR_FONT_FAMILIES = [
  { id: 'jetbrains-mono', label: 'JetBrains Mono', value: "'JetBrains Mono Variable', monospace" },
  { id: 'hack-nerd', label: 'Hack Nerd Font', value: "'Hack Nerd Font', 'Hack', monospace" },
  { id: 'fira-code', label: 'Fira Code', value: "'Fira Code Variable', monospace" },
  { id: 'source-code-pro', label: 'Source Code Pro', value: "'Source Code Pro Variable', monospace" },
  { id: 'system', label: 'System Mono', value: "monospace" },
] as const

export type EditorFontFamilyId = (typeof EDITOR_FONT_FAMILIES)[number]['id']

export type ProgrammingLanguage = 'java' | 'python'

interface UIState {
  activeTrack: string
  activePattern: string | null
  outputPosition: OutputPosition
  editorFontSize: EditorFontSize
  editorFontFamily: EditorFontFamilyId
  onboardingComplete: boolean
  programmingLanguage: ProgrammingLanguage
  stickyProblemTab: boolean
  problemTab: 'description' | 'solution'
  setActiveTrack: (track: string) => void
  setActivePattern: (pattern: string) => void
  setOutputPosition: (position: OutputPosition) => void
  setEditorFontSize: (size: EditorFontSize) => void
  setEditorFontFamily: (family: EditorFontFamilyId) => void
  setOnboardingComplete: () => void
  setProgrammingLanguage: (lang: ProgrammingLanguage) => void
  setStickyProblemTab: (sticky: boolean) => void
  setProblemTab: (tab: 'description' | 'solution') => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      activeTrack: 'java-patterns',
      activePattern: null,
      outputPosition: 'bottom' as OutputPosition,
      editorFontSize: 12 as EditorFontSize,
      editorFontFamily: 'jetbrains-mono' as EditorFontFamilyId,
      onboardingComplete: false,
      programmingLanguage: 'java' as ProgrammingLanguage,
      stickyProblemTab: true,
      problemTab: 'description' as 'description' | 'solution',
      setActiveTrack: (track) => set({ activeTrack: track }),
      setActivePattern: (pattern) => set({ activePattern: pattern }),
      setOutputPosition: (position) => set({ outputPosition: position }),
      setEditorFontSize: (size) => set({ editorFontSize: size }),
      setEditorFontFamily: (family) => set({ editorFontFamily: family }),
      setOnboardingComplete: () => set({ onboardingComplete: true }),
      setProgrammingLanguage: (lang) => set({ programmingLanguage: lang }),
      setStickyProblemTab: (sticky) => set({ stickyProblemTab: sticky }),
      setProblemTab: (tab) => set({ problemTab: tab }),
    }),
    {
      name: 'anabasis-ui',
      version: 6,
      migrate: (persisted: unknown, version: number) => {
        const state = persisted as Record<string, unknown>
        if (version < 1) {
          state.outputPosition = (state.outputPosition as OutputPosition) ?? 'bottom'
        }
        if (version < 2) {
          state.editorFontSize = (state.editorFontSize as EditorFontSize) ?? 14
        }
        if (version < 3) {
          state.editorFontFamily = (state.editorFontFamily as EditorFontFamilyId) ?? 'jetbrains-mono'
        }
        if (version < 4) {
          state.onboardingComplete = (state.onboardingComplete as boolean) ?? false
        }
        if (version < 5) {
          state.programmingLanguage = (state.programmingLanguage as ProgrammingLanguage) ?? 'java'
        }
        if (version < 6) {
          state.stickyProblemTab = true
          state.problemTab = 'description'
        }
        return state
      },
    }
  )
)
