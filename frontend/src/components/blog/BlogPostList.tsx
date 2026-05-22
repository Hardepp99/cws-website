import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/lib/wordpress/types";

export function BlogPostList({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) {
    return <p className="blog-archive__empty">No posts found.</p>;
  }

  return (
    <div className="row g-4">
      {posts.map((post) => (
        <div key={post.slug} className="col-12">
          <article className="blog-archive__item">
            {post.image ? (
              <Link href={`/blog/${post.slug}`} className="blog-archive__thumb">
                <Image src={post.image} alt={post.title} width={200} height={120} />
              </Link>
            ) : null}
            <div className="blog-archive__body">
              <h2>
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              {post.date ? (
                <time className="blog-archive__date" dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              ) : null}
              {post.excerpt ? <p>{post.excerpt}</p> : null}
            </div>
          </article>
        </div>
      ))}
    </div>
  );
}
