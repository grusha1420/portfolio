"use client";

import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { cn } from "~/lib/cn";

import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./AdminSidebar";

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  return (
    <div className="flex min-h-[calc(100vh-0px)] bg-background">
      <aside className="hidden w-60 shrink-0 border-r border-border bg-card md:block">
        <AdminSidebar className="sticky top-0 h-screen" />
      </aside>

      <div
        className={cn(
          "fixed inset-0 z-50 md:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!mobileOpen}
      >
        <button
          type="button"
          aria-label="Close menu"
          className={cn(
            "absolute inset-0 bg-black/50 transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setMobileOpen(false)}
          tabIndex={mobileOpen ? 0 : -1}
        />

        <div
          className={cn(
            "absolute inset-y-0 left-0 flex w-[min(100%,16rem)] flex-col border-r border-border bg-card shadow-xl transition-transform duration-300 ease-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-end p-2">
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="inline-flex size-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-foreground/5"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>
          <AdminSidebar
            className="flex-1 pt-0"
            onNavigate={() => setMobileOpen(false)}
          />
        </div>
      </div>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <AdminHeader onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
