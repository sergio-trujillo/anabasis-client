// tRPC client bound to the anabasis-server AppRouter type.
//
// The AppRouter type is imported via the TypeScript `@server/*` paths
// alias (see tsconfig.app.json). Because it's `import type` combined with
// `verbatimModuleSyntax: true`, the import is fully erased at build time —
// Vite's module graph never sees it, and the client has zero runtime
// coupling to anabasis-server's source tree.
//
// This is the Praxema pattern; it looks like a monorepo import but isn't.
// Each package still has its own package.json + node_modules.

import type { AppRouter } from "@server/routers/_app";
import { createTRPCReact } from "@trpc/react-query";

export const trpc = createTRPCReact<AppRouter>();

// Relative URL — in dev, Vite proxies `/trpc` → `http://localhost:3001/trpc`
// (see vite.config.ts). In prod the server is expected to serve the built
// client at the same origin, so relative stays correct.
// Praxema uses the same pattern with `/api/trpc`.
export const TRPC_URL =
  (import.meta.env.VITE_TRPC_URL as string | undefined) ?? "/trpc";
