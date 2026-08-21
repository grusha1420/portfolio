import { TRPCError } from "@trpc/server";
import { and, asc, desc, eq, max, ne } from "drizzle-orm";
import { z } from "zod";

import { ensureUniqueSlug, slugify } from "~/lib/slug";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  blogCreateSchema,
  blogUpdateSchema,
  reorderItemsSchema,
} from "~/server/api/schemas";
import { blogPosts } from "~/server/db/schema";
import type { db } from "~/server/db";

type Db = typeof db;

async function resolveBlogSlug(
  title: string,
  explicitSlug?: string,
  excludeId?: string,
): Promise<string> {
  const base = slugify(explicitSlug ?? title);
  if (!base) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Unable to generate slug from title",
    });
  }

  if (explicitSlug) {
    const unique = await ensureUniqueSlug("blogPost", base, excludeId);
    if (unique !== base) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Blog post with this slug already exists",
      });
    }
    return base;
  }

  return ensureUniqueSlug("blogPost", base, excludeId);
}

async function clearOtherMainPosts(database: Db, excludeId?: string) {
  await database
    .update(blogPosts)
    .set({ isMain: false })
    .where(
      excludeId
        ? and(eq(blogPosts.isMain, true), ne(blogPosts.id, excludeId))
        : eq(blogPosts.isMain, true),
    );
}

export const blogRouter = createTRPCRouter({
  getMain: publicProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.query.blogPosts.findFirst({
      where: and(eq(blogPosts.isMain, true), eq(blogPosts.hidden, false)),
    });

    return post ?? null;
  }),

  listPublic: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.blogPosts.findMany({
      where: and(eq(blogPosts.hidden, false), eq(blogPosts.isMain, false)),
      orderBy: [asc(blogPosts.order), desc(blogPosts.createdAt)],
    });
  }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.query.blogPosts.findFirst({
        where: eq(blogPosts.slug, input.slug),
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Blog post not found",
        });
      }

      return post;
    }),

  listForAdmin: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.blogPosts.findMany({
      orderBy: [asc(blogPosts.order), desc(blogPosts.createdAt)],
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.query.blogPosts.findFirst({
        where: eq(blogPosts.id, input.id),
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Blog post not found",
        });
      }

      return post;
    }),

  create: protectedProcedure
    .input(blogCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const slug = await resolveBlogSlug(input.title, input.slug);

      if (input.isMain) {
        await clearOtherMainPosts(ctx.db);
      }

      const [maxOrderRow] = await ctx.db
        .select({ value: max(blogPosts.order) })
        .from(blogPosts);

      const [created] = await ctx.db
        .insert(blogPosts)
        .values({
          slug,
          title: input.title,
          subtitle: input.subtitle,
          coverImageUrl: input.coverImageUrl,
          content: input.content,
          isMain: input.isMain,
          hidden: input.hidden,
          order: (maxOrderRow?.value ?? -1) + 1,
          metaTitle: input.metaTitle,
          metaDescription: input.metaDescription,
          ogImageUrl: input.ogImageUrl,
        })
        .returning();

      return created;
    }),

  update: protectedProcedure
    .input(blogUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.blogPosts.findFirst({
        where: eq(blogPosts.id, input.id),
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Blog post not found",
        });
      }

      const title = input.title ?? existing.title;
      const slug = await resolveBlogSlug(
        title,
        input.slug ?? existing.slug,
        input.id,
      );

      if (input.isMain) {
        await clearOtherMainPosts(ctx.db, input.id);
      }

      const [updated] = await ctx.db
        .update(blogPosts)
        .set({
          slug,
          title: input.title,
          subtitle: input.subtitle,
          coverImageUrl: input.coverImageUrl,
          content: input.content,
          isMain: input.isMain,
          hidden: input.hidden,
          metaTitle: input.metaTitle,
          metaDescription: input.metaDescription,
          ogImageUrl: input.ogImageUrl,
        })
        .where(eq(blogPosts.id, input.id))
        .returning();

      return updated;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.blogPosts.findFirst({
        where: eq(blogPosts.id, input.id),
        columns: { id: true },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Blog post not found",
        });
      }

      await ctx.db.delete(blogPosts).where(eq(blogPosts.id, input.id));

      return { success: true };
    }),

  reorder: protectedProcedure
    .input(reorderItemsSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        for (const item of input.items) {
          await tx
            .update(blogPosts)
            .set({ order: item.order })
            .where(eq(blogPosts.id, item.id));
        }
      });

      return { success: true };
    }),
});
