# anabasis-client

<p align="left">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white" />
  <img alt="Tailwind" src="https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss&logoColor=white" />
  <img alt="shadcn/ui" src="https://img.shields.io/badge/shadcn%2Fui-base--mira-black" />
  <img alt="tRPC" src="https://img.shields.io/badge/tRPC-11-2596BE?logo=trpc&logoColor=white" />
  <img alt="Monaco" src="https://img.shields.io/badge/Monaco-Editor-0078D4" />
  <img alt="Phase" src="https://img.shields.io/badge/Phase-F3-yellow" />
  <img alt="Part of" src="https://img.shields.io/badge/Part%20of-Anabasis-black" />
  <img alt="License" src="https://img.shields.io/badge/License-Proprietary-red" />
</p>

> Frontend for **Anabasis** — local-first, company-specific interview prep. Company catalog, countdown-to-interview header, mixed exercises, interviewer chat UI, mock loop runner.

Sibling to [`anabasis-server`](https://github.com/sergio-trujillo/anabasis-server), [`anabasis-content`](https://github.com/sergio-trujillo/anabasis-content), and [`anabasis-llm`](https://github.com/sergio-trujillo/anabasis-llm). **Not a monorepo** — independent folder, own `package.json`, own `node_modules/`. This client imports the server's `AppRouter` type via a TypeScript paths alias (`@server/*` → `../anabasis-server/src/*`, type-only, erased at build time).

---

## What it does

Single-page app that drives the user through their interview-prep campaign:

| Surface | Component | Role |
|---|---|---|
| Catalog page           | `CompanyCatalog`        | 6 companies — only Capital One `active` in v1, others greyed out with lock icon |
| Company home           | `CompanyHome`           | countdown header + loop roadmap + module progress |
| Mixed exercises        | `{Mcq,Code,OpenPrompt,Match,...}Exercise` | reused from Praxema + LLM-eval additions |
| Interviewer chat       | `InterviewerChat`       | system design / behavioral / case rounds, powered by `anabasis-server` chat router |
| Mock Power Day         | `MockLoopRunner`        | orchestrates 4 back-to-back rounds |
| Timed GCA              | `TimedAssessment`       | 4-problem / 70-minute mock CodeSignal GCA |
| Story Bank             | `StoryBankEditor`       | behavioral stories with local persistence |
| Business case stepper  | `BusinessCaseStepper`   | clarify → structure → analyze → recommend |

## Chat UI stack — shadcn.io/ai

We install **7 of 14** components from the `shadcn.io/ai` registry:

| ✅ Install | 🚫 Skip |
|---|---|
| `ai-message` | `ai-code-block` *(Shiki conflict — reuse Praxema's `<CodeBlock>`)* |
| `ai-conversation` | `ai-tool` *(no tool use in v1)* |
| `ai-prompt-input` | `ai-sources` / `ai-inline-citation` *(no RAG)* |
| `ai-loader` | `ai-chain-of-thought` *(we have our own `BusinessCaseStepper`)* |
| `ai-reasoning` ⭐ | `ai-model-selector` *(one model fixed)* |
| `ai-actions` | `ai-shimmer` *(streaming is enough)* |
| `ai-suggestion` | |

⭐ `ai-reasoning` is the killer feature — collapsible "thinking" block that renders the judge's score reasoning. Collapsed by default, expandable so the user understands *why* they got 70 vs 90.

## tRPC type import (no monorepo)

```ts
// src/lib/trpc.ts
import type { AppRouter } from '@server/routers/_app'
import { createTRPCReact } from '@trpc/react-query'
export const trpc = createTRPCReact<AppRouter>()
```

The `@server/*` alias points at `../anabasis-server/src/*` in `tsconfig.app.json`. Combined with `verbatimModuleSyntax: true` and `import type`, the type is fully erased at build time — **zero runtime coupling** between the two packages. This is the pattern [Praxema](https://github.com/sergio-trujillo/praxema) has been running in production for months.

---

## Quick start

```bash
# prereqs
brew install node
# make sure anabasis-server is at ../anabasis-server relative to this folder

npm install
npm run dev           # Vite on :5174 (offset +1 from Praxema's :5173)
```

---

## Stack

- **Runtime:** Vite 7 + React 19 + strict TypeScript
- **UI:** shadcn/ui (base-mira) + base-ui primitives + Tailwind v4 + lucide-react + Motion
- **Chat:** shadcn.io/ai (7 components) driven by a custom `useInterviewerChat(scenarioId)` hook
- **Code editor:** Monaco (lazy loaded) + Shiki for syntax highlight
- **State:** Zustand with persist middleware (story bank, UI prefs)
- **Data:** `@trpc/react-query` + TanStack Query
- **Routing:** react-router 7
- **i18n:** i18next (en / es) — content bilingual from day 1
- **Forms:** native + Zod
- **Tooling:** Biome (format + lint)

## Conventions

- **React 19 rules:** no `useMemo` / `useCallback` (React Compiler handles memoization), no `forwardRef` (ref is a normal prop), no `useEffect` for data fetching (use tRPC hooks), derive in render
- **Domain-specific components**, not generics: `BehavioralExerciseCard`, not `Card<T>`
- **Colocate by feature** (`exercise/`, `chat/`, `case/`) — no `common/` folder
- **Components ≤150 lines.** Extract when they grow
- **Don't extract until repeated 2+ times**

---

## License

**Proprietary.** Single-author personal project, not open-sourced. No public `LICENSE` file. See the workspace `STATUS.md` decision D19.
