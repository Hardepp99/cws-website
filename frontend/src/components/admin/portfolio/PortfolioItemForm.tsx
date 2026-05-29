"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MediaPickerField } from "@/components/admin/media/MediaPickerField";
import { WpEditScreen } from "@/components/admin/wp/WpEditScreen";
import { adminFetch } from "@/lib/admin/client";

export function PortfolioItemForm({ itemId, isNew }: { itemId?: number; isNew?: boolean }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [href, setHref] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [showOnHomepage, setShowOnHomepage] = useState(true);
  const [status, setStatus] = useState("published");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!itemId || isNew) return;
    adminFetch<Record<string, unknown>>(`/portfolio/${itemId}`)
      .then((row) => {
        setTitle(String(row.title ?? ""));
        setClientName(String(row.client_name ?? ""));
        setLocation(String(row.location ?? ""));
        setCategory(String(row.category ?? ""));
        setImage(String(row.image ?? ""));
        setHref(String(row.href ?? ""));
        setExcerpt(String(row.excerpt ?? ""));
        setSortOrder(Number(row.sort_order) || 0);
        setShowOnHomepage(Boolean(row.show_on_homepage));
        setStatus(String(row.status ?? "published"));
      })
      .catch((e) => setErr(String(e)));
  }, [itemId, isNew]);

  async function save() {
    setSaving(true);
    setErr("");
    const payload = {
      title: title || clientName,
      client_name: clientName || title,
      location,
      category,
      image,
      href,
      excerpt,
      sort_order: sortOrder,
      show_on_homepage: showOnHomepage,
      status,
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
        Showcase local clients from Zirakpur, Chandigarh, Mohali & Punjab. Tick &quot;Show on homepage&quot; to
        include in the homepage portfolio grid. Section title &amp; limits:{" "}
        <Link href="/admin/settings">Settings → Portfolio section</Link>.
      </p>

      <label className="cms-label">Client / business name</label>
      <input className="cms-input" value={clientName} onChange={(e) => setClientName(e.target.value)} />

      <label className="cms-label">Project title (optional)</label>
      <input className="cms-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Corporate website redesign" />

      <label className="cms-label">Location</label>
      <input className="cms-input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Zirakpur · Chandigarh" />

      <label className="cms-label">Category / service type</label>
      <input className="cms-input" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Website · Ecommerce · SEO" />

      <MediaPickerField label="Screenshot / image" value={image} onChange={setImage} mediaFilter="image" />

      <label className="cms-label">Project URL (optional)</label>
      <input className="cms-input" value={href} onChange={(e) => setHref(e.target.value)} placeholder="https://..." />

      <label className="cms-label">Short description</label>
      <textarea className="cms-textarea" rows={3} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />

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
