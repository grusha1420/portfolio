import { TRPCError } from "@trpc/server";
import { asc, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  contactLinkCreateSchema,
  contactLinkUpdateSchema,
  contactRequestSchema,
  reorderLinksSchema,
} from "~/server/api/schemas";
import { contactLinks, contactRequests } from "~/server/db/schema";

export const contactRouter = createTRPCRouter({
  getLinks: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.contactLinks.findMany({
      orderBy: asc(contactLinks.order),
    });
  }),

  submitRequest: publicProcedure
    .input(contactRequestSchema)
    .mutation(async ({ ctx, input }) => {
      const [created] = await ctx.db
        .insert(contactRequests)
        .values({
          name: input.name,
          email: input.email,
          company: input.company,
          phone: input.phone,
          message: input.message,
        })
        .returning();

      return created;
    }),

  listRequests: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.contactRequests.findMany({
      orderBy: desc(contactRequests.createdAt),
    });
  }),

  getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
    const [result] = await ctx.db
      .select({ count: sql<number>`count(*)::int` })
      .from(contactRequests)
      .where(eq(contactRequests.isRead, false));

    return result?.count ?? 0;
  }),

  markRequestRead: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.contactRequests.findFirst({
        where: eq(contactRequests.id, input.id),
        columns: { id: true },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Contact request not found",
        });
      }

      const [updated] = await ctx.db
        .update(contactRequests)
        .set({ isRead: true })
        .where(eq(contactRequests.id, input.id))
        .returning();

      return updated;
    }),

  createLink: protectedProcedure
    .input(contactLinkCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const [created] = await ctx.db
        .insert(contactLinks)
        .values({
          label: input.label,
          url: input.url,
          iconUrl: input.iconUrl,
          order: input.order,
        })
        .returning();

      return created;
    }),

  updateLink: protectedProcedure
    .input(contactLinkUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.contactLinks.findFirst({
        where: eq(contactLinks.id, input.id),
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Contact link not found",
        });
      }

      const updatePayload: {
        label?: string;
        url?: string;
        iconUrl?: string | null;
        order?: number;
      } = {};

      if (input.label !== undefined) {
        updatePayload.label = input.label;
      }
      if (input.url !== undefined) {
        updatePayload.url = input.url;
      }
      if (input.iconUrl !== undefined) {
        updatePayload.iconUrl = input.iconUrl;
      }
      if (input.order !== undefined) {
        updatePayload.order = input.order;
      }

      const [updated] = await ctx.db
        .update(contactLinks)
        .set(updatePayload)
        .where(eq(contactLinks.id, input.id))
        .returning();

      return updated;
    }),

  deleteLink: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.contactLinks.findFirst({
        where: eq(contactLinks.id, input.id),
        columns: { id: true },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Contact link not found",
        });
      }

      await ctx.db.delete(contactLinks).where(eq(contactLinks.id, input.id));

      return { success: true };
    }),

  reorderLinks: protectedProcedure
    .input(reorderLinksSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        for (const item of input.items) {
          await tx
            .update(contactLinks)
            .set({ order: item.order })
            .where(eq(contactLinks.id, item.id));
        }
      });

      return { success: true };
    }),
});
