import type { Selectable } from "kysely";

import { db } from "@/server/db";
import type { Profile } from "@/server/db/types";
import type { UpsertProfileInput } from "@/server/types";

export type ProfileRow = Selectable<Profile>;

export abstract class ProfileModel {
    public static async get(id: string): Promise<ProfileRow | null> {
        const row = await db
            .selectFrom("profiles")
            .selectAll()
            .where("id", "=", id)
            .executeTakeFirst();

        return row ?? null;
    }

    public static async getMany(
        limit: number
    ): Promise<Pick<ProfileRow, "id" | "username" | "bio" | "created_at">[]> {
        return db
            .selectFrom("profiles")
            .select(["id", "username", "bio", "created_at"])
            .orderBy("created_at", "desc")
            .limit(limit)
            .execute();
    }

    public static async create(data: {
        id: string;
        email: string | null;
    }): Promise<void> {
        await db
            .insertInto("profiles")
            .values(data)
            .onConflict((oc) => oc.column("id").doNothing())
            .execute();
    }

    public static async upsert(
        data: { id: string; email: string | null } & UpsertProfileInput
    ): Promise<ProfileRow> {
        const now = new Date();

        return db
            .insertInto("profiles")
            .values({
                id: data.id,
                email: data.email,
                username: data.username,
                bio: data.bio ?? null,
                updated_at: now,
            })
            .onConflict((oc) =>
                oc.column("id").doUpdateSet({
                    username: data.username,
                    bio: data.bio ?? null,
                    email: data.email,
                    updated_at: now,
                })
            )
            .returningAll()
            .executeTakeFirstOrThrow();
    }

    public static async delete(id: string): Promise<void> {
        await db.deleteFrom("profiles").where("id", "=", id).execute();
    }
}
