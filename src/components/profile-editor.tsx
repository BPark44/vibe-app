"use client";

import { useState } from "react";

import { api } from "@/trpc/react";

export function ProfileEditor() {
    const utils = api.useUtils();

    const { data: profile, isLoading } = api.profile.me.useQuery();

    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");

    const [syncedId, setSyncedId] = useState<string | null>(null);
    if (profile && profile.id !== syncedId) {
        setSyncedId(profile.id);
        setUsername(profile.username ?? "");
        setBio(profile.bio ?? "");
    }

    const {
        mutateAsync: upsertProfile,
        isPending,
        isSuccess,
        error,
    } = api.profile.upsert.useMutation({
        onSuccess: () => {
            void utils.profile.me.invalidate();
            void utils.profile.list.invalidate();
        },
    });

    const fieldErrors = error?.data?.zodError?.fieldErrors as
        | Record<string, string[] | undefined>
        | undefined;

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        await upsertProfile({ username, bio: bio || undefined });
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-950"
        >
            <h2 className="text-lg font-semibold">Your profile</h2>

            <p className="mt-1 text-sm text-zinc-500">
                Stored in Postgres via Kysely, validated with Zod through tRPC.
            </p>

            <div className="mt-6 flex flex-col gap-4">
                <label className="flex flex-col gap-1 text-sm font-medium">
                    Username
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="ada_lovelace"
                        disabled={isLoading}
                        className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-base outline-none focus:border-zinc-500 dark:border-white/15"
                    />
                    {fieldErrors?.username && (
                        <span className="text-xs text-red-600 dark:text-red-400">
                            {fieldErrors.username[0]}
                        </span>
                    )}
                </label>

                <label className="flex flex-col gap-1 text-sm font-medium">
                    Bio
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="A short bio…"
                        rows={3}
                        disabled={isLoading}
                        className="resize-none rounded-lg border border-black/10 bg-transparent px-3 py-2 text-base outline-none focus:border-zinc-500 dark:border-white/15"
                    />
                    {fieldErrors?.bio && (
                        <span className="text-xs text-red-600 dark:text-red-400">
                            {fieldErrors.bio[0]}
                        </span>
                    )}
                </label>

                {error && !fieldErrors && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                        {error.message}
                    </p>
                )}
                {isSuccess && (
                    <p className="text-sm text-emerald-600 dark:text-emerald-400">
                        Profile saved.
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isPending || isLoading}
                    className="self-start rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-60 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                    {isPending ? "Saving…" : "Save profile"}
                </button>
            </div>
        </form>
    );
}
