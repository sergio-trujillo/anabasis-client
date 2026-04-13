import { createTRPCReact } from '@trpc/react-query'
import { httpBatchLink } from '@trpc/client'

// Type-only import from server (sibling repo, never bundled).
// Anabasis server exports AppRouter from routers/_app.ts (not routers/).
import type { AppRouter } from '@server/routers/_app'

export const trpc = createTRPCReact<AppRouter>()

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      // Anabasis server listens on :3001 directly (see anabasis-server/src/index.ts).
      // Vite dev proxy at /api/trpc forwards to that target — see vite.config.ts.
      url: '/api/trpc',
    }),
  ],
})
