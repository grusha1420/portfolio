import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { env } from "~/env";
import {
  createSession,
  destroySession,
  safeComparePassword,
} from "~/server/auth";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const adminRouter = createTRPCRouter({
  login: publicProcedure
    .input(z.object({ password: z.string().min(1) }))
    .mutation(async ({ input }) => {
      if (!safeComparePassword(input.password, env.ADMIN_PASSWORD)) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid password",
        });
      }

      await createSession();
      return { success: true };
    }),

  logout: publicProcedure.mutation(async () => {
    await destroySession();
    return { success: true };
  }),

  getSession: publicProcedure.query(({ ctx }) => {
    return {
      isAdmin: ctx.session?.isAdmin ?? false,
    };
  }),
});
