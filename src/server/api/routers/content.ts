import { eq } from "drizzle-orm";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  aboutPreviewUpdateSchema,
  contactInfoUpdateSchema,
  heroUpdateSchema,
} from "~/server/api/schemas";
import { siteContent } from "~/server/db/schema";
import type { db } from "~/server/db";

type Db = typeof db;
type SiteContentKey = "hero" | "about_preview" | "contact_info";

async function getContentByKey(database: Db, key: SiteContentKey) {
  return database.query.siteContent.findFirst({
    where: eq(siteContent.key, key),
  });
}

async function upsertContentByKey(
  database: Db,
  key: SiteContentKey,
  values: Partial<typeof siteContent.$inferInsert>,
) {
  const existing = await getContentByKey(database, key);

  if (existing) {
    const [updated] = await database
      .update(siteContent)
      .set(values)
      .where(eq(siteContent.id, existing.id))
      .returning();

    return updated;
  }

  const [created] = await database
    .insert(siteContent)
    .values({
      key,
      ...values,
    })
    .returning();

  return created;
}

export const contentRouter = createTRPCRouter({
  getHero: publicProcedure.query(async ({ ctx }) => {
    const content = await getContentByKey(ctx.db, "hero");
    return content ?? null;
  }),

  getAboutPreview: publicProcedure.query(async ({ ctx }) => {
    const content = await getContentByKey(ctx.db, "about_preview");
    return content ?? null;
  }),

  getContactInfo: publicProcedure.query(async ({ ctx }) => {
    const content = await getContentByKey(ctx.db, "contact_info");

    if (!content) {
      return {
        contactEmail: null,
        responseTimeText: null,
        basedInText: null,
      };
    }

    return {
      contactEmail: content.contactEmail,
      responseTimeText: content.responseTimeText,
      basedInText: content.basedInText,
    };
  }),

  updateHero: protectedProcedure
    .input(heroUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      return upsertContentByKey(ctx.db, "hero", input);
    }),

  updateAboutPreview: protectedProcedure
    .input(aboutPreviewUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      return upsertContentByKey(ctx.db, "about_preview", input);
    }),

  updateContactInfo: protectedProcedure
    .input(contactInfoUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      return upsertContentByKey(ctx.db, "contact_info", input);
    }),

  ensureDefaults: protectedProcedure.mutation(async ({ ctx }) => {
    const keys: SiteContentKey[] = ["hero", "about_preview", "contact_info"];

    for (const key of keys) {
      const existing = await getContentByKey(ctx.db, key);

      if (!existing) {
        await upsertContentByKey(ctx.db, key, {});
      }
    }

    return { ok: true as const };
  }),
});
