import { z } from "zod";

export const youtubeUrlSchema = z
  .string()
  .url()
  .max(2048)
  .refine(
    (url) =>
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)/.test(url),
    { message: "Must be a valid YouTube URL" },
  );

export const contactRequestSchema = z.object({
  name: z.string().min(1).max(256),
  email: z.string().email().max(320),
  company: z.string().max(256).optional(),
  phone: z.string().max(64).optional(),
  message: z.string().min(1),
});

export const galleryImageInputSchema = z.object({
  url: z.string().url().max(2048),
  alt: z.string().max(512).optional(),
  order: z.number().int().min(0).default(0),
  isAnimated: z.boolean().default(false),
});

export const youtubeVideoInputSchema = z.object({
  url: youtubeUrlSchema,
  order: z.number().int().min(0).default(0),
});

export const workCreateSchema = z.object({
  title: z.string().min(1).max(512),
  slug: z.string().min(1).max(256).optional(),
  subtitle: z.string().max(512).optional(),
  description: z.string().default(""),
  coverImageUrl: z.string().url().max(2048),
  coverIsAnimated: z.boolean().default(false),
  featured: z.boolean().default(false),
  hidden: z.boolean().default(true),
  metaTitle: z.string().max(512).optional(),
  metaDescription: z.string().optional(),
  ogImageUrl: z.string().url().max(2048).optional(),
  categoryIds: z.array(z.string()).default([]),
  galleryImages: z.array(galleryImageInputSchema).default([]),
  youtubeVideos: z.array(youtubeVideoInputSchema).default([]),
});

export const workUpdateSchema = workCreateSchema.partial().extend({
  id: z.string(),
});

export const blogCreateSchema = z.object({
  title: z.string().min(1).max(512),
  slug: z.string().min(1).max(256).optional(),
  subtitle: z.string().max(512).optional(),
  coverImageUrl: z.string().url().max(2048).optional(),
  content: z.string().default(""),
  isMain: z.boolean().default(false),
  hidden: z.boolean().default(true),
  metaTitle: z.string().max(512).optional(),
  metaDescription: z.string().optional(),
  ogImageUrl: z.string().url().max(2048).optional(),
});

export const blogUpdateSchema = blogCreateSchema.partial().extend({
  id: z.string(),
});

export const categoryCreateSchema = z.object({
  name: z.string().min(1).max(256),
  slug: z.string().min(1).max(256).optional(),
});

export const categoryUpdateSchema = categoryCreateSchema.partial().extend({
  id: z.string(),
});

export const contactLinkCreateSchema = z.object({
  label: z.string().min(1).max(256),
  url: z.string().url().max(2048),
  iconUrl: z.string().url().max(2048).optional(),
  order: z.number().int().min(0).default(0),
});

export const contactLinkUpdateSchema = z.object({
  id: z.string(),
  label: z.string().min(1).max(256).optional(),
  url: z.string().url().max(2048).optional(),
  iconUrl: z.string().url().max(2048).nullable().optional(),
  order: z.number().int().min(0).optional(),
});

export const reorderLinksSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      order: z.number().int().min(0),
    }),
  ),
});

export const heroUpdateSchema = z.object({
  heroTitle: z.string().max(512).nullish(),
  heroSubtitle: z.string().max(1024).nullish(),
  heroGifUrl: z.string().url().max(2048).nullish(),
  heroWireframeUrl: z.string().url().max(2048).nullish(),
  heroWireframeColorUrl: z.string().url().max(2048).nullish(),
});

export const aboutPreviewUpdateSchema = z.object({
  aboutPreviewTitle: z.string().max(512).nullish(),
  aboutPreviewText: z.string().nullish(),
  aboutPreviewImageUrl: z.string().url().max(2048).nullish(),
});

export const contactInfoUpdateSchema = z.object({
  contactEmail: z.string().email().max(320).nullish(),
  responseTimeText: z.string().max(512).nullish(),
  basedInText: z.string().max(512).nullish(),
});
