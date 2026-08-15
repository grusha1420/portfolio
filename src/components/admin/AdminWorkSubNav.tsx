"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "~/lib/cn";

const WORK_TABS = [
  { label: "Works", href: "/admin/work" },
  { label: "Categories", href: "/admin/work/categories" },
] as const;

export function AdminWorkSubNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex gap-1 border-b border-border"
      aria-label="Work section navigation"
    >
      {WORK_TABS.map((tab) => {
        const isActive =
          tab.href === "/admin/work"
            ? pathname === tab.href ||
              (pathname.startsWith("/admin/work/") &&
                !pathname.startsWith("/admin/work/categories"))
            : pathname.startsWith(tab.href);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors",
              isActive
                ? "border-accent text-accent"
                : "border-transparent text-muted hover:text-foreground",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
