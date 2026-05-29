import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { ContentArticle } from "@/components/ui/ContentArticle";
import { categoryHref, categorySlug as toCategorySlug } from "@/lib/blog/sidebar";
import { ElementorPageBody } from "@/components/pages/ElementorPageBody";
import { PageBodyContent } from "@/components/ui/PageBodyContent";
import { BlogComments } from "@/components/blog/BlogComments";
import { PageFaq } from "@/components/faq/PageFaq";
import { normalizeFaqItems } from "@/lib/faq/normalize";
import { PageHeader } from "@/components/ui/PageHeader";
import { resolvePublicBody } from "@/lib/content/display-mode";
import { getBlogPosts } from "@/lib/wordpress/api";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleJsonLd, breadcrumbJsonLd, buildMetadata } from "@/lib/seo/metadata";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const posts = await getBlogPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};
  return buildMetadata(post.seo, `/blog/${slug}`);
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const posts = await getBlogPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const dateLabel = new Date(post.date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const categories = post.categories ?? [];
  const body = resolvePublicBody({
    displayMode: post.displayMode,
    content: post.content,
    desimentor: post.desimentor,
  });

  return (
    <SiteLayout currentPath={`/blog/${slug}`}>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Blog", url: "/blog" },
            { name: post.title, url: `/blog/${slug}` },
          ]),
          articleJsonLd({
            title: post.seo.title || post.title,
            description: post.seo.description || post.excerpt,
            slug,
            date: post.date,
            image: post.image || post.seo.ogImage,
          }),
        ]}
      />
      <PageHeader breadcrumb={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: post.title }]} />
      {body.showElementor ? (
        <div className="corp-container blog-layout blog-layout--elementor">
          <div className="blog-layout__main blog-layout__main--full">
            <div className="blog-post-meta-bar">
              <span>
                <i className="far fa-calendar" aria-hidden="true" /> {dateLabel}
              </span>
              {categories.map((name) => (
                <span key={name}>
                  <i className="far fa-folder-open" aria-hidden="true" />{" "}
                  <Link href={categoryHref(toCategorySlug(name))}>{name}</Link>
                </span>
              ))}
            </div>
            <ElementorPageBody
              title={post.title}
              displayMode={post.displayMode}
              content={post.content}
              desimentor={post.desimentor}
            />
            <PageFaq items={normalizeFaqItems(post.faqs)} title="Article FAQs" />
            <BlogComments postSlug={slug} />
          </div>
          <BlogSidebar posts={posts} currentSlug={slug} />
        </div>
      ) : (
        <section className="content-page-section">
          <div className="corp-container">
            <div className="blog-layout">
              <main className="blog-layout__main">
                <ContentArticle
                  title={post.title}
                  meta={
                    <>
                      <span className="content-article__meta-item">
                        <i className="far fa-calendar" aria-hidden="true" /> {dateLabel}
                      </span>
                      {categories.length > 0 ? (
                        categories.map((name) => (
                          <span key={name} className="content-article__meta-item">
                            <i className="far fa-folder-open" aria-hidden="true" />{" "}
                            <Link href={categoryHref(toCategorySlug(name))}>{name}</Link>
                          </span>
                        ))
                      ) : (
                        <span className="content-article__meta-item">
                          <i className="far fa-folder-open" aria-hidden="true" /> Blog
                        </span>
                      )}
                    </>
                  }
                  excerpt={post.excerpt}
                  image={post.image}
                  variant="blog"
                >
                  <PageBodyContent
                    title={post.title}
                    displayMode="classic"
                    content={post.content}
                    showArticleWrapper={false}
                  />
                </ContentArticle>
                <PageFaq items={normalizeFaqItems(post.faqs)} title="Article FAQs" />
                <BlogComments postSlug={slug} />
              </main>
              <BlogSidebar posts={posts} currentSlug={slug} />
            </div>
          </div>
        </section>
      )}
    </SiteLayout>
  );
}
