import { TRPCError } from "@trpc/server";
import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import { MDXContent } from "~/components/mdx/mdx-content";
import { ContactSection } from "~/components/sections";
import { Badge, MediaImage } from "~/components/ui";
import {
  WORK_COVER_PLACEHOLDER,
  WorkImageGallery,
  YouTubeEmbed,
} from "~/components/work";
import { cn } from "~/lib/cn";
import { getWorkMetadata } from "~/lib/seo";
import { api } from "~/trpc/server";

type WorkPageProps = {
  params: Promise<{ slug: string }>;
};

const getWork = cache(async (slug: string) => {
  try {
    return await api.works.getBySlug({ slug });
  } catch (error) {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") {
      notFound();
    }
    throw error;
  }
});

export async function generateMetadata({
  params,
}: WorkPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const work = await getWork(slug);
    return getWorkMetadata(work);
  } catch {
    return {
      title: "Work not found",
    };
  }
}

export default async function WorkDetailPage({ params }: WorkPageProps) {
  const { slug } = await params;
  const work = await getWork(slug);

  const coverSrc = work.coverImageUrl.trim() || WORK_COVER_PLACEHOLDER;
  const hasDescription = work.description.trim().length > 0;

  return (
    <main id="main-content" className="min-h-screen bg-background pt-16 text-foreground">
      {work.hidden ? (
        <div className="border-b border-accent/30 bg-accent/10 px-4 py-2 text-center text-xs font-medium uppercase tracking-[0.15em] text-accent">
          Draft — not visible in public listings
        </div>
      ) : null}

      <article className="container-content flex flex-col gap-12 py-16 md:gap-16 md:py-24">
        <header className="flex flex-col gap-6">
          {work.subtitle ? (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              {work.subtitle}
            </p>
          ) : null}

          <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">{work.title}</h1>

          {work.categories.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {work.categories.map((category) => (
                <Badge
                  key={category.id}
                  className="border border-current/25 bg-transparent px-2.5 py-0.5 text-xs font-normal opacity-90"
                >
                  {category.name}
                </Badge>
              ))}
            </div>
          ) : null}

          <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-black/20">
            <MediaImage
              src={coverSrc}
              alt={work.title}
              isAnimated={work.coverIsAnimated}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 72rem"
              className={cn(
                "object-cover",
                work.coverIsAnimated && "absolute inset-0 h-full w-full",
              )}
            />
          </div>
        </header>

        {work.galleryImages.length > 0 ? (
          <section aria-label="Gallery">
            <WorkImageGallery images={work.galleryImages} />
          </section>
        ) : null}

        {work.youtubeVideos.length > 0 ? (
          <section aria-label="Videos">
            <YouTubeEmbed videos={work.youtubeVideos} />
          </section>
        ) : null}

        {hasDescription ? (
          <section aria-label="Description">
            <MDXContent source={work.description} />
          </section>
        ) : null}
      </article>

      <ContactSection variant="page" />
    </main>
  );
}
