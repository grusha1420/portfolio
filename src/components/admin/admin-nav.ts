import {
  Briefcase,
  FileText,
  Inbox,
  Layout,
  Link as LinkIcon,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { label: "Requests", href: "/admin/requests", icon: Inbox },
  { label: "Work", href: "/admin/work", icon: Briefcase },
  { label: "Blog", href: "/admin/blog", icon: FileText },
  { label: "Content", href: "/admin/content", icon: Layout },
  { label: "Contact", href: "/admin/contact", icon: LinkIcon },
];

export function isAdminNavActive(pathname: string, href: string): boolean {
  if (href === "/admin/work") {
    return pathname === href || pathname.startsWith("/admin/work/");
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getAdminPageTitle(pathname: string): string {
  if (pathname.startsWith("/admin/work/categories")) {
    return "Categories";
  }
  if (pathname === "/admin/work/new") {
    return "New Work";
  }
  if (/^\/admin\/work\/[^/]+$/.test(pathname)) {
    return "Edit Work";
  }
  if (pathname.startsWith("/admin/work")) {
    return "Works";
  }
  if (pathname === "/admin/blog/new") {
    return "New Post";
  }
  if (pathname.startsWith("/admin/blog/")) {
    return "Edit Post";
  }

  const item = ADMIN_NAV_ITEMS.find(
    (nav) => pathname === nav.href || pathname.startsWith(`${nav.href}/`),
  );

  return item?.label ?? "Admin";
}
