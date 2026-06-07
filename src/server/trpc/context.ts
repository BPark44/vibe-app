import { createClient } from "@/lib/supabase/server";
import { db } from "@/server/db";

/**
 * Builds the context available to every tRPC procedure.
 *
 * Reused by both the API route handler and the server-side caller, so it only
 * depends on `headers`. The Supabase user (if any) is resolved here, making
 * `ctx.user` the single source of truth for auth in routers.
 */
export async function createTRPCContext(opts: { headers: Headers }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return {
    db,
    supabase,
    user,
    headers: opts.headers,
  };
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
