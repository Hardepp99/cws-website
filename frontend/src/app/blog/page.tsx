import Link from "next/link";
import Image from "next/image";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageContentTitle } from "@/components/ui/PageContentTitle";
import { PageHeader } from "@/components/ui/PageHeader";
import { RichContent } from "@/components/ui/RichContent";
import { getBlogPosts, getPageBySlug } from "@/lib/wordpress/api";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const page = await getPageBySlug("blog");
  if (page?.seo?.title) return buildMetadata(page.seo, "/blog");
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
  const [posts, page] = await Promise.all([getBlogPosts(), getPageBySlug("blog")]);

  return (
    <SiteLayout currentPath="/blog">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
        ])}
      />
      <PageHeader breadcrumb={[{ label: "Home", href: "/" }, { label: "Blog" }]} />
      <section className="corp-section corp-section-tight">
        <div className="container">
          <PageContentTitle title={page?.title ?? "Our Blog"} />
          {page?.content ? (
            <RichContent html={page.content} className="seo-rich-prose mb-4" />
          ) : null}
          <div className="row g-4">
            {posts.map((post) => (
              <div key={post.slug} className="col-lg-4 col-md-6">
                <article className="blog-card-full">
                  {post.image && (
                    <div className="blog-image">
                      <Image src={post.image} alt={post.title} width={400} height={220} />
                    </div>
                  )}
                  <div className="blog-content">
                    <h3>
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p>{post.excerpt}</p>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
