import { api } from "@/trpc/server";
import Link from "next/link";

const STACK = [
    { name: "Next.js", role: "App Router + React framework" },
    { name: "Tailwind CSS", role: "Styling" },
    { name: "tRPC", role: "Type-safe API layer" },
    { name: "Prisma", role: "Schema & migrations" },
    { name: "Kysely", role: "Type-safe SQL queries" },
    { name: "Zod", role: "Validation in routers" },
    { name: "Supabase Auth", role: "Authentication" },
    { name: "Supabase Postgres", role: "Database" },
];

export default async function Home() {
    const profiles = await api.profile.list({ limit: 5 });

    return (
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-16">
            <section className="max-w-2xl">
                <span className="inline-flex rounded-full border border-black/10 px-3 py-1 text-xs font-medium text-zinc-500 dark:border-white/15">
                    end-to-end type safe
                </span>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                    vibe-app
                </h1>
                <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">
                    A Next.js starter wired with tRPC, Prisma (schema), Kysely
                    (queries), Zod (validation) and Supabase (auth + Postgres).
                </p>
                <div className="mt-6 flex gap-3">
                    <Link
                        href="/dashboard"
                        className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                    >
                        Go to dashboard
                    </Link>
                    <Link
                        href="/login"
                        className="rounded-lg border border-black/10 px-4 py-2.5 text-sm font-medium hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
                    >
                        Sign in
                    </Link>
                </div>
            </section>

            <section className="mt-14">
                <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
                    The stack
                </h2>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {STACK.map((item) => (
                        <div
                            key={item.name}
                            className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-950"
                        >
                            <p className="font-medium">{item.name}</p>
                            <p className="mt-1 text-sm text-zinc-500">
                                {item.role}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mt-14">
                <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
                    Recent profiles
                </h2>

                {profiles && profiles.length === 0 ? (
                    <p className="mt-4 text-sm text-zinc-500">
                        No profiles yet. Sign in and create yours from the
                        dashboard.
                    </p>
                ) : (
                    <ul className="mt-4 divide-y divide-black/5 rounded-xl border border-black/10 dark:divide-white/5 dark:border-white/10">
                        {profiles?.map((profile) => (
                            <li
                                key={profile.id}
                                className="flex flex-col gap-0.5 p-4"
                            >
                                <span className="font-medium">
                                    @{profile.username ?? "anonymous"}
                                </span>
                                {profile.bio && (
                                    <span className="text-sm text-zinc-500">
                                        {profile.bio}
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </main>
    );
}
