import { TRPCError } from "@trpc/server";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";

import { ensureUniqueSlug, slugify } from "~/lib/slug";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  categoryCreateSchema,
  categoryUpdateSchema,
} from "~/server/api/schemas";
import { categories, workCategories } from "~/server/db/schema";

async function resolveCategorySlug(
  name: string,
  explicitSlug?: string,
  excludeId?: string,
): Promise<string> {
  const base = slugify(explicitSlug ?? name);
  if (!base) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Unable to generate slug from name",
    });
  }

  if (explicitSlug) {
    const unique = await ensureUniqueSlug("category", base, excludeId);
    if (unique !== base) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Category with this slug already exists",
      });
    }
    return base;
  }

  return ensureUniqueSlug("category", base, excludeId);
}

export const categoriesRouter = createTRPCRouter({
  listPublic: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.categories.findMany({
      orderBy: asc(categories.name),
    });
  }),

  listForAdmin: protectedProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db.query.categories.findMany({
      orderBy: asc(categories.name),
      with: {
        workCategories: {
          columns: { workId: true },
        },
      },
    });

    return rows.map(({ workCategories: links, ...category }) => ({
      ...category,
      workCount: links.length,
    }));
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const category = await ctx.db.query.categories.findFirst({
        where: eq(categories.id, input.id),
      });

      if (!category) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      return category;
    }),

  create: protectedProcedure
    .input(categoryCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const slug = await resolveCategorySlug(input.name, input.slug);

      const [created] = await ctx.db
        .insert(categories)
        .values({
          name: input.name,
          slug,
        })
        .returning();

      return created;
    }),

  update: protectedProcedure
    .input(categoryUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.categories.findFirst({
        where: eq(categories.id, input.id),
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      const name = input.name ?? existing.name;
      const slug = await resolveCategorySlug(
        name,
        input.slug ?? existing.slug,
        input.id,
      );

      const [updated] = await ctx.db
        .update(categories)
        .set({
          name: input.name,
          slug,
        })
        .where(eq(categories.id, input.id))
        .returning();

      return updated;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.categories.findFirst({
        where: eq(categories.id, input.id),
        columns: { id: true },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      const linkedWork = await ctx.db.query.workCategories.findFirst({
        where: eq(workCategories.categoryId, input.id),
        columns: { workId: true },
      });

      if (linkedWork) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message:
            "Cannot delete category that is assigned to works. Remove it from works first.",
        });
      }

      await ctx.db.delete(categories).where(eq(categories.id, input.id));

      return { success: true };
    }),
});
