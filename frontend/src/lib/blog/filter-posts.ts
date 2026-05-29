import type { BlogPost } from "@/lib/wordpress/types";

export function filterBlogPosts(posts: BlogPost[], query: string): BlogPost[] {
  const q = query.trim().toLowerCase();
  if (!q) return posts;
  return posts.filter((post) => {
    const inTitle = post.title.toLowerCase().includes(q);
    const inExcerpt = (post.excerpt ?? "").toLowerCase().includes(q);
    const inCats = (post.categories ?? []).some((c) => c.toLowerCase().includes(q));
    return inTitle || inExcerpt || inCats;
  });
}
