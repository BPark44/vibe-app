import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { createTRPCContext } from "@/server/trpc/context";
import { createCaller } from "@/server/trpc/root";

/**
 * OAuth / magic-link callback. Exchanges the `code` for a session and then
 * redirects to the originally requested page (or the home page).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Ensure a profile row exists for the newly confirmed user.
      try {
        const ctx = await createTRPCContext({ headers: request.headers });
        const caller = createCaller(ctx);
        await caller.profile.ensureExists();
      } catch {
        // Non-fatal — the dashboard will handle missing profiles gracefully.
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
