import type { inferRouterOutputs } from '@trpc/server'
import type { AppRouter } from '@server/routers/_app'

export type Company = inferRouterOutputs<AppRouter>['companies']['list'][number]
