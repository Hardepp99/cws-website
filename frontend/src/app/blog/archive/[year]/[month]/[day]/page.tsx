import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { BlogPostList } from "@/components/blog/BlogPostList";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { PageHeader } from "@/components/ui/PageHeader";
import { getBlogPosts } from "@/lib/wordpress/api";
import { archiveMonthHref, parsePostDateParts } from "@/lib/blog/sidebar";

interface Props {
  params: Promise<{ year: string; month: string; day: string }>;
}

function postMatchesDay(post: { date: string }, year: number, month: number, day: number): boolean {
  const parts = parsePostDateParts(post.date);
  return !!parts && parts.year === year && parts.month === month && parts.day === day;
}

export default async function BlogDayArchivePage({ params }: Props) {
  const { year: yearStr, month: monthStr, day: dayStr } = await params;
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1;
  const day = parseInt(dayStr, 10);
  if (
    Number.isNaN(year) ||
    Number.isNaN(month) ||
    Number.isNaN(day) ||
    month < 0 ||
    month > 11 ||
    day < 1 ||
    day > 31
  ) {
    notFound();
  }

  const posts = await getBlogPosts();
  const filtered = posts.filter((p) => postMatchesDay(p, year, month, day));
  const label = new Date(year, month, day).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <SiteLayout currentPath="/blog">
      <PageHeader
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: label },
        ]}
      />
      <section className="content-page-section">
        <div className="corp-container">
          <div className="blog-layout">
            <main className="blog-layout__main">
              <h1 className="blog-archive__heading">Posts on {label}</h1>
              <p className="blog-archive__back">
                <Link href={archiveMonthHref(year, month)}>
                  ←{" "}
                  {new Date(year, month, 1).toLocaleDateString("en-IN", {
                    month: "long",
                    year: "numeric",
                  })}
                </Link>
              </p>
              <BlogPostList posts={filtered} />
            </main>
            <BlogSidebar posts={posts} calendarYear={year} calendarMonth={month} />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
