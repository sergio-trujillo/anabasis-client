# Praxema Client

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-latest-000000?logo=shadcnui&logoColor=white)
![Tracks](https://img.shields.io/badge/Tracks-12-blue)
![License](https://img.shields.io/badge/License-Proprietary-red)

Frontend for the **Praxema** learning platform — a local-first, gamified environment for practicing technical interview skills with interactive lessons, algorithm animations, and guided edge-case feedback.

## Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **Vite 7** | Build tool + dev server |
| **shadcn/ui (base-mira)** | Core component library (30+ components, base-ui primitives) |
| **Animate UI** | Animated components (counters, particles, flip cards) |
| **prompt-kit** | Markdown renderer + code blocks |
| **Kibo UI** | Contribution graph + status indicators |
| **Shiki** | Syntax highlighting (theme-aware: one-dark-pro, vitesse-dark, github-light) |
| **Recharts** | Dashboard charts (via shadcn Charts) |
| **Monaco Editor** | VSCode-like code editor |
| **Motion** | Algorithm visualizer animations |
| **D3** | Tree/graph layout computation |
| **tRPC + React Query** | Type-safe API client with caching |
| **React Router** | Client-side routing |
| **Zustand** | UI state management (persisted) |
| **i18next** | Internationalization (en/es) |
| **Tailwind CSS 4** | Utility-first styling (OKLCH/hex custom properties) |

## Features

- **Dashboard** — XP, streaks, level progression, track cards, contribution heatmap
- **Sidebar** — Patterns grouped by difficulty level with lock/unlock status
- **Lesson View** — Full-width markdown lessons with embedded animations
- **Problem View** — Resizable split panels (description + editor + output) with tabs (Description / Solution / Visualize)
- **Output Layout** — Toggle output panel below or right of editor (persisted in localStorage)
- **Command Palette** — `Cmd+K` search across patterns and problems
- **12 Tracks** — Java Language, Data Structures, Standard Library, Tricky Syntax, Big O, FP, Clean Code, Java Patterns, Algorithms, Concurrency, Classic AI, Design Patterns
- **Theme Switcher** — 8 base + 4 seasonal themes via dropdown or `D` key
- **Syntax Highlighting** — Shiki code blocks sync with active theme
- **Gamification** — XP system, 10 levels, daily streaks, 12+ badges
- **Algorithm Animations** — Step-by-step visualizations with educational narration
- **Edge Case Guidance** — Progressive hints (why, check, hint) on failed tests
- **i18n** — English and Spanish UI

## Getting Started

```bash
# Install dependencies
bun install

# Start both client and server (server must be sibling at ../praxema-server)
bun run dev

# Start client only
bun run dev:client

# Type check
bun run typecheck

# Lint
bun run lint
```

## Project Structure

```
src/
├── components/
│   ├── layout/          # AppLayout, AppHeader, CommandPalette
│   ├── lesson/          # LessonView
│   ├── problem/         # ProblemList, ProblemView
│   ├── ui/              # shadcn components (code-block, markdown, shadcn-markdown)
│   ├── animate-ui/      # Animate UI components
│   ├── kibo-ui/         # Kibo UI components
│   ├── theme-provider   # Named theme system (8+ themes, persisted)
│   └── app-sidebar.tsx  # Sidebar with tracks/patterns
├── pages/               # Route pages (Dashboard, Lesson, Problem, etc.)
├── store/               # Zustand stores (ui-store: track, pattern, outputPosition)
├── hooks/               # Custom hooks
├── lib/                 # tRPC client, utils
└── main.tsx             # Entry point with providers
```

## Theming

3 named themes defined as CSS custom property classes in `index.css`:

| Theme | CSS Class | Mode | Shiki Theme | Icon |
|---|---|---|---|---|
| Lone Dusk Bro | `.theme-lone-dusk-bro` | dark | one-dark-pro | MoonStar |
| Groovebox | `.theme-groovebox` | dark | vitesse-dark | Sunset |
| Totally Legit IDE | `.theme-legit-ide` | light | github-light | Sun |

Theme provider applies both the theme class and `dark`/`light` class to `<html>`. Persisted in localStorage.

## Routes

| Route | Page |
|---|---|
| `/` | Dashboard — stats, tracks, progress |
| `/track/:track` | Track dashboard with pattern grid |
| `/pattern/:pattern/lesson` | Lesson view with markdown + animation |
| `/pattern/:pattern/problems` | Problem list for the pattern |
| `/problem/:slug` | Problem IDE (description + editor + output) |
| `/progress` | Progress dashboard |

## Related Repos

| Repo | Description |
|---|---|
| [praxema-server](https://github.com/sergio-trujillo/praxema-server) | Express + tRPC backend |
| [praxema-content](https://github.com/sergio-trujillo/praxema-content) | Learning tracks, problems, lessons |
