import Link from "next/link";

import { ColoredSegment } from "~/components/layout";
import { WorkCard, type WorkCardWork } from "~/components/work";
import { cn } from "~/lib/cn";
import { api } from "~/trpc/server";

function toWorkCardWork(
  work: Awaited<ReturnType<typeof api.works.listFeatured>>[number],
): WorkCardWork {
  return {
    slug: work.slug,
    title: work.title,
    subtitle: work.subtitle,
    coverImageUrl: work.coverImageUrl,
    coverIsAnimated: work.coverIsAnimated,
    categories: work.categories.map((category) => ({
      id: category.id,
      name: category.name,
    })),
  };
}

export async function FeaturedWork() {
  const works = await api.works.listFeatured();

  return (
    <ColoredSegment id="featured-work" variant="a" waves="both" waveOverlap="top">
      <div className="container-content py-16 md:py-24 text-foreground">
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              01 — Featured Work
            </p>
            <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl">
              Selected renders &amp; films
            </h2>
          </div>
          <Link
            href="/work"
            className={cn(
              "inline-flex items-center gap-1 text-sm font-medium underline-offset-4 transition-opacity hover:underline hover:opacity-90",
              "self-start md:self-auto",
            )}
          >
            View all work
            <span aria-hidden>→</span>
          </Link>
        </header>

        {works.length === 0 ? (
          <p className="mt-12 text-center text-sm opacity-70">No featured work yet</p>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
            {works.map((work) => (
              <WorkCard key={work.id} work={toWorkCardWork(work)} />
            ))}
          </div>
        )}
      </div>
    </ColoredSegment>
  );
}
