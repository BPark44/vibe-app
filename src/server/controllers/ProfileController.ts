import type { ProfileRow } from "@/server/models";
import { ProfileModel } from "@/server/models";
import type { ListProfilesInput, UpsertProfileInput } from "@/server/types";

export abstract class ProfileController {
    public static async ensureExists(
        userId: string,
        email: string | null
    ): Promise<void> {
        await ProfileModel.create({ id: userId, email });
    }

    public static async getMe(userId: string): Promise<ProfileRow | null> {
        return ProfileModel.get(userId);
    }

    public static async list(
        input: ListProfilesInput
    ): Promise<Pick<ProfileRow, "id" | "username" | "bio" | "created_at">[]> {
        return ProfileModel.getMany(input?.limit ?? 20);
    }

    public static async upsert(
        userId: string,
        email: string | null,
        input: UpsertProfileInput
    ): Promise<ProfileRow> {
        return ProfileModel.upsert({ id: userId, email, ...input });
    }

    public static async deleteMe(userId: string): Promise<void> {
        await ProfileModel.delete(userId);
    }
}
