"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaqEditorField } from "@/components/admin/FaqEditorField";
import { MediaPickerField } from "@/components/admin/media/MediaPickerField";
import { SlugField } from "@/components/admin/SlugField";
import { WysiwygField } from "@/components/admin/WysiwygField";
import { WpEditScreen } from "@/components/admin/wp/WpEditScreen";
import { parseFaqsFromAdminRow } from "@/lib/admin/parse-faqs";
import { filterValidFaqs } from "@/lib/faq/filter";
import { getSiteUrl } from "@/lib/site-url";
import { adminFetch } from "@/lib/admin/client";
import type { FaqItem } from "@/lib/wordpress/types";

export function PortfolioItemForm({ itemId, isNew }: { itemId?: number; isNew?: boolean }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManual, setSlugManual] = useState(false);
  const [clientName, setClientName] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [sortOrder, setSortOrder] = useState(0);
  const [showOnHomepage, setShowOnHomepage] = useState(true);
  const [status, setStatus] = useState("published");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  const siteBase = getSiteUrl();

  useEffect(() => {
    if (!itemId || isNew) return;
    adminFetch<Record<string, unknown>>(`/portfolio/${itemId}`)
      .then((row) => {
        setTitle(String(row.title ?? ""));
        setSlug(String(row.slug ?? ""));
        setClientName(String(row.client_name ?? ""));
        setLocation(String(row.location ?? ""));
        setCategory(String(row.category ?? ""));
        setImage(String(row.image ?? ""));
        setProjectUrl(String(row.href ?? ""));
        setExcerpt(String(row.excerpt ?? ""));
        setContent(String(row.content ?? ""));
        setFaqs(parseFaqsFromAdminRow(row));
        setSortOrder(Number(row.sort_order) || 0);
        setShowOnHomepage(Boolean(row.show_on_homepage));
        setStatus(String(row.status ?? "published"));
        setSlugManual(Boolean(row.slug));
      })
      .catch((e) => setErr(String(e)));
  }, [itemId, isNew]);

  async function save() {
    setSaving(true);
    setErr("");
    const payload = {
      title: title || clientName,
      slug: slug || undefined,
      client_name: clientName || title,
      location,
      category,
      image,
      href: projectUrl,
      excerpt,
      content,
      sort_order: sortOrder,
      show_on_homepage: showOnHomepage,
      status,
      faqs: filterValidFaqs(faqs),
    };
    try {
      if (isNew) {
        const res = await adminFetch<{ id: number }>("/portfolio", { method: "POST", json: payload });
        router.push(`/admin/portfolio/${res.id}`);
        router.refresh();
        return;
      }
      await adminFetch(`/portfolio/${itemId}`, { method: "PUT", json: payload });
      setMsg("Saved.");
    } catch (e) {
      setErr(String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <WpEditScreen
      title={isNew ? "Add local client project" : "Edit portfolio item"}
      backHref="/admin/portfolio"
      backLabel="← Portfolio"
      onSave={save}
      saving={saving}
      message={msg}
      error={err}
    >
      <p className="cms-field-hint">
        Each project gets its own page at <code>/portfolio/your-slug</code>. Section title &amp; limits:{" "}
        <Link href="/admin/settings">Settings → Portfolio section</Link>.
      </p>

      {!isNew && slug && siteBase ? (
        <p className="cms-field-hint">
          <a href={`${siteBase}/portfolio/${slug}`} target="_blank" rel="noopener noreferrer">
            View public project page ↗
          </a>
        </p>
      ) : null}

      <SlugField
        title={clientName}
        slug={slug}
        titleLabel="Client / business name"
        onTitleChange={setClientName}
        onSlugChange={setSlug}
        slugManual={slugManual}
        onSlugManualChange={setSlugManual}
        urlPrefix="/portfolio/"
      />

      <label className="cms-label">Project title (optional)</label>
      <input className="cms-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Corporate website redesign" />

      <label className="cms-label">Location</label>
      <input className="cms-input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Zirakpur · Chandigarh" />

      <label className="cms-label">Category / service type</label>
      <input className="cms-input" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Website · Ecommerce · SEO" />

      <MediaPickerField label="Screenshot / image" value={image} onChange={setImage} mediaFilter="image" />

      <label className="cms-label">Live site URL (optional)</label>
      <input
        className="cms-input"
        value={projectUrl}
        onChange={(e) => setProjectUrl(e.target.value)}
        placeholder="https://client-website.com"
      />
      <p className="cms-field-hint">Shown on the project page as &quot;Visit live site&quot; — cards always link to the detail page.</p>

      <label className="cms-label">Short summary (card + SEO)</label>
      <textarea className="cms-textarea" rows={3} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />

      <WysiwygField label="Project details (full page)" value={content} onChange={setContent} height={360} />

      <FaqEditorField
        items={faqs}
        onChange={setFaqs}
        hint="Project-specific questions shown below the case study on the public page."
      />

      <label className="cms-label">Sort order (lower = first)</label>
      <input className="cms-input" type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value) || 0)} />

      <label className="cms-label" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <input type="checkbox" checked={showOnHomepage} onChange={(e) => setShowOnHomepage(e.target.checked)} />
        Show on homepage portfolio
      </label>

      <label className="cms-label">Status</label>
      <select className="cms-input" value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="published">Published</option>
        <option value="draft">Draft</option>
      </select>
    </WpEditScreen>
  );
}
