import { type LabelHTMLAttributes } from "react";

import { cn } from "~/lib/cn";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function Label({
  className,
  children,
  required,
  ...props
}: LabelProps) {
  return (
    <label
      className={cn("block text-sm font-medium text-foreground", className)}
      {...props}
    >
      {children}
      {required ? <span className="ml-0.5 text-accent">*</span> : null}
    </label>
  );
}
