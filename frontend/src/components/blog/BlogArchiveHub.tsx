"use client";

import { useEffect, useMemo, useState } from "react";
import type { BlogPost } from "@/lib/wordpress/types";
import { filterBlogPosts } from "@/lib/blog/filter-posts";
import { BlogArchivePosts } from "@/components/blog/BlogArchivePosts";
import { BlogSidebar } from "@/components/blog/BlogSidebar";

type ViewMode = "grid" | "list";

export function BlogArchiveHub({ posts }: { posts: BlogPost[] }) {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<ViewMode>("grid");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cws-blog-view");
      if (saved === "grid" || saved === "list") setView(saved);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("cws-blog-view", view);
    } catch {
      /* ignore */
    }
  }, [view]);

  const filtered = useMemo(() => filterBlogPosts(posts, search), [posts, search]);

  return (
    <section className="blog-archive-page">
      <div className="corp-container">
        <div className="blog-layout blog-layout--archive">
          <main className="blog-layout__main">
            <header className="blog-archive-page__head">
              <div>
                <h1 className="blog-archive-page__title">Blog</h1>
                <p className="blog-archive-page__subtitle">
                  {filtered.length} {filtered.length === 1 ? "article" : "articles"}
                  {search.trim() ? ` matching “${search.trim()}”` : ""}
                </p>
              </div>
              <div className="blog-archive-page__view-toggle" role="group" aria-label="Layout">
                <button
                  type="button"
                  className={view === "grid" ? "is-active" : undefined}
                  onClick={() => setView("grid")}
                  aria-pressed={view === "grid"}
                >
                  <i className="fas fa-grip" aria-hidden="true" />
                  Grid
                </button>
                <button
                  type="button"
                  className={view === "list" ? "is-active" : undefined}
                  onClick={() => setView("list")}
                  aria-pressed={view === "list"}
                >
                  <i className="fas fa-list" aria-hidden="true" />
                  List
                </button>
              </div>
            </header>
            <BlogArchivePosts posts={filtered} view={view} />
          </main>
          <BlogSidebar
            posts={posts}
            showFeatured={false}
            searchQuery={search}
            onSearchChange={setSearch}
          />
        </div>
      </div>
    </section>
  );
}
