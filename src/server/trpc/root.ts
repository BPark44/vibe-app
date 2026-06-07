import { createCallerFactory, createTRPCRouter } from "./trpc";
import { profileRouter } from "./routers/profile";

export const appRouter = createTRPCRouter({
  profile: profileRouter,
});

export type AppRouter = typeof appRouter;

/** Factory for invoking the router server-side (RSC, route handlers, tests). */
export const createCaller = createCallerFactory(appRouter);
