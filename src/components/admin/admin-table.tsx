import { forwardRef } from "react";

import { cn } from "~/lib/cn";

type AdminTableAlign = "left" | "center" | "right";

export function AdminTable({
  children,
  minWidth = "720px",
  className,
}: {
  children: React.ReactNode;
  minWidth?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-x-auto rounded-xl border border-border bg-card",
        className,
      )}
    >
      <table
        className="w-full table-fixed border-collapse"
        style={{ minWidth }}
      >
        {children}
      </table>
    </div>
  );
}

export function AdminTableColGroup({
  children,
}: {
  children: React.ReactNode;
}) {
  return <colgroup>{children}</colgroup>;
}

export function AdminTableCol({ className }: { className?: string }) {
  return <col className={className} />;
}

export function AdminTableHead({ children }: { children: React.ReactNode }) {
  return <thead>{children}</thead>;
}

export function AdminTableBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}

export const AdminTableRow = forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(function AdminTableRow({ children, className, ...props }, ref) {
  return (
    <tr
      ref={ref}
      className={cn("border-b border-border last:border-b-0", className)}
      {...props}
    >
      {children}
    </tr>
  );
});

function cellAlignClass(align?: AdminTableAlign) {
  if (align === "center") return "text-center";
  if (align === "right") return "text-right";
  return "text-left";
}

export function AdminTableHeaderCell({
  children,
  className,
  align = "left",
}: {
  children: React.ReactNode;
  className?: string;
  align?: AdminTableAlign;
}) {
  return (
    <th
      scope="col"
      className={cn(
        "px-6 py-3 text-xs font-medium uppercase tracking-wide text-muted",
        cellAlignClass(align),
        className,
      )}
    >
      {children}
    </th>
  );
}

export function AdminTableCell({
  children,
  className,
  align = "left",
  colSpan,
}: {
  children: React.ReactNode;
  className?: string;
  align?: AdminTableAlign;
  colSpan?: number;
}) {
  return (
    <td
      colSpan={colSpan}
      className={cn("px-6 py-4 align-middle", cellAlignClass(align), className)}
    >
      {children}
    </td>
  );
}
