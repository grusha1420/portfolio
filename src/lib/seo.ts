import { type Metadata } from "next";

import { env } from "~/env";

export const SITE_NAME = "astershape";
export const DEFAULT_SITE_DESCRIPTION = "3D model designer portfolio";
export const DEFAULT_OG_IMAGE = "/og-default.png";

export function getSiteUrl(): string {
  if (env.NEXT_PUBLIC_SITE_URL) {
    return env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

export function resolveMetaDescription(
  metaDescription: string | null | undefined,
  subtitle: string | null | undefined,
  content: string | null | undefined,
  fallback = DEFAULT_SITE_DESCRIPTION,
): string {
  const fromMeta = metaDescription?.trim();
  if (fromMeta) {
    return fromMeta;
  }

  const fromSubtitle = subtitle?.trim();
  if (fromSubtitle) {
    return fromSubtitle;
  }

  if (!content?.trim()) {
    return fallback;
  }

  const plain = content
    .replace(/[#>*_[\]()`-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!plain) {
    return fallback;
  }

  if (plain.length <= 160) {
    return plain;
  }

  return `${plain.slice(0, 157)}…`;
}

function resolveOgImage(ogImage?: string | null): string {
  const trimmed = ogImage?.trim();
  if (trimmed) {
    return trimmed;
  }

  return DEFAULT_OG_IMAGE;
}

export type BuildMetadataOptions = {
  title: string;
  description: string;
  path: string;
  ogImage?: string | null;
  ogImageAlt?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
};

export function buildMetadata({
  title,
  description,
  path,
  ogImage,
  ogImageAlt,
  type = "website",
  noIndex = false,
  publishedTime,
  modifiedTime,
}: BuildMetadataOptions): Metadata {
  const imageUrl = resolveOgImage(ogImage);
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;

  const openGraph: Metadata["openGraph"] = {
    title,
    description,
    type,
    url: canonicalPath,
    images: [{ url: imageUrl, alt: ogImageAlt ?? title }],
    ...(type === "article" && publishedTime
      ? { publishedTime }
      : undefined),
    ...(type === "article" && modifiedTime
      ? { modifiedTime }
      : undefined),
  };

  const metadata: Metadata = {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };

  if (noIndex) {
    metadata.robots = {
      index: false,
      follow: false,
    };
  }

  return metadata;
}

export function getStaticPageMetadata(
  title: string,
  path: string,
  description = DEFAULT_SITE_DESCRIPTION,
): Metadata {
  return buildMetadata({
    title,
    description,
    path,
  });
}

type WorkSeoInput = {
  slug: string;
  title: string;
  subtitle: string | null;
  description: string;
  coverImageUrl: string;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImageUrl: string | null;
  hidden: boolean;
};

export function getWorkMetadata(work: WorkSeoInput): Metadata {
  const title = work.metaTitle?.trim() ?? work.title;
  const description = resolveMetaDescription(
    work.metaDescription,
    work.subtitle,
    work.description,
  );
  const ogImage = work.ogImageUrl?.trim() ?? work.coverImageUrl.trim() ?? null;

  return buildMetadata({
    title,
    description,
    path: `/work/${work.slug}`,
    ogImage,
    ogImageAlt: work.title,
    type: "article",
    noIndex: work.hidden,
  });
}

type BlogSeoInput = {
  slug: string;
  title: string;
  subtitle: string | null;
  content: string;
  coverImageUrl: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImageUrl: string | null;
  hidden: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export function getBlogMetadata(post: BlogSeoInput): Metadata {
  const title = post.metaTitle?.trim() ?? post.title;
  const description = resolveMetaDescription(
    post.metaDescription,
    post.subtitle,
    post.content,
    "Article by Anastasia Maidannikova — 3D designer and visual storyteller.",
  );
  const ogImage =
    post.ogImageUrl?.trim() ?? post.coverImageUrl?.trim() ?? null;

  return buildMetadata({
    title,
    description,
    path: `/blog/${post.slug}`,
    ogImage,
    ogImageAlt: post.title,
    type: "article",
    noIndex: post.hidden,
    publishedTime: post.createdAt.toISOString(),
    modifiedTime: post.updatedAt.toISOString(),
  });
}

type AboutSeoInput = {
  title?: string | null;
  subtitle?: string | null;
  content?: string | null;
  coverImageUrl?: string | null;
  metaDescription?: string | null;
  ogImageUrl?: string | null;
};

export function getAboutMetadata(mainPost?: AboutSeoInput | null): Metadata {
  const description = resolveMetaDescription(
    mainPost?.metaDescription,
    mainPost?.subtitle,
    mainPost?.content,
    "About Anastasia Maidannikova — 3D designer and visual storyteller.",
  );
  const ogImage =
    mainPost?.ogImageUrl?.trim() ??
    mainPost?.coverImageUrl?.trim() ??
    null;

  return buildMetadata({
    title: "About — astershape",
    description,
    path: "/about",
    ogImage,
    ogImageAlt: mainPost?.title ?? "About astershape",
  });
}
