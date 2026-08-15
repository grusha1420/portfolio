import { type HTMLAttributes, type ReactNode } from "react";

import { cn } from "~/lib/cn";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  image?: ReactNode;
  footer?: ReactNode;
}

export function Card({
  className,
  children,
  image,
  footer,
  ...props
}: CardProps) {
  return (
    <article
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md",
        className,
      )}
      {...props}
    >
      {image ? <div className="overflow-hidden">{image}</div> : null}
      <div className="flex flex-col gap-3 p-5">{children}</div>
      {footer ? (
        <div className="border-t border-border px-5 py-4">{footer}</div>
      ) : null}
    </article>
  );
}

export function CardTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-lg font-semibold text-foreground", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-muted", className)} {...props} />
  );
}
