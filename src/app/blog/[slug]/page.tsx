import { TRPCError } from "@trpc/server";
import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import { MDXContent } from "~/components/mdx/mdx-content";
import { ContactSection } from "~/components/sections";
import { MediaImage } from "~/components/ui";
import { cn } from "~/lib/cn";
import { getBlogMetadata } from "~/lib/seo";
import { api } from "~/trpc/server";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

const getBlogPost = cache(async (slug: string) => {
  try {
    return await api.blog.getBySlug({ slug });
  } catch (error) {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") {
      notFound();
    }
    throw error;
  }
});

function formatArticleDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await getBlogPost(slug);
    return getBlogMetadata(post);
  } catch {
    return {
      title: "Article not found",
    };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  const coverSrc = post.coverImageUrl?.trim();
  const hasContent = post.content.trim().length > 0;

  return (
    <main id="main-content" className="min-h-screen bg-background pt-16 text-foreground">
      {post.hidden ? (
        <div className="border-b border-accent/30 bg-accent/10 px-4 py-2 text-center text-xs font-medium uppercase tracking-[0.15em] text-accent">
          Draft — not visible in public listings
        </div>
      ) : null}

      <article className="container-content flex flex-col gap-6 py-8 md:gap-8 md:py-10">
        <header className="flex max-w-3xl flex-col gap-4">
          {post.subtitle ? (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              {post.subtitle}
            </p>
          ) : null}

          <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">{post.title}</h1>

          <time
            dateTime={post.createdAt.toISOString()}
            className="text-sm text-muted"
          >
            {formatArticleDate(post.createdAt)}
          </time>
        </header>

        {coverSrc ? (
          <div className="relative aspect-[16/10] max-w-4xl overflow-hidden rounded-xl bg-black/20">
            <MediaImage
              src={coverSrc}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 56rem"
              className={cn("object-cover")}
            />
          </div>
        ) : null}

        {hasContent ? (
          <section aria-label="Article content" className="max-w-3xl">
            <MDXContent source={post.content} />
          </section>
        ) : null}
      </article>

      <ContactSection variant="page" />
    </main>
  );
}
