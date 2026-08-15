"use client";

import { Menu } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/cn";
import { api } from "~/trpc/react";

import { getAdminPageTitle } from "./admin-nav";

interface AdminHeaderProps {
  onMenuClick?: () => void;
  className?: string;
}

export function AdminHeader({ onMenuClick, className }: AdminHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const pageTitle = getAdminPageTitle(pathname);

  const logoutMutation = api.admin.logout.useMutation({
    onSuccess: () => {
      router.push("/admin/login");
      router.refresh();
    },
  });

  const breadcrumb =
    pathname.startsWith("/admin/work/categories") ? (
      <span className="flex items-center gap-2 text-sm text-muted">
        <span>Work</span>
        <span aria-hidden>/</span>
        <span className="text-foreground">{pageTitle}</span>
      </span>
    ) : (
      <h1 className="text-lg font-semibold text-foreground">{pageTitle}</h1>
    );

  return (
    <header
      className={cn(
        "flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border bg-background px-4 md:px-6",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          aria-label="Open menu"
          onClick={onMenuClick}
          className="inline-flex size-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:hidden"
        >
          <Menu className="size-5" aria-hidden />
        </button>
        {breadcrumb}
      </div>

      <Button
        variant="secondary"
        size="sm"
        onClick={() => logoutMutation.mutate()}
        disabled={logoutMutation.isPending}
      >
        {logoutMutation.isPending ? "Signing out..." : "Log out"}
      </Button>
    </header>
  );
}
