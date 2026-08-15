"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { BookCallButton } from "~/components/BookCallButton";
import { cn } from "~/lib/cn";

import { ThemeToggle } from "./theme-toggle";

const HEADER_HEIGHT_PX = 64;
const SCROLL_THRESHOLD = 50;

interface NavItem {
  label: string;
  href: string;
  matchPath?: string;
  isAnchor?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Work", href: "/work", matchPath: "/work" },
  { label: "About", href: "/about", matchPath: "/about" },
  { label: "Contact", href: "#contact", isAnchor: true },
];

function resolveNavHref(item: NavItem, isHome: boolean): string {
  if (item.isAnchor) {
    return isHome ? item.href : `/${item.href}`;
  }
  return item.href;
}

function scrollToHash(hash: string) {
  const id = hash.startsWith("#") ? hash.slice(1) : hash;
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function NavLink({
  item,
  isHome,
  isOverHero,
  onNavigate,
}: {
  item: NavItem;
  isHome: boolean;
  isOverHero: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const href = resolveNavHref(item, isHome);
  const isActive = item.matchPath !== undefined && pathname === item.matchPath;

  const className = cn(
    "text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm",
    isOverHero
      ? "text-white/90 hover:text-white focus-visible:ring-white/50"
      : "text-foreground hover:text-accent",
    isActive &&
      "text-accent underline decoration-accent decoration-2 underline-offset-4",
  );

  if (item.isAnchor && isHome) {
    return (
      <a
        href={href}
        className={className}
        onClick={(event) => {
          event.preventDefault();
          scrollToHash(item.href);
          onNavigate?.();
        }}
      >
        {item.label}
      </a>
    );
  }

  return (
    <Link href={href} className={className} onClick={onNavigate}>
      {item.label}
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isOverHero = isHome && !scrolled;

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > SCROLL_THRESHOLD);
  }, []);

  useEffect(() => {
    if (isAdminRoute) return;

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll, isAdminRoute]);

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

  useEffect(() => {
    if (isAdminRoute) return;

    const hash = window.location.hash;
    if (!hash) return;

    const timer = window.setTimeout(() => {
      scrollToHash(hash);
    }, 100);

    return () => window.clearTimeout(timer);
  }, [pathname, isAdminRoute]);

  const closeMobile = () => setMobileOpen(false);

  if (isAdminRoute) {
    return null;
  }

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          isOverHero
            ? "border-b border-transparent bg-transparent"
            : "border-b border-border/60 bg-background/80 backdrop-blur-md",
        )}
        style={{ height: HEADER_HEIGHT_PX }}
      >
        <div className="container-content flex h-full items-center justify-between gap-4">
          <Link
            href="/"
            className={cn(
              "text-lg font-bold tracking-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm",
              isOverHero ? "text-white hover:text-white/90" : "text-foreground",
            )}
          >
            resurexi
          </Link>

          <nav
            className="hidden items-center gap-8 md:flex"
            aria-label="Main navigation"
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.label}
                item={item}
                isHome={isHome}
                isOverHero={isOverHero}
              />
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <BookCallButton size="sm" />
            <ThemeToggle
              className={
                isOverHero ? "text-white hover:bg-white/10" : undefined
              }
            />
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle
              className={
                isOverHero ? "text-white hover:bg-white/10" : undefined
              }
            />
            <button
              type="button"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((open) => !open)}
              className={cn(
                "inline-flex size-10 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                isOverHero
                  ? "text-white hover:bg-white/10"
                  : "text-foreground hover:bg-foreground/5",
              )}
            >
              {mobileOpen ? (
                <X className="size-5" aria-hidden />
              ) : (
                <Menu className="size-5" aria-hidden />
              )}
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-nav"
        className={cn(
          "fixed inset-0 z-40 md:hidden",
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
          onClick={closeMobile}
          tabIndex={mobileOpen ? 0 : -1}
        />

        <div
          className={cn(
            "absolute inset-y-0 right-0 flex w-[min(100%,20rem)] flex-col gap-6 border-l border-border bg-background p-6 pt-20 shadow-xl transition-transform duration-300 ease-out",
            mobileOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <nav
            className="flex flex-col gap-4"
            aria-label="Mobile navigation"
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.label}
                item={item}
                isHome={isHome}
                isOverHero={false}
                onNavigate={closeMobile}
              />
            ))}
          </nav>

          <BookCallButton className="w-full" onClick={closeMobile} />
        </div>
      </div>
    </>
  );
}
