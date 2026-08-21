import { TRPCError } from "@trpc/server";
import { and, asc, desc, eq, inArray, max } from "drizzle-orm";
import { z } from "zod";

import { ensureUniqueSlug, slugify } from "~/lib/slug";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import type { galleryImageInputSchema, youtubeVideoInputSchema } from "~/server/api/schemas";
import {
  reorderItemsSchema,
  workCreateSchema,
  workUpdateSchema,
} from "~/server/api/schemas";
import type { db } from "~/server/db";
import {
  categories,
  workCategories,
  workGalleryImages,
  works,
  workYoutubeVideos,
} from "~/server/db/schema";

type Db = typeof db;

const workWithRelations = {
  workCategories: {
    with: {
      category: true,
    },
  },
  galleryImages: {
    orderBy: asc(workGalleryImages.order),
  },
  youtubeVideos: {
    orderBy: asc(workYoutubeVideos.order),
  },
} as const;

type WorkWithRelationsRow = typeof works.$inferSelect & {
  workCategories: { category: (typeof categories)["$inferSelect"] }[];
  galleryImages: (typeof workGalleryImages)["$inferSelect"][];
  youtubeVideos: (typeof workYoutubeVideos)["$inferSelect"][];
};

function mapWork(work: WorkWithRelationsRow) {
  const { workCategories: wc, ...rest } = work;
  return {
    ...rest,
    categories: wc.map((item) => item.category),
  };
}

async function resolveWorkSlug(
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
    const unique = await ensureUniqueSlug("work", base, excludeId);
    if (unique !== base) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Work with this slug already exists",
      });
    }
    return base;
  }

  return ensureUniqueSlug("work", base, excludeId);
}

async function syncWorkRelations(
  database: Db,
  workId: string,
  categoryIds: string[],
  galleryImages: z.infer<typeof galleryImageInputSchema>[],
  youtubeVideos: z.infer<typeof youtubeVideoInputSchema>[],
) {
  await database.delete(workCategories).where(eq(workCategories.workId, workId));
  await database
    .delete(workGalleryImages)
    .where(eq(workGalleryImages.workId, workId));
  await database
    .delete(workYoutubeVideos)
    .where(eq(workYoutubeVideos.workId, workId));

  if (categoryIds.length > 0) {
    await database.insert(workCategories).values(
      categoryIds.map((categoryId) => ({
        workId,
        categoryId,
      })),
    );
  }

  if (galleryImages.length > 0) {
    await database.insert(workGalleryImages).values(
      galleryImages.map((image) => ({
        workId,
        url: image.url,
        alt: image.alt,
        order: image.order,
        isAnimated: image.isAnimated,
      })),
    );
  }

  if (youtubeVideos.length > 0) {
    await database.insert(workYoutubeVideos).values(
      youtubeVideos.map((video) => ({
        workId,
        url: video.url,
        order: video.order,
      })),
    );
  }
}

export const worksRouter = createTRPCRouter({
  listPublic: publicProcedure
    .input(z.object({ featured: z.boolean().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const rows = await ctx.db.query.works.findMany({
        where: and(
          eq(works.hidden, false),
          input?.featured !== undefined
            ? eq(works.featured, input.featured)
            : undefined,
        ),
        with: workWithRelations,
        orderBy: [asc(works.order), desc(works.createdAt)],
      });

      return rows.map(mapWork);
    }),

  listFeatured: publicProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db.query.works.findMany({
      where: and(eq(works.featured, true), eq(works.hidden, false)),
      with: workWithRelations,
      orderBy: [asc(works.order), desc(works.createdAt)],
    });

    return rows.map(mapWork);
  }),

  listAll: publicProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db.query.works.findMany({
      where: eq(works.hidden, false),
      with: workWithRelations,
      orderBy: [asc(works.order), desc(works.createdAt)],
    });

    return rows.map(mapWork);
  }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const work = await ctx.db.query.works.findFirst({
        where: eq(works.slug, input.slug),
        with: workWithRelations,
      });

      if (!work) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Work not found",
        });
      }

      return mapWork(work);
    }),

  listForAdmin: protectedProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db.query.works.findMany({
      with: workWithRelations,
      orderBy: [asc(works.order), desc(works.createdAt)],
    });

    return rows.map(mapWork);
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const work = await ctx.db.query.works.findFirst({
        where: eq(works.id, input.id),
        with: workWithRelations,
      });

      if (!work) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Work not found",
        });
      }

      return mapWork(work);
    }),

  create: protectedProcedure
    .input(workCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const slug = await resolveWorkSlug(input.title, input.slug);

      if (input.categoryIds.length > 0) {
        const found = await ctx.db.query.categories.findMany({
          where: inArray(categories.id, input.categoryIds),
          columns: { id: true },
        });
        if (found.length !== input.categoryIds.length) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "One or more categories not found",
          });
        }
      }

      const [maxOrderRow] = await ctx.db
        .select({ value: max(works.order) })
        .from(works);

      const [created] = await ctx.db
        .insert(works)
        .values({
          slug,
          title: input.title,
          subtitle: input.subtitle,
          description: input.description,
          coverImageUrl: input.coverImageUrl,
          coverIsAnimated: input.coverIsAnimated,
          featured: input.featured,
          hidden: input.hidden,
          order: (maxOrderRow?.value ?? -1) + 1,
          metaTitle: input.metaTitle,
          metaDescription: input.metaDescription,
          ogImageUrl: input.ogImageUrl,
        })
        .returning();

      if (!created) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create work",
        });
      }

      await syncWorkRelations(
        ctx.db,
        created.id,
        input.categoryIds,
        input.galleryImages,
        input.youtubeVideos,
      );

      const work = await ctx.db.query.works.findFirst({
        where: eq(works.id, created.id),
        with: workWithRelations,
      });

      if (!work) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to load created work",
        });
      }

      return mapWork(work);
    }),

  update: protectedProcedure
    .input(workUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.works.findFirst({
        where: eq(works.id, input.id),
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Work not found",
        });
      }

      const title = input.title ?? existing.title;
      const slug = await resolveWorkSlug(title, input.slug ?? existing.slug, input.id);

      if (input.categoryIds && input.categoryIds.length > 0) {
        const found = await ctx.db.query.categories.findMany({
          where: inArray(categories.id, input.categoryIds),
          columns: { id: true },
        });
        if (found.length !== input.categoryIds.length) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "One or more categories not found",
          });
        }
      }

      await ctx.db
        .update(works)
        .set({
          slug,
          title: input.title,
          subtitle: input.subtitle,
          description: input.description,
          coverImageUrl: input.coverImageUrl,
          coverIsAnimated: input.coverIsAnimated,
          featured: input.featured,
          hidden: input.hidden,
          metaTitle: input.metaTitle,
          metaDescription: input.metaDescription,
          ogImageUrl: input.ogImageUrl,
        })
        .where(eq(works.id, input.id));

      if (
        input.categoryIds !== undefined ||
        input.galleryImages !== undefined ||
        input.youtubeVideos !== undefined
      ) {
        const current = await ctx.db.query.works.findFirst({
          where: eq(works.id, input.id),
          with: workWithRelations,
        });

        await syncWorkRelations(
          ctx.db,
          input.id,
          input.categoryIds ??
            current?.workCategories.map((wc) => wc.categoryId) ??
            [],
          input.galleryImages ??
            current?.galleryImages.map((image) => ({
              url: image.url,
              alt: image.alt ?? undefined,
              order: image.order,
              isAnimated: image.isAnimated,
            })) ??
            [],
          input.youtubeVideos ??
            current?.youtubeVideos.map((video) => ({
              url: video.url,
              order: video.order,
            })) ??
            [],
        );
      }

      const work = await ctx.db.query.works.findFirst({
        where: eq(works.id, input.id),
        with: workWithRelations,
      });

      if (!work) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Work not found",
        });
      }

      return mapWork(work);
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.works.findFirst({
        where: eq(works.id, input.id),
        columns: { id: true },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Work not found",
        });
      }

      await ctx.db.delete(works).where(eq(works.id, input.id));

      return { success: true };
    }),

  reorder: protectedProcedure
    .input(reorderItemsSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        for (const item of input.items) {
          await tx
            .update(works)
            .set({ order: item.order })
            .where(eq(works.id, item.id));
        }
      });

      return { success: true };
    }),
});
