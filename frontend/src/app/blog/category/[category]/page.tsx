import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { BlogPostList } from "@/components/blog/BlogPostList";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { PageHeader } from "@/components/ui/PageHeader";
import { getBlogPosts } from "@/lib/wordpress/api";
import { categoryHref, getBlogCategories, postMatchesCategory } from "@/lib/blog/sidebar";

interface Props {
  params: Promise<{ category: string }>;
}

export default async function BlogCategoryPage({ params }: Props) {
  const { category: catSlug } = await params;
  const posts = await getBlogPosts();
  const categories = getBlogCategories(posts);
  const match = categories.find((c) => c.slug === catSlug);
  if (!match) {
    notFound();
  }

  const filtered = posts.filter((p) => postMatchesCategory(p, catSlug));

  return (
    <SiteLayout currentPath="/blog">
      <PageHeader
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: match.name },
        ]}
      />
      <section className="content-page-section">
        <div className="corp-container">
          <div className="blog-layout">
            <main className="blog-layout__main">
              <h1 className="blog-archive__heading">Category: {match.name}</h1>
              <p className="blog-archive__back">
                <Link href="/blog">← All posts</Link>
              </p>
              <BlogPostList posts={filtered} />
            </main>
            <BlogSidebar posts={posts} />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return getBlogCategories(posts).map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { category: catSlug } = await params;
  const posts = await getBlogPosts();
  const match = getBlogCategories(posts).find((c) => c.slug === catSlug);
  if (!match) return {};
  return {
    title: `${match.name} | Blog | Creative Web Solutions`,
    alternates: { canonical: categoryHref(catSlug) },
  };
}
