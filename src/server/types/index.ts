import { z } from "zod";

export type { Profile } from "@/server/db/types";

export const upsertProfileInput = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(32)
    .regex(/^[a-zA-Z0-9_]+$/, "Letters, numbers and underscores only"),
  bio: z.string().max(280).optional(),
});

export type UpsertProfileInput = z.infer<typeof upsertProfileInput>;

export const listProfilesInput = z
  .object({ limit: z.number().int().min(1).max(100).default(20) })
  .optional();

export type ListProfilesInput = z.infer<typeof listProfilesInput>;
