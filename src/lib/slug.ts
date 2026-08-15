import { and, eq, ne } from "drizzle-orm";
import slugifyLib from "slugify";

import { db } from "~/server/db";
import { blogPosts, categories, works } from "~/server/db/schema";

export function slugify(text: string): string {
  return slugifyLib(text, {
    lower: true,
    strict: true,
    locale: "ru",
  });
}

type SlugEntity = "work" | "blogPost" | "category";

async function slugExists(
  entity: SlugEntity,
  slug: string,
  excludeId?: string,
): Promise<boolean> {
  if (entity === "work") {
    const existing = await db.query.works.findFirst({
      where: excludeId
        ? and(eq(works.slug, slug), ne(works.id, excludeId))
        : eq(works.slug, slug),
      columns: { id: true },
    });
    return !!existing;
  }

  if (entity === "blogPost") {
    const existing = await db.query.blogPosts.findFirst({
      where: excludeId
        ? and(eq(blogPosts.slug, slug), ne(blogPosts.id, excludeId))
        : eq(blogPosts.slug, slug),
      columns: { id: true },
    });
    return !!existing;
  }

  const existing = await db.query.categories.findFirst({
    where: excludeId
      ? and(eq(categories.slug, slug), ne(categories.id, excludeId))
      : eq(categories.slug, slug),
    columns: { id: true },
  });
  return !!existing;
}

export async function ensureUniqueSlug(
  entity: SlugEntity,
  baseSlug: string,
  excludeId?: string,
): Promise<string> {
  let candidate = baseSlug;
  let suffix = 2;

  while (await slugExists(entity, candidate, excludeId)) {
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

export async function assertSlugAvailable(
  entity: SlugEntity,
  slug: string,
  excludeId?: string,
): Promise<void> {
  if (await slugExists(entity, slug, excludeId)) {
    throw new Error("SLUG_CONFLICT");
  }
}
