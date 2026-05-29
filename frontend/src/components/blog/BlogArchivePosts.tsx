import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/lib/wordpress/types";
import { categoryHref, categorySlug } from "@/lib/blog/sidebar";

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function BlogArchivePosts({
  posts,
  view,
}: {
  posts: BlogPost[];
  view: "grid" | "list";
}) {
  if (posts.length === 0) {
    return <p className="blog-archive__empty">No posts match your search.</p>;
  }

  if (view === "list") {
    return (
      <div className="blog-archive__list">
        {posts.map((post) => (
          <article key={post.slug} className="blog-archive__item">
            {post.image ? (
              <Link href={`/blog/${post.slug}`} className="blog-archive__thumb">
                <Image src={post.image} alt={post.title} width={220} height={132} />
              </Link>
            ) : null}
            <div className="blog-archive__body">
              <h2>
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              {post.date ? (
                <time className="blog-archive__date" dateTime={post.date}>
                  {formatDate(post.date)}
                </time>
              ) : null}
              {post.categories && post.categories.length > 0 ? (
                <p className="blog-archive__cats">
                  {post.categories.map((name) => (
                    <Link key={name} href={categoryHref(categorySlug(name))}>
                      {name}
                    </Link>
                  ))}
                </p>
              ) : null}
              {post.excerpt ? <p className="blog-archive__excerpt">{post.excerpt}</p> : null}
            </div>
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className="blog-archive__grid">
      {posts.map((post) => (
        <article key={post.slug} className="blog-archive__card">
          {post.image ? (
            <Link href={`/blog/${post.slug}`} className="blog-archive__card-image">
              <Image src={post.image} alt={post.title} width={480} height={270} />
            </Link>
          ) : (
            <Link href={`/blog/${post.slug}`} className="blog-archive__card-image blog-archive__card-image--placeholder">
              <span aria-hidden="true">
                <i className="far fa-newspaper" />
              </span>
            </Link>
          )}
          <div className="blog-archive__card-body">
            {post.date ? (
              <time className="blog-archive__date" dateTime={post.date}>
                {formatDate(post.date)}
              </time>
            ) : null}
            <h2>
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            {post.excerpt ? <p>{post.excerpt}</p> : null}
            {post.categories && post.categories.length > 0 ? (
              <p className="blog-archive__card-cats">
                {post.categories.slice(0, 2).map((name) => (
                  <Link key={name} href={categoryHref(categorySlug(name))}>
                    {name}
                  </Link>
                ))}
              </p>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
