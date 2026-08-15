"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/cn";
import { api } from "~/trpc/react";

import { ADMIN_NAV_ITEMS, isAdminNavActive } from "./admin-nav";

interface AdminSidebarProps {
  onNavigate?: () => void;
  className?: string;
}

export function AdminSidebar({ onNavigate, className }: AdminSidebarProps) {
  const pathname = usePathname();
  const { data: unreadCount = 0 } = api.contact.getUnreadCount.useQuery(
    undefined,
    { refetchInterval: 30_000 },
  );

  return (
    <nav
      className={cn("flex h-full flex-col gap-1 p-4", className)}
      aria-label="Admin navigation"
    >
      <div className="mb-6 px-2">
        <Link
          href="/admin/requests"
          className="text-lg font-semibold tracking-tight text-foreground"
          onClick={onNavigate}
        >
          astershape admin
        </Link>
      </div>

      {ADMIN_NAV_ITEMS.map((item) => {
        const isActive = isAdminNavActive(pathname, item.href);
        const Icon = item.icon;
        const showBadge = item.href === "/admin/requests" && unreadCount > 0;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              isActive
                ? "bg-accent/10 text-accent"
                : "text-foreground hover:bg-foreground/5",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            <span className="flex-1">{item.label}</span>
            {showBadge ? (
              <Badge variant="accent" className="min-w-6 justify-center px-2 py-0.5">
                {unreadCount > 99 ? "99+" : unreadCount}
              </Badge>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
