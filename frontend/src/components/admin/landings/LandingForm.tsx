"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EntityEditorModePanel, type DesimentorMeta } from "@/components/admin/EntityEditorModePanel";
import { SeoPanel } from "@/components/admin/SeoPanel";
import { SlugField } from "@/components/admin/SlugField";
import { WysiwygField } from "@/components/admin/WysiwygField";
import { WpEditScreen } from "@/components/admin/wp/WpEditScreen";
import { EMPTY_SEO, type AdminSeoData } from "@/lib/admin/seo-types";
import { adminFetch } from "@/lib/admin/client";
import { normalizeDisplayMode, type DisplayMode } from "@/lib/content/display-mode";

const EMPTY_META: DesimentorMeta = { hasDocument: false, status: null, sectionCount: 0 };

export function LandingForm({ landingId, isNew }: { landingId?: number; isNew?: boolean }) {
  const router = useRouter();
  const [serviceName, setServiceName] = useState("");
  const [slug, setSlug] = useState("");
  const [intro, setIntro] = useState("");
  const [benefits, setBenefits] = useState("");
  const [deliverables, setDeliverables] = useState("");
  const [faqJson, setFaqJson] = useState("[]");
  const [seoBody, setSeoBody] = useState("");
  const [seo, setSeo] = useState<AdminSeoData>({ ...EMPTY_SEO });
  const [status, setStatus] = useState("draft");
  const [displayMode, setDisplayMode] = useState<DisplayMode>("classic");
  const [desimentorMeta, setDesimentorMeta] = useState<DesimentorMeta>(EMPTY_META);
  const [slugManual, setSlugManual] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!landingId || isNew) return;
    adminFetch<Record<string, unknown>>(`/landings/${landingId}`).then((data) => {
      const b = JSON.parse((data.benefits as string) || "[]") as string[];
      const d = JSON.parse((data.deliverables as string) || "[]") as string[];
      const theme = JSON.parse((data.theme as string) || "{}") as Record<string, string>;
      setServiceName(String(data.service_name ?? ""));
      setSlug(String(data.slug ?? ""));
      setIntro(String(data.intro ?? ""));
      setBenefits(b.join("\n"));
      setDeliverables(d.join("\n"));
      setFaqJson(JSON.stringify(JSON.parse((data.faq as string) || "[]"), null, 2));
      setSeoBody(String(data.seo_body_html ?? ""));
      setStatus(String(data.status ?? "published"));
      setDisplayMode(normalizeDisplayMode(String(data.display_mode ?? "classic")));
      const meta = data.desimentor_meta as DesimentorMeta | undefined;
      if (meta) setDesimentorMeta(meta);
      setSeo({
        focusKeyword: theme.seoFocusKeyword ?? "",
        title: String(data.page_title ?? data.service_name ?? ""),
        description: String(data.page_description ?? ""),
        keywords: String(data.page_keywords ?? ""),
        canonical: theme.seoCanonical ?? "",
        ogImage: theme.seoOgImage ?? "",
        robots: theme.seoRobots === "noindex" ? "noindex" : "index",
      });
    }).catch((e) => setErr(String(e)));
  }, [landingId, isNew]);

  function onNameChange(v: string) {
    setServiceName(v);
    if (!seo.title || seo.title === serviceName) setSeo((s) => ({ ...s, title: v }));
  }

  async function saveClassic() {
    setSaving(true);
    setErr("");
    const theme = {
      seoFocusKeyword: seo.focusKeyword,
      seoCanonical: seo.canonical,
      seoOgImage: seo.ogImage,
      seoRobots: seo.robots,
    };
    const payload = {
      slug,
      service_name: serviceName,
      page_title: seo.title,
      page_description: seo.description,
      page_keywords: seo.keywords,
      intro,
      benefits: benefits.split("\n").map((s) => s.trim()).filter(Boolean),
      deliverables: deliverables.split("\n").map((s) => s.trim()).filter(Boolean),
      faq: JSON.parse(faqJson),
      related_slugs: [],
      theme,
      seo_body_html: seoBody,
      status,
      display_mode: displayMode,
    };
    try {
      if (isNew) {
        const res = await adminFetch<{ id: number }>("/landings", { method: "POST", json: payload });
        router.push(`/admin/landings/${res.id}?new=1`);
        router.refresh();
        return;
      }
      await adminFetch(`/landings/${landingId}`, { method: "PUT", json: payload });
      setMsg("Classic landing content saved.");
    } catch (e) {
      setErr(String(e));
    } finally {
      setSaving(false);
    }
  }

  const classicPanel = (
    <>
      <SlugField title={serviceName} slug={slug} titleLabel="Service name" onTitleChange={onNameChange} onSlugChange={setSlug} slugManual={slugManual} onSlugManualChange={setSlugManual} />
      <label className="cms-label">Intro</label>
      <textarea className="cms-textarea" rows={3} value={intro} onChange={(e) => setIntro(e.target.value)} />
      <label className="cms-label">Benefits (one per line)</label>
      <textarea className="cms-textarea" rows={5} value={benefits} onChange={(e) => setBenefits(e.target.value)} />
      <label className="cms-label">Deliverables (one per line)</label>
      <textarea className="cms-textarea" rows={5} value={deliverables} onChange={(e) => setDeliverables(e.target.value)} />
      <label className="cms-label">FAQ (JSON)</label>
      <textarea className="cms-textarea code" style={{ minHeight: 120 }} value={faqJson} onChange={(e) => setFaqJson(e.target.value)} />
      <SeoPanel seo={seo} onChange={setSeo} contentHtml={seoBody} slug={slug} pathPrefix="/" />
      <WysiwygField label="Classic SEO body (HTML)" value={seoBody} onChange={setSeoBody} height={320} />
      <label className="cms-label">Status</label>
      <select className="cms-select" value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="published">Published</option>
        <option value="draft">Draft</option>
      </select>
    </>
  );

  return (
    <WpEditScreen
      title={isNew ? "Add service landing" : serviceName}
      backHref="/admin/landings"
      desimentor={!isNew && landingId ? { entityType: "service_landing", entityId: landingId, label: "Edit with Elementor" } : undefined}
      onSave={saveClassic}
      saving={saving}
      saveLabel={isNew ? "Save landing" : "Save classic content"}
      message={msg}
      error={err}
    >
      <EntityEditorModePanel
        entityType="service_landing"
        entityId={landingId ?? 0}
        displayMode={displayMode}
        desimentorMeta={desimentorMeta}
        onDisplayModeChange={setDisplayMode}
        isNew={isNew}
        classicPanel={classicPanel}
      />
    </WpEditScreen>
  );
}
