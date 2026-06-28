import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

export async function SiteHeader() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <header className="sticky top-0 z-10 border-b border-black/10 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-black/60">
            <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
                <Link href="/" className="font-semibold tracking-tight">
                    vibe<span className="text-zinc-400">/app</span>
                </Link>

                <nav className="flex items-center gap-4 text-sm">
                    <Link
                        href="/dashboard"
                        className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
                    >
                        Dashboard
                    </Link>

                    {user ? (
                        <div className="flex items-center gap-3">
                            <span className="hidden text-zinc-500 sm:inline">
                                {user.email}
                            </span>

                            <form action="/auth/signout" method="post">
                                <button
                                    type="submit"
                                    className="rounded-lg border border-black/10 px-3 py-1.5 font-medium transition-colors hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
                                >
                                    Sign out
                                </button>
                            </form>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="rounded-lg bg-zinc-900 px-3 py-1.5 font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                        >
                            Sign in
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}
