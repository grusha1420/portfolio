import Link from "next/link";

import { Badge, MediaImage } from "~/components/ui";
import { cn } from "~/lib/cn";

export const WORK_COVER_PLACEHOLDER = "/placeholders/work-cover.svg";

export interface WorkCardWork {
  slug: string;
  title: string;
  subtitle: string | null;
  coverImageUrl: string;
  coverIsAnimated: boolean;
  categories: { id: string; name: string }[];
}

export interface WorkCardProps {
  work: WorkCardWork;
  className?: string;
}

export function WorkCard({ work, className }: WorkCardProps) {
  const coverSrc = work.coverImageUrl.trim() || WORK_COVER_PLACEHOLDER;

  return (
    <Link
      href={`/work/${work.slug}`}
      className={cn(
        "group flex flex-col gap-4 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-black/20">
        <MediaImage
          src={coverSrc}
          alt={work.title}
          isAnimated={work.coverIsAnimated}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className={cn(
            "object-cover transition-transform duration-500 group-hover:scale-[1.03]",
            work.coverIsAnimated && "absolute inset-0 h-full w-full",
          )}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10"
        />
      </div>

      <div className="flex flex-col gap-2">
        {work.subtitle ? (
          <p className="text-xs font-medium uppercase tracking-[0.18em] opacity-80">
            {work.subtitle}
          </p>
        ) : null}
        <h3 className="line-clamp-2 text-xl font-bold leading-tight md:text-2xl">
          {work.title}
        </h3>
        {work.categories.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-1">
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
      </div>
    </Link>
  );
}
