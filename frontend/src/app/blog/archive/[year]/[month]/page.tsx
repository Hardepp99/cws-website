import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { BlogPostList } from "@/components/blog/BlogPostList";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { PageHeader } from "@/components/ui/PageHeader";
import { getBlogPosts } from "@/lib/wordpress/api";
import { archiveMonthHref, postMatchesMonth } from "@/lib/blog/sidebar";

interface Props {
  params: Promise<{ year: string; month: string }>;
}

export default async function BlogMonthArchivePage({ params }: Props) {
  const { year: yearStr, month: monthStr } = await params;
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1;
  if (Number.isNaN(year) || Number.isNaN(month) || month < 0 || month > 11) {
    notFound();
  }

  const posts = await getBlogPosts();
  const filtered = posts.filter((p) => postMatchesMonth(p, year, month));
  const label = new Date(year, month, 1).toLocaleDateString("en-IN", {
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
              <h1 className="blog-archive__heading">Archive: {label}</h1>
              <p className="blog-archive__back">
                <Link href="/blog">← All posts</Link>
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

export async function generateMetadata({ params }: Props) {
  const { year: yearStr, month: monthStr } = await params;
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1;
  const label = new Date(year, month, 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
  return {
    title: `Blog archive ${label} | Creative Web Solutions`,
    alternates: { canonical: archiveMonthHref(year, month) },
  };
}
