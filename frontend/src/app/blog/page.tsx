import { SiteLayout } from "@/components/layout/SiteLayout";
import { BlogArchiveHub } from "@/components/blog/BlogArchiveHub";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBlogPosts } from "@/lib/wordpress/api";
import { blogItemListJsonLd, breadcrumbJsonLd, buildMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

/** Fixed blog index — not driven by CMS “blog” page content. */
export async function generateMetadata() {
  return buildMetadata(
    {
      title: "Blog | Web, SEO & Digital Strategy | Creative Web Solutions",
      description:
        "Practical guides on websites, local SEO, ecommerce, and digital marketing for Indian businesses.",
    },
    "/blog",
  );
}

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const listSchema = blogItemListJsonLd(
    posts.map((p) => ({ title: p.title, slug: p.slug, excerpt: p.excerpt })),
  );

  return (
    <SiteLayout currentPath="/blog">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Blog", url: "/blog" },
          ]),
          ...(listSchema ? [listSchema] : []),
        ]}
      />
      <BlogArchiveHub posts={posts} />
    </SiteLayout>
  );
}
