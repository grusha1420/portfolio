import { type Metadata } from "next";
import Link from "next/link";
import { cache } from "react";

import { BlogPostCard } from "~/components/blog";
import { PageHero } from "~/components/layout/PageHero";
import { MDXContent } from "~/components/mdx/mdx-content";
import { ContactSection } from "~/components/sections";
import { MediaImage } from "~/components/ui";
import { cn } from "~/lib/cn";
import { getAboutMetadata } from "~/lib/seo";
import { api } from "~/trpc/server";

const getMainPost = cache(async () => api.blog.getMain());

export async function generateMetadata(): Promise<Metadata> {
  const mainPost = await getMainPost();
  return getAboutMetadata(mainPost);
}

export default async function AboutPage() {
  const [mainPost, otherPosts] = await Promise.all([
    getMainPost(),
    api.blog.listPublic(),
  ]);

  const pageTitle = mainPost?.title ?? "About astershape";
  const hasMainContent = Boolean(mainPost?.content.trim());

  return (
    <main id="main-content" className="min-h-screen bg-background pt-16 text-foreground">
      <div className="container-content flex flex-col gap-8 py-8 md:gap-12 md:py-10">
        <PageHero
          overline="— ABOUT"
          title={pageTitle}
          description={mainPost?.subtitle ?? undefined}
        />

        <section aria-label="Main story" className="flex flex-col gap-10">
          {mainPost ? (
            <>
              {mainPost.coverImageUrl?.trim() ? (
                <div className="relative aspect-[16/10] max-w-4xl overflow-hidden rounded-xl bg-black/20">
                  <MediaImage
                    src={mainPost.coverImageUrl.trim()}
                    alt={mainPost.title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 56rem"
                    className="object-cover"
                  />
                </div>
              ) : null}

              {hasMainContent ? (
                <MDXContent source={mainPost.content} />
              ) : (
                <p className="text-lg text-muted">About content coming soon.</p>
              )}

              <div>
                <Link
                  href={`/blog/${mainPost.slug}`}
                  className={cn(
                    "inline-flex items-center text-sm font-medium text-accent underline-offset-4 transition-colors hover:underline",
                  )}
                >
                  Read full story
                </Link>
              </div>
            </>
          ) : (
            <p className="text-lg text-muted">About content coming soon.</p>
          )}
        </section>

        {otherPosts.length > 0 ? (
          <section aria-label="From the blog" className="flex flex-col gap-8">
            <header className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                From the blog
              </p>
              <h2 className="text-2xl font-bold md:text-3xl">More articles</h2>
            </header>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {otherPosts.map((post) => (
                <BlogPostCard
                  key={post.id}
                  slug={post.slug}
                  title={post.title}
                  subtitle={post.subtitle}
                  coverImageUrl={post.coverImageUrl}
                />
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <ContactSection variant="page" />
    </main>
  );
}
