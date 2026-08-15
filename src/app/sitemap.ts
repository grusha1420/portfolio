import { type MetadataRoute } from "next";

import { getSiteUrl } from "~/lib/seo";
import { api } from "~/trpc/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  const [works, mainPost, otherPosts] = await Promise.all([
    api.works.listAll(),
    api.blog.getMain(),
    api.blog.listPublic(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/work`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: mainPost?.updatedAt ?? new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const workPages: MetadataRoute.Sitemap = works.map((work) => ({
    url: `${siteUrl}/work/${work.slug}`,
    lastModified: work.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const blogPosts = [...(mainPost ? [mainPost] : []), ...otherPosts];

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly",
    priority: post.isMain ? 0.8 : 0.6,
  }));

  return [...staticPages, ...workPages, ...blogPages];
}
