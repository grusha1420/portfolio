import { type HTMLAttributes } from "react";

import { cn } from "~/lib/cn";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "accent";
}

const variantStyles = {
  default: "bg-foreground/8 text-foreground",
  accent: "bg-accent/15 text-accent",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}
