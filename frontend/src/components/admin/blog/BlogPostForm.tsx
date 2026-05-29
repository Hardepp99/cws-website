"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EntityEditorModePanel, type DesimentorMeta } from "@/components/admin/EntityEditorModePanel";
import { MediaPickerField } from "@/components/admin/media/MediaPickerField";
import { SeoPanel } from "@/components/admin/SeoPanel";
import { SlugField } from "@/components/admin/SlugField";
import { WysiwygField } from "@/components/admin/WysiwygField";
import { WpEditScreen } from "@/components/admin/wp/WpEditScreen";
import { EMPTY_SEO, parseSeoJson, seoToJson, type AdminSeoData } from "@/lib/admin/seo-types";
import { adminFetch } from "@/lib/admin/client";
import { normalizeDisplayMode, type DisplayMode } from "@/lib/content/display-mode";

const EMPTY_META: DesimentorMeta = { hasDocument: false, status: null, sectionCount: 0 };

export function BlogPostForm({ postId, isNew }: { postId?: number; isNew?: boolean }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [publishedDate, setPublishedDate] = useState(new Date().toISOString().slice(0, 10));
  const [categories, setCategories] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState("draft");
  const [displayMode, setDisplayMode] = useState<DisplayMode>("classic");
  const [desimentorMeta, setDesimentorMeta] = useState<DesimentorMeta>(EMPTY_META);
  const [seo, setSeo] = useState<AdminSeoData>({ ...EMPTY_SEO });
  const [slugManual, setSlugManual] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!postId || isNew) return;
    adminFetch<Record<string, unknown>>(`/blog/${postId}`).then((row) => {
      setTitle(String(row.title ?? ""));
      setSlug(String(row.slug ?? ""));
      setExcerpt(String(row.excerpt ?? ""));
      setContentHtml(String(row.content_html ?? ""));
      setFeaturedImage(String(row.featured_image ?? ""));
      setPublishedDate(String(row.published_date ?? "").slice(0, 10));
      const cats = row.categories;
      if (Array.isArray(cats)) {
        setCategories(cats.map(String).join(", "));
      } else if (typeof cats === "string" && cats) {
        try {
          const parsed = JSON.parse(cats) as unknown;
          setCategories(Array.isArray(parsed) ? parsed.map(String).join(", ") : "");
        } catch {
          setCategories("");
        }
      } else {
        setCategories("");
      }
      setIsFeatured(Boolean(row.is_featured));
      setStatus(String(row.status ?? "published"));
      setDisplayMode(normalizeDisplayMode(String(row.display_mode ?? "classic")));
      const meta = row.desimentor_meta as DesimentorMeta | undefined;
      if (meta) setDesimentorMeta(meta);
      const parsed = parseSeoJson(row.seo);
      setSeo({
        ...parsed,
        title: parsed.title || String(row.title ?? ""),
        description: parsed.description || String(row.excerpt ?? ""),
      });
    }).catch((e) => setErr(String(e)));
  }, [postId, isNew]);

  function onTitleChange(v: string) {
    setTitle(v);
    if (!seo.title || seo.title === title) setSeo((s) => ({ ...s, title: v }));
  }

  async function saveClassic() {
    setSaving(true);
    setErr("");
    const payload = {
      title,
      slug,
      excerpt,
      content_html: contentHtml,
      featured_image: featuredImage || seo.ogImage,
      published_date: publishedDate,
      categories: categories.split(",").map((s) => s.trim()).filter(Boolean),
      is_featured: isFeatured,
      status,
      display_mode: displayMode,
      seo: seoToJson(seo),
    };
    try {
      if (isNew) {
        const res = await adminFetch<{ id: number }>("/blog", { method: "POST", json: payload });
        router.push(`/admin/blog/${res.id}`);
        router.refresh();
        return;
      }
      await adminFetch(`/blog/${postId}`, { method: "PUT", json: payload });
      setMsg("Classic post content saved. Desimentor layout is unchanged.");
    } catch (e) {
      setErr(String(e));
    } finally {
      setSaving(false);
    }
  }

  const classicPanel = (
    <>
      <SlugField
        title={title}
        slug={slug}
        onTitleChange={onTitleChange}
        onSlugChange={setSlug}
        slugManual={slugManual}
        onSlugManualChange={setSlugManual}
        urlPrefix="/blog/"
      />
      <label className="cms-label">Excerpt</label>
      <textarea className="cms-textarea" rows={3} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
      <WysiwygField label="Classic content (HTML)" value={contentHtml} onChange={setContentHtml} height={400} />
      <p className="cms-field-hint">
        Original HTML content. It stays saved when you build the post with Desimentor.
      </p>
      <MediaPickerField
        label="Featured image"
        value={featuredImage}
        onChange={setFeaturedImage}
        mediaFilter="image"
      />
      <label className="cms-label">Published date</label>
      <input className="cms-input" type="date" value={publishedDate} onChange={(e) => setPublishedDate(e.target.value)} />
      <label className="cms-label">Categories</label>
      <input
        className="cms-input"
        value={categories}
        onChange={(e) => setCategories(e.target.value)}
        placeholder="SEO, Web Development (comma-separated)"
      />
      <label className="cms-check">
        <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
        Featured post (shown in blog sidebar)
      </label>
      <label className="cms-label">Status</label>
      <select className="cms-select" value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="published">Published</option>
        <option value="draft">Draft</option>
      </select>
      <SeoPanel seo={seo} onChange={setSeo} contentHtml={contentHtml} slug={slug} pathPrefix="/blog/" />
    </>
  );

  return (
    <WpEditScreen
      title={isNew ? "Add new post" : title}
      backHref="/admin/blog"
      desimentor={
        !isNew && postId
          ? { entityType: "blog_post", entityId: postId }
          : undefined
      }
      onSave={saveClassic}
      saving={saving}
      saveLabel={isNew ? "Save post" : "Save classic content"}
      message={msg}
      error={err}
    >
      <EntityEditorModePanel
        entityType="blog_post"
        entityId={postId ?? 0}
        displayMode={displayMode}
        desimentorMeta={desimentorMeta}
        onDisplayModeChange={setDisplayMode}
        isNew={isNew}
        classicPanel={classicPanel}
      />
    </WpEditScreen>
  );
}
