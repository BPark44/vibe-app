import "server-only";

import { headers } from "next/headers";
import { cache } from "react";

import { createTRPCContext } from "@/server/trpc/context";
import { createCaller } from "@/server/trpc/root";

/**
 * Server-side tRPC caller for use in Server Components, Server Actions, etc.
 * Calls procedures directly (no HTTP round-trip) while sharing the same
 * context as the API route handler.
 *
 *   const profile = await api.profile.me();
 */
const createContext = cache(async () => {
  const heads = new Headers(await headers());
  heads.set("x-trpc-source", "rsc");
  return createTRPCContext({ headers: heads });
});

export const api = createCaller(createContext);
