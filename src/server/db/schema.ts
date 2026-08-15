import { relations } from "drizzle-orm";
import {
  index,
  pgSchema,
  primaryKey,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

/**
 * Isolated Postgres schema + table prefix for shared Neon database.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const resurexiSchema = pgSchema("resurexi");

export const siteContentKeyEnum = resurexiSchema.enum("site_content_key", [
  "hero",
  "about_preview",
  "contact_info",
]);

const cuid = () => createId();

export const categories = resurexiSchema.table(
  "_resurexi_category",
  (d) => ({
    id: d.varchar({ length: 128 }).primaryKey().$defaultFn(cuid),
    name: d.varchar({ length: 256 }).notNull(),
    slug: d.varchar({ length: 256 }).notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
  }),
  (t) => [uniqueIndex("category_slug_idx").on(t.slug)],
);

export const works = resurexiSchema.table(
  "_resurexi_work",
  (d) => ({
    id: d.varchar({ length: 128 }).primaryKey().$defaultFn(cuid),
    slug: d.varchar({ length: 256 }).notNull(),
    title: d.varchar({ length: 512 }).notNull(),
    subtitle: d.varchar({ length: 512 }),
    description: d.text().notNull().default(""),
    coverImageUrl: d.varchar({ length: 2048 }).notNull(),
    coverIsAnimated: d.boolean().notNull().default(false),
    featured: d.boolean().notNull().default(false),
    hidden: d.boolean().notNull().default(true),
    metaTitle: d.varchar({ length: 512 }),
    metaDescription: d.text(),
    ogImageUrl: d.varchar({ length: 2048 }),
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date())
      .notNull(),
  }),
  (t) => [uniqueIndex("work_slug_idx").on(t.slug)],
);

export const workCategories = resurexiSchema.table(
  "_resurexi_work_category",
  (d) => ({
    workId: d
      .varchar({ length: 128 })
      .notNull()
      .references(() => works.id, { onDelete: "cascade" }),
    categoryId: d
      .varchar({ length: 128 })
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  }),
  (t) => [primaryKey({ columns: [t.workId, t.categoryId] })],
);

export const workGalleryImages = resurexiSchema.table(
  "_resurexi_work_gallery_image",
  (d) => ({
    id: d.varchar({ length: 128 }).primaryKey().$defaultFn(cuid),
    workId: d
      .varchar({ length: 128 })
      .notNull()
      .references(() => works.id, { onDelete: "cascade" }),
    url: d.varchar({ length: 2048 }).notNull(),
    alt: d.varchar({ length: 512 }),
    order: d.integer().notNull().default(0),
    isAnimated: d.boolean().notNull().default(false),
  }),
  (t) => [index("work_gallery_image_work_id_idx").on(t.workId)],
);

export const workYoutubeVideos = resurexiSchema.table(
  "_resurexi_work_youtube_video",
  (d) => ({
    id: d.varchar({ length: 128 }).primaryKey().$defaultFn(cuid),
    workId: d
      .varchar({ length: 128 })
      .notNull()
      .references(() => works.id, { onDelete: "cascade" }),
    url: d.varchar({ length: 2048 }).notNull(),
    order: d.integer().notNull().default(0),
  }),
  (t) => [index("work_youtube_video_work_id_idx").on(t.workId)],
);

export const blogPosts = resurexiSchema.table(
  "_resurexi_blog_post",
  (d) => ({
    id: d.varchar({ length: 128 }).primaryKey().$defaultFn(cuid),
    slug: d.varchar({ length: 256 }).notNull(),
    title: d.varchar({ length: 512 }).notNull(),
    subtitle: d.varchar({ length: 512 }),
    coverImageUrl: d.varchar({ length: 2048 }),
    content: d.text().notNull().default(""),
    isMain: d.boolean().notNull().default(false),
    hidden: d.boolean().notNull().default(true),
    metaTitle: d.varchar({ length: 512 }),
    metaDescription: d.text(),
    ogImageUrl: d.varchar({ length: 2048 }),
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date())
      .notNull(),
  }),
  (t) => [uniqueIndex("blog_post_slug_idx").on(t.slug)],
);

export const contactLinks = resurexiSchema.table("_resurexi_contact_link", (d) => ({
  id: d.varchar({ length: 128 }).primaryKey().$defaultFn(cuid),
  label: d.varchar({ length: 256 }).notNull(),
  url: d.varchar({ length: 2048 }).notNull(),
  iconUrl: d.varchar({ length: 2048 }),
  order: d.integer().notNull().default(0),
  createdAt: d
    .timestamp({ withTimezone: true })
    .$defaultFn(() => new Date())
    .notNull(),
}));

export const contactRequests = resurexiSchema.table("_resurexi_contact_request", (d) => ({
  id: d.varchar({ length: 128 }).primaryKey().$defaultFn(cuid),
  name: d.varchar({ length: 256 }).notNull(),
  company: d.varchar({ length: 256 }),
  email: d.varchar({ length: 320 }).notNull(),
  phone: d.varchar({ length: 64 }),
  message: d.text().notNull(),
  isRead: d.boolean().notNull().default(false),
  createdAt: d
    .timestamp({ withTimezone: true })
    .$defaultFn(() => new Date())
    .notNull(),
}));

export const siteContent = resurexiSchema.table(
  "_resurexi_site_content",
  (d) => ({
    id: d.varchar({ length: 128 }).primaryKey().$defaultFn(cuid),
    key: siteContentKeyEnum("key").notNull(),
    heroTitle: d.varchar({ length: 512 }),
    heroSubtitle: d.varchar({ length: 1024 }),
    heroGifUrl: d.varchar({ length: 2048 }),
    heroWireframeUrl: d.varchar({ length: 2048 }),
    heroWireframeColorUrl: d.varchar({ length: 2048 }),
    aboutPreviewTitle: d.varchar({ length: 512 }),
    aboutPreviewText: d.text(),
    aboutPreviewImageUrl: d.varchar({ length: 2048 }),
    contactEmail: d.varchar({ length: 320 }),
    responseTimeText: d.varchar({ length: 512 }),
    basedInText: d.varchar({ length: 512 }),
    updatedAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date())
      .notNull(),
  }),
  (t) => [uniqueIndex("site_content_key_idx").on(t.key)],
);

export const categoriesRelations = relations(categories, ({ many }) => ({
  workCategories: many(workCategories),
}));

export const worksRelations = relations(works, ({ many }) => ({
  workCategories: many(workCategories),
  galleryImages: many(workGalleryImages),
  youtubeVideos: many(workYoutubeVideos),
}));

export const workCategoriesRelations = relations(workCategories, ({ one }) => ({
  work: one(works, {
    fields: [workCategories.workId],
    references: [works.id],
  }),
  category: one(categories, {
    fields: [workCategories.categoryId],
    references: [categories.id],
  }),
}));

export const workGalleryImagesRelations = relations(
  workGalleryImages,
  ({ one }) => ({
    work: one(works, {
      fields: [workGalleryImages.workId],
      references: [works.id],
    }),
  }),
);

export const workYoutubeVideosRelations = relations(
  workYoutubeVideos,
  ({ one }) => ({
    work: one(works, {
      fields: [workYoutubeVideos.workId],
      references: [works.id],
    }),
  }),
);
