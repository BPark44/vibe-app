import { ProfileController } from "@/server/controllers";
import { listProfilesInput, upsertProfileInput } from "@/server/types";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const profileRouter = createTRPCRouter({
    ensureExists: protectedProcedure.mutation(({ ctx }) =>
        ProfileController.ensureExists(ctx.user.id, ctx.user.email ?? null)
    ),

    me: protectedProcedure.query(({ ctx }) =>
        ProfileController.getMe(ctx.user.id)
    ),

    list: publicProcedure
        .input(listProfilesInput)
        .query(({ input }) => ProfileController.list(input)),

    upsert: protectedProcedure
        .input(upsertProfileInput)
        .mutation(({ ctx, input }) =>
            ProfileController.upsert(ctx.user.id, ctx.user.email ?? null, input)
        ),

    delete: protectedProcedure.mutation(({ ctx }) =>
        ProfileController.deleteMe(ctx.user.id)
    ),
});
