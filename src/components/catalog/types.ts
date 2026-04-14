import type { AppRouter } from "@server/routers/_app";
import type { inferRouterOutputs } from "@trpc/server";

export type Company =
	inferRouterOutputs<AppRouter>["companies"]["list"][number];
