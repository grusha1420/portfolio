import Link from "next/link";

import { MediaImage } from "~/components/ui";
import { cn } from "~/lib/cn";

import { BLOG_COVER_PLACEHOLDER } from "./constants";

export interface BlogPostCardProps {
  slug: string;
  title: string;
  subtitle: string | null;
  coverImageUrl: string | null;
  className?: string;
}

export function BlogPostCard({
  slug,
  title,
  subtitle,
  coverImageUrl,
  className,
}: BlogPostCardProps) {
  const trimmedCover = coverImageUrl?.trim();
  const coverSrc =
    trimmedCover && trimmedCover.length > 0
      ? trimmedCover
      : BLOG_COVER_PLACEHOLDER;

  return (
    <Link
      href={`/blog/${slug}`}
      className={cn(
        "group flex flex-col gap-4 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-black/20">
        <MediaImage
          src={coverSrc}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10"
        />
      </div>

      <div className="flex flex-col gap-2">
        {subtitle ? (
          <p className="text-xs font-medium uppercase tracking-[0.18em] opacity-80">
            {subtitle}
          </p>
        ) : null}
        <h3 className="line-clamp-2 text-xl font-bold leading-tight md:text-2xl">
          {title}
        </h3>
      </div>
    </Link>
  );
}
