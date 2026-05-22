import Link from "next/link";
import Image from "next/image";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageContentTitle } from "@/components/ui/PageContentTitle";
import { PageHeader } from "@/components/ui/PageHeader";
import { getBlogPosts } from "@/lib/wordpress/api";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Blog | Creative Web Solutions",
  description: "Tech news, web development tips, and digital marketing insights.",
}, "/blog");

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <SiteLayout currentPath="/blog">
      <PageHeader breadcrumb={[{ label: "Home", href: "/" }, { label: "Blog" }]} />
      <section className="corp-section corp-section-tight">
        <div className="container">
          <PageContentTitle title="Our Blog" />
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
