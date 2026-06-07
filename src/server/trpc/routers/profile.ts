import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../trpc";

const upsertProfileInput = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(32)
    .regex(/^[a-zA-Z0-9_]+$/, "Letters, numbers and underscores only"),
  bio: z.string().max(280).optional(),
});

export const profileRouter = createTRPCRouter({
  /** The current user's profile row, or null if it doesn't exist yet. */
  me: protectedProcedure.query(async ({ ctx }) => {
    const profile = await ctx.db
      .selectFrom("profiles")
      .selectAll()
      .where("id", "=", ctx.user.id)
      .executeTakeFirst();

    return profile ?? null;
  }),

  /** Public directory of profiles. */
  list: publicProcedure
    .input(
      z
        .object({ limit: z.number().int().min(1).max(100).default(20) })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db
        .selectFrom("profiles")
        .select(["id", "username", "bio", "created_at"])
        .orderBy("created_at", "desc")
        .limit(input?.limit ?? 20)
        .execute();
    }),

  /** Create or update the current user's profile. */
  upsert: protectedProcedure
    .input(upsertProfileInput)
    .mutation(async ({ ctx, input }) => {
      const now = new Date();

      return ctx.db
        .insertInto("profiles")
        .values({
          id: ctx.user.id,
          email: ctx.user.email ?? null,
          username: input.username,
          bio: input.bio ?? null,
          updated_at: now,
        })
        .onConflict((oc) =>
          oc.column("id").doUpdateSet({
            username: input.username,
            bio: input.bio ?? null,
            email: ctx.user.email ?? null,
            updated_at: now,
          }),
        )
        .returningAll()
        .executeTakeFirstOrThrow();
    }),
});
