import { cn } from "~/lib/cn";

export interface PageHeroProps {
  overline: string;
  title: string;
  description?: string;
  className?: string;
}

export function PageHero({
  overline,
  title,
  description,
  className,
}: PageHeroProps) {
  return (
    <header className={cn("flex max-w-3xl flex-col gap-4", className)}>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        {overline}
      </p>
      <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">{title}</h1>
      {description ? (
        <p className="text-base leading-relaxed text-muted md:text-lg">
          {description}
        </p>
      ) : null}
    </header>
  );
}
