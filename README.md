# anabasis-client

<p align="left">
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white" />
  <img alt="Tailwind" src="https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white" />
  <img alt="shadcn/ui" src="https://img.shields.io/badge/shadcn%2Fui-latest-000000?logo=shadcnui&logoColor=white" />
  <img alt="i18n" src="https://img.shields.io/badge/i18n-en%20%2B%20es-informational" />
  <img alt="Part of" src="https://img.shields.io/badge/Part%20of-Anabasis-black" />
  <img alt="License" src="https://img.shields.io/badge/License-Proprietary-red" />
</p>

> Frontend for **Anabasis** — local-first, company-specific interview prep. One company, one loop, one interview day at a time. The campaign screen: pick a target company, drill the loop, simulate the day, ship ready.

Sibling to [`anabasis-server`](https://github.com/sergio-trujillo/anabasis-server), [`anabasis-content`](https://github.com/sergio-trujillo/anabasis-content), and [`anabasis-llm`](https://github.com/sergio-trujillo/anabasis-llm). **Not a monorepo.**

---

## What it does

- **Catalog dashboard (`/`)** — featured active campaign, stats strip, coming-soon roster with Tilt cards.
- **Company campaign page (`/:companySlug`)** — the hub for a target company. Phases, sections, mock launch buttons.
- **Docs-style overview chapters** (`/:companySlug/overview/:topic/:page`) — paper-format reading for GCA, Power Day, and Company context. Each chapter renders one focused section with Prev/Next navigation.
- **Concepts reader** (`.../power-day/concepts`) — one-at-a-time book UI with a table of contents and in-URL position (`?c=N`). Each concept carries a definition, "why it matters", a worked example, 3 signals of strong execution, and 3 common mistakes.
- **Interviewer chat** — multi-turn simulated interview. The server owns turn counting; the client renders streaming messages and an end-of-session judge report. Sessions run in either English or Spanish per the UI language.
- **Mock loops** — timed Mock GCA (70 min) and Mock Power Day (4-round onsite sampler).
- **Exercises** — MCQ, open-prompt, code (Monaco + `javac` + JUnit 5), and interviewer-chat exercises, all loaded from `anabasis-content/` via tRPC.

## Stack

| Technology | Purpose |
|---|---|
| React 19 (compiler mode) | UI — no `useMemo`/`useCallback`, no `forwardRef`, no fetch `useEffect` |
| Vite 7 | Dev server (port `5174`) + bundler |
| shadcn/ui + base-ui primitives | Core components (30+) |
| Animate UI + MagicCard + BorderBeam | Dashboard-grade motion |
| Monaco Editor | Code exercises |
| shadcn.io/ai chat | Interviewer UX (Conversation, Message, Reasoning, PromptInput) |
| tRPC + React Query | End-to-end type-safe API client |
| React Router 7 | Client routing |
| i18next | Bilingual UI (EN + ES) |
| Tailwind CSS 4 | Utility styling with OKLCH/hex custom properties |
| Biome | Format + lint (no ESLint, no Prettier) |

## Quick start

```bash
bun install
bun run dev         # Vite on :5174 — requires anabasis-server running on :3001
bun run typecheck
bun run build
bunx biome check --write src/   # format + import sort
```

From the parent workspace, `./start-anabasis` boots both client and server together.

## Project structure

```
src/
├── components/
│   ├── catalog/         # CatalogHero, StatsRow, FeaturedCampaignCard, ComingSoonGrid
│   ├── layout/          # AppLayout, AppHeader, SidebarCompanyItem (collapsible phases)
│   ├── chat/            # Conversation, Message, PromptInput, Reasoning, Loader
│   ├── exercise/        # CodeExercise, McqExercise, OpenPromptExercise, InterviewerChatExercise
│   ├── problem/         # ExercisesDataTable (TanStack)
│   ├── animate-ui/      # motion primitives (Fade, Shine, Tilt, GradientText)
│   └── ui/              # shadcn primitives
├── pages/
│   ├── CatalogPage.tsx      # dashboard at /
│   ├── CompanyPage.tsx      # /:companySlug
│   ├── SectionPage.tsx      # legacy all-in-one overview + paper-format renderers
│   ├── ExercisePage.tsx     # individual exercise runner
│   ├── MockExamPage.tsx     # GCA mock dashboard
│   ├── MockExamRunnerPage.tsx
│   ├── MockPowerDayPage.tsx
│   ├── MockPowerDayRunnerPage.tsx
│   ├── PracticePage.tsx     # random practice
│   └── overview/
│       ├── OverviewLayout.tsx    # chapter shell with dropdown nav
│       ├── OverviewSubPage.tsx   # dispatches topic+slug to a renderer
│       ├── OverviewLandingPage.tsx
│       ├── PrevNextNav.tsx       # bottom chapter pager
│       └── chapters.ts           # chapter registry (company / power-day / gca)
├── hooks/
│   └── useInterviewerChat.ts    # state + refs for a chat session (Opus-reviewed)
├── locales/
│   ├── en/common.json           # full EN string table
│   └── es/common.json           # full ES string table (tuteo, no voseo)
├── lib/                         # trpc client, i18n setup, utils
└── router.tsx                   # all routes
```

## i18n

All user-facing strings live in `src/locales/{en,es}/common.json`. Convention:

- UI language toggles between English and **neutral-professional Spanish with tuteo** ("tú", never "vos/usted").
- Industry-standard technical terms stay in English (stateless, throughput, tradeoff, framework, stream, pipeline, retry, rollback, stakeholder, compliance, peer, partition, latency).
- Chapter content (overview pages) is fully bilingual including every paper-format bullet.
- Interviewer chat sessions run entirely in the selected language — the server picks the appropriate system prompt template based on the locale sent with `chat.start`.

## Routes

| Route | Page |
|---|---|
| `/` | Catalog (hero + featured + coming-soon grid) |
| `/:companySlug` | Company campaign hub |
| `/:companySlug/overview/:topic` | Chapter landing (power-day / gca / company) |
| `/:companySlug/overview/:topic/:page` | Individual chapter (paper format + Prev/Next) |
| `/:companySlug/practice` | Random practice |
| `/:companySlug/mock-gca` / `/mock-gca/:mockId` | Mock GCA dashboard + runner |
| `/:companySlug/mock-power-day` / `/mock-power-day/:mockId` | Mock Power Day dashboard + runner |
| `/:companySlug/exercise/:exerciseId` | Single exercise |
| `/:companySlug/section/:sectionId` | Legacy section view |

## Conventions (from CLAUDE.md)

- TypeScript strict. No manually shared types — let tRPC infer them.
- Components ≤150 lines. Extract into `components/<feature>/` when they grow.
- Domain-specific components (`BehavioralExerciseCard`, `TestCaseRow`), not generics.
- Biome for format/lint. No ESLint, no Prettier.
- React 19 compiler mode — skip `useMemo`/`useCallback`, derive in render.

---

## License

**Proprietary.** Single-author personal project, not open-sourced. No public `LICENSE` file. See the workspace `STATUS.md` decision D19.
