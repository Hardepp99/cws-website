import type { BlogPost } from "@/lib/wordpress/types";

export interface BlogCategoryCount {
  name: string;
  slug: string;
  count: number;
}

export interface BlogCalendarCell {
  day: number | null;
  hasPosts: boolean;
  href: string | null;
  isToday: boolean;
}

export interface BlogCalendarData {
  year: number;
  month: number;
  monthLabel: string;
  prevHref: string;
  nextHref: string;
  archiveHref: string;
  weekdays: string[];
  weeks: BlogCalendarCell[][];
}

export function categorySlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getBlogCategories(posts: BlogPost[]): BlogCategoryCount[] {
  const map = new Map<string, BlogCategoryCount>();
  for (const post of posts) {
    for (const name of post.categories ?? []) {
      const slug = categorySlug(name);
      if (!slug) continue;
      const existing = map.get(slug);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(slug, { name, slug, count: 1 });
      }
    }
  }
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export function getFeaturedPosts(
  posts: BlogPost[],
  limit = 5,
  excludeSlug?: string
): BlogPost[] {
  return posts.filter((p) => p.featured && p.slug !== excludeSlug).slice(0, limit);
}

export function getRecentPosts(
  posts: BlogPost[],
  limit = 5,
  excludeSlug?: string
): BlogPost[] {
  return posts.filter((p) => p.slug !== excludeSlug).slice(0, limit);
}

export function postMatchesCategory(post: BlogPost, slug: string): boolean {
  return (post.categories ?? []).some((c) => categorySlug(c) === slug);
}

export function postMatchesMonth(post: BlogPost, year: number, month: number): boolean {
  if (!post.date) return false;
  const d = new Date(post.date);
  return d.getFullYear() === year && d.getMonth() === month;
}

export function parsePostDateParts(dateStr: string): { year: number; month: number; day: number } | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  return { year: d.getFullYear(), month: d.getMonth(), day: d.getDate() };
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function archiveMonthHref(year: number, month: number): string {
  return `/blog/archive/${year}/${pad2(month + 1)}`;
}

export function archiveDayHref(year: number, month: number, day: number): string {
  return `/blog/archive/${year}/${pad2(month + 1)}/${pad2(day)}`;
}

export function categoryHref(slug: string): string {
  return `/blog/category/${slug}`;
}

export function buildBlogCalendar(
  posts: BlogPost[],
  year: number,
  month: number,
  basePath = ""
): BlogCalendarData {
  const prefix = basePath.replace(/\/$/, "");
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeekday = first.getDay();
  const monthLabel = first.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  const daysWithPosts = new Set<number>();
  for (const post of posts) {
    const parts = parsePostDateParts(post.date);
    if (parts && parts.year === year && parts.month === month) {
      daysWithPosts.add(parts.day);
    }
  }

  const today = new Date();
  const weeks: BlogCalendarCell[][] = [];
  let week: BlogCalendarCell[] = [];

  for (let i = 0; i < startWeekday; i++) {
    week.push({ day: null, hasPosts: false, href: null, isToday: false });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const hasPosts = daysWithPosts.has(day);
    week.push({
      day,
      hasPosts,
      href: hasPosts ? `${prefix}${archiveDayHref(year, month, day)}` : null,
      isToday:
        today.getFullYear() === year && today.getMonth() === month && today.getDate() === day,
    });
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length) {
    while (week.length < 7) {
      week.push({ day: null, hasPosts: false, href: null, isToday: false });
    }
    weeks.push(week);
  }

  const prev = new Date(year, month - 1, 1);
  const next = new Date(year, month + 1, 1);

  return {
    year,
    month,
    monthLabel,
    prevHref: `${prefix}${archiveMonthHref(prev.getFullYear(), prev.getMonth())}`,
    nextHref: `${prefix}${archiveMonthHref(next.getFullYear(), next.getMonth())}`,
    archiveHref: `${prefix}${archiveMonthHref(year, month)}`,
    weekdays: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    weeks,
  };
}
