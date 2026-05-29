import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/lib/wordpress/types";
import {
  buildBlogCalendar,
  categoryHref,
  getBlogCategories,
  getFeaturedPosts,
  getRecentPosts,
  parsePostDateParts,
} from "@/lib/blog/sidebar";

function formatPostDate(date: string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function BlogSidebar({
  posts,
  currentSlug,
  calendarYear,
  calendarMonth,
  showFeatured = true,
  searchQuery,
  onSearchChange,
}: {
  posts: BlogPost[];
  currentSlug?: string;
  calendarYear?: number;
  calendarMonth?: number;
  /** Hide on main blog index (archive hub has its own layout). */
  showFeatured?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}) {
  const featured = showFeatured ? getFeaturedPosts(posts, 5, currentSlug) : [];
  const recent = getRecentPosts(posts, 8, currentSlug);
  const categories = getBlogCategories(posts);

  const postForCal = currentSlug ? posts.find((p) => p.slug === currentSlug) : undefined;
  const dateParts = postForCal?.date
    ? parsePostDateParts(postForCal.date)
    : null;
  const now = new Date();
  const calYear = calendarYear ?? dateParts?.year ?? now.getFullYear();
  const calMonth = calendarMonth ?? dateParts?.month ?? now.getMonth();
  const calendar = buildBlogCalendar(posts, calYear, calMonth);

  return (
    <aside className="blog-sidebar" aria-label="Blog sidebar">
      {onSearchChange ? (
        <section className="blog-sidebar__widget">
          <h2 className="blog-sidebar__title">Search</h2>
          <label className="visually-hidden" htmlFor="blog-sidebar-search">
            Search articles
          </label>
          <input
            id="blog-sidebar-search"
            type="search"
            className="blog-sidebar__search"
            placeholder="Search articles…"
            value={searchQuery ?? ""}
            onChange={(e) => onSearchChange(e.target.value)}
            autoComplete="off"
          />
        </section>
      ) : null}

      {categories.length > 0 ? (
        <section className="blog-sidebar__widget">
          <h2 className="blog-sidebar__title">Categories</h2>
          <ul className="blog-sidebar__cats">
            {categories.map((cat) => (
              <li key={cat.slug}>
                <Link href={categoryHref(cat.slug)}>
                  {cat.name}
                  <span className="blog-sidebar__count">{cat.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {featured.length > 0 ? (
        <section className="blog-sidebar__widget">
          <h2 className="blog-sidebar__title">Featured</h2>
          <ul className="blog-sidebar__list blog-sidebar__list--featured">
            {featured.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className={`blog-sidebar__post${post.slug === currentSlug ? " is-active" : ""}`}
                >
                  {post.image ? (
                    <span className="blog-sidebar__thumb">
                      <Image src={post.image} alt="" width={64} height={64} />
                    </span>
                  ) : null}
                  <span className="blog-sidebar__post-text">
                    <span className="blog-sidebar__post-title">{post.title}</span>
                    {post.date ? (
                      <span className="blog-sidebar__post-date">{formatPostDate(post.date)}</span>
                    ) : null}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {recent.length > 0 ? (
        <section className="blog-sidebar__widget">
          <h2 className="blog-sidebar__title">Recent Posts</h2>
          <ul className="blog-sidebar__list">
            {recent.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className={post.slug === currentSlug ? "is-active" : undefined}
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="blog-sidebar__widget">
        <h2 className="blog-sidebar__title">
          <Link href={calendar.archiveHref}>{calendar.monthLabel}</Link>
        </h2>
        <nav className="blog-sidebar__cal-nav" aria-label="Calendar month navigation">
          <Link href={calendar.prevHref} className="blog-sidebar__cal-arrow" aria-label="Previous month">
            ‹
          </Link>
          <Link href={calendar.nextHref} className="blog-sidebar__cal-arrow" aria-label="Next month">
            ›
          </Link>
        </nav>
        <table className="blog-sidebar__calendar" role="grid" aria-label={`Posts in ${calendar.monthLabel}`}>
          <thead>
            <tr>
              {calendar.weekdays.map((d) => (
                <th key={d} scope="col">
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {calendar.weeks.map((week, wi) => (
              <tr key={wi}>
                {week.map((cell, di) => (
                  <td key={di} className={cell.isToday ? "is-today" : undefined}>
                    {cell.day === null ? (
                      <span className="blog-sidebar__cal-empty" aria-hidden="true" />
                    ) : cell.href ? (
                      <Link href={cell.href} className={cell.hasPosts ? "has-posts" : undefined}>
                        {cell.day}
                      </Link>
                    ) : (
                      <span className="blog-sidebar__cal-day">{cell.day}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </aside>
  );
}
