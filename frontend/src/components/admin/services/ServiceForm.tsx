"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EntityEditorModePanel, type DesimentorMeta } from "@/components/admin/EntityEditorModePanel";
import { SeoPanel } from "@/components/admin/SeoPanel";
import { SlugField } from "@/components/admin/SlugField";
import { WysiwygField } from "@/components/admin/WysiwygField";
import { WpEditScreen } from "@/components/admin/wp/WpEditScreen";
import { FaqEditorField } from "@/components/admin/FaqEditorField";
import { EMPTY_SEO, parseSeoJson, seoToJson, type AdminSeoData } from "@/lib/admin/seo-types";
import { parseFaqsFromAdminRow } from "@/lib/admin/parse-faqs";
import { adminFetch } from "@/lib/admin/client";
import { normalizeDisplayMode, type DisplayMode } from "@/lib/content/display-mode";
import { filterValidFaqs } from "@/lib/faq/filter";
import type { FaqItem } from "@/lib/wordpress/types";

const EMPTY_META: DesimentorMeta = { hasDocument: false, status: null, sectionCount: 0 };

export function ServiceForm({ serviceId, isNew }: { serviceId?: number; isNew?: boolean }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [priceBadge, setPriceBadge] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [featuresText, setFeaturesText] = useState("");
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [ctaTitle, setCtaTitle] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [status, setStatus] = useState("draft");
  const [displayMode, setDisplayMode] = useState<DisplayMode>("classic");
  const [desimentorMeta, setDesimentorMeta] = useState<DesimentorMeta>(EMPTY_META);
  const [seo, setSeo] = useState<AdminSeoData>({ ...EMPTY_SEO });
  const [slugManual, setSlugManual] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!serviceId || isNew) return;
    adminFetch<Record<string, unknown>>(`/services/${serviceId}`).then((data) => {
      setTitle(String(data.title ?? ""));
      setSlug(String(data.slug ?? ""));
      setHeroTitle(String(data.hero_title ?? ""));
      setHeroSubtitle(String(data.hero_subtitle ?? ""));
      setPriceBadge(String(data.price_badge ?? ""));
      setContentHtml(String(data.content_html ?? ""));
      setCtaTitle(String(data.cta_title ?? ""));
      setCtaText(String(data.cta_text ?? ""));
      setStatus(String(data.status ?? "published"));
      setDisplayMode(normalizeDisplayMode(String(data.display_mode ?? "classic")));
      const meta = data.desimentor_meta as DesimentorMeta | undefined;
      if (meta) setDesimentorMeta(meta);
      const feats = JSON.parse((data.features as string) || "[]") as { title?: string }[] | string[];
      if (Array.isArray(feats) && typeof feats[0] === "string") {
        setFeaturesText((feats as string[]).join("\n"));
      } else if (Array.isArray(feats)) {
        setFeaturesText(feats.map((f) => (typeof f === "object" && f?.title ? f.title : String(f))).join("\n"));
      }
      const parsed = parseSeoJson(data.seo);
      setSeo({ ...parsed, title: parsed.title || String(data.title ?? "") });
      setFaqs(parseFaqsFromAdminRow(data));
    }).catch((e) => setErr(String(e)));
  }, [serviceId, isNew]);

  function onTitleChange(v: string) {
    setTitle(v);
    if (!heroTitle) setHeroTitle(v);
    if (!seo.title || seo.title === title) setSeo((s) => ({ ...s, title: v }));
  }

  async function saveClassic() {
    setSaving(true);
    setErr("");
    const features = featuresText.split("\n").map((s) => s.trim()).filter(Boolean);
    const payload = {
      slug,
      title,
      hero_title: heroTitle || title,
      hero_subtitle: heroSubtitle,
      price_badge: priceBadge,
      content_html: contentHtml,
      features,
      cta_title: ctaTitle,
      cta_text: ctaText,
      status,
      display_mode: displayMode,
      seo: seoToJson(seo),
      faqs: filterValidFaqs(faqs),
    };
    try {
      if (isNew) {
        const res = await adminFetch<{ id: number }>("/services", { method: "POST", json: payload });
        router.push(`/admin/services/${res.id}?new=1`);
        router.refresh();
        return;
      }
      await adminFetch(`/services/${serviceId}`, { method: "PUT", json: payload });
      setMsg("Classic service content saved.");
    } catch (e) {
      setErr(String(e));
    } finally {
      setSaving(false);
    }
  }

  const classicPanel = (
    <>
      <SlugField title={title} slug={slug} onTitleChange={onTitleChange} onSlugChange={setSlug} slugManual={slugManual} onSlugManualChange={setSlugManual} />
      <label className="cms-label">Hero title</label>
      <input className="cms-input" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} />
      <label className="cms-label">Hero subtitle</label>
      <textarea className="cms-textarea" rows={2} value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} />
      <label className="cms-label">Price badge</label>
      <input className="cms-input" value={priceBadge} onChange={(e) => setPriceBadge(e.target.value)} />
      <WysiwygField label="Classic body (HTML)" value={contentHtml} onChange={setContentHtml} height={360} />
      <label className="cms-label">Features (one per line)</label>
      <textarea className="cms-textarea" rows={5} value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} />
      <FaqEditorField items={faqs} onChange={setFaqs} />
      <label className="cms-label">CTA title</label>
      <input className="cms-input" value={ctaTitle} onChange={(e) => setCtaTitle(e.target.value)} />
      <label className="cms-label">CTA text</label>
      <textarea className="cms-textarea" rows={2} value={ctaText} onChange={(e) => setCtaText(e.target.value)} />
      <label className="cms-label">Status</label>
      <select className="cms-select" value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="published">Published</option>
        <option value="draft">Draft</option>
      </select>
      <SeoPanel seo={seo} onChange={setSeo} contentHtml={contentHtml} slug={slug} pathPrefix="/" />
    </>
  );

  return (
    <WpEditScreen
      title={isNew ? "Add new service" : title}
      backHref="/admin/services"
      desimentor={!isNew && serviceId ? { entityType: "service", entityId: serviceId } : undefined}
      onSave={saveClassic}
      saving={saving}
      saveLabel={isNew ? "Save service" : "Save classic content"}
      message={msg}
      error={err}
    >
      <EntityEditorModePanel
        entityType="service"
        entityId={serviceId ?? 0}
        displayMode={displayMode}
        desimentorMeta={desimentorMeta}
        onDisplayModeChange={setDisplayMode}
        isNew={isNew}
        classicPanel={classicPanel}
      />
    </WpEditScreen>
  );
}
