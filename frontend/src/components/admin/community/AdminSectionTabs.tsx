"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type AdminTab = { href: string; label: string };

function isTabActive(pathname: string, href: string): boolean {
  if (href === "/admin/community") {
    return pathname === "/admin/community";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSectionTabs({ tabs }: { tabs: AdminTab[] }) {
  const pathname = usePathname();

  return (
    <nav className="cms-section-tabs" aria-label="Section navigation">
      {tabs.map((tab) => {
        const active = isTabActive(pathname, tab.href);
        return (
          <Link key={tab.href} href={tab.href} className={active ? "is-active" : undefined} aria-current={active ? "page" : undefined}>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

export const COMMUNITY_TABS: AdminTab[] = [
  { href: "/admin/community", label: "Overview" },
  { href: "/admin/community/comments", label: "Blog comments" },
  { href: "/admin/community/posts", label: "Member posts" },
];

export const FORUMS_TABS: AdminTab[] = [
  { href: "/admin/forums", label: "Forums" },
  { href: "/admin/forums/topics", label: "Topics" },
  { href: "/admin/forums/replies", label: "Replies" },
];
