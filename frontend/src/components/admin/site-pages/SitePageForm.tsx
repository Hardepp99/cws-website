"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EntityEditorModePanel, type DesimentorMeta } from "@/components/admin/EntityEditorModePanel";
import { SeoPanel } from "@/components/admin/SeoPanel";
import { SlugField } from "@/components/admin/SlugField";
import { WysiwygField } from "@/components/admin/WysiwygField";
import { WpEditScreen } from "@/components/admin/wp/WpEditScreen";
import { EMPTY_SEO, seoFromPageRow, seoToPagePayload, type AdminSeoData } from "@/lib/admin/seo-types";
import { adminFetch } from "@/lib/admin/client";
import { normalizeDisplayMode, type DisplayMode } from "@/lib/content/display-mode";

const EMPTY_META: DesimentorMeta = {
  hasDocument: false,
  status: null,
  sectionCount: 0,
};

export function SitePageForm({ pageId, isNew }: { pageId?: number; isNew?: boolean }) {
  const router = useRouter();
  const [showWelcome, setShowWelcome] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [template, setTemplate] = useState("default");
  const [status, setStatus] = useState("draft");
  const [displayMode, setDisplayMode] = useState<DisplayMode>("classic");
  const [desimentorMeta, setDesimentorMeta] = useState<DesimentorMeta>(EMPTY_META);
  const [seo, setSeo] = useState<AdminSeoData>({ ...EMPTY_SEO });
  const [slugManual, setSlugManual] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("new") === "1") {
      setShowWelcome(true);
    }
  }, [pageId]);

  useEffect(() => {
    if (!pageId || isNew) return;
    adminFetch<Record<string, unknown>>(`/pages/${pageId}`).then((row) => {
      setTitle(String(row.title ?? ""));
      setSlug(String(row.slug ?? ""));
      setContentHtml(String(row.content_html ?? ""));
      setTemplate(String(row.template ?? "default"));
      setStatus(String(row.status ?? "published"));
      setDisplayMode(normalizeDisplayMode(String(row.display_mode ?? "classic")));
      const meta = row.desimentor_meta as DesimentorMeta | undefined;
      if (meta) setDesimentorMeta(meta);
      setSeo(seoFromPageRow(row as Parameters<typeof seoFromPageRow>[0]));
    }).catch((e) => setErr(String(e)));
  }, [pageId, isNew]);

  function onTitleChange(v: string) {
    setTitle(v);
    if (!seo.title || seo.title === title) {
      setSeo((s) => ({ ...s, title: v }));
    }
  }

  async function saveClassic() {
    setSaving(true);
    setErr("");
    const payload = {
      title,
      slug,
      content_html: contentHtml,
      template,
      status,
      display_mode: displayMode,
      ...seoToPagePayload(seo),
    };
    try {
      if (isNew) {
        const res = await adminFetch<{ id: number }>("/pages", { method: "POST", json: payload });
        router.push(`/admin/site-pages/${res.id}?new=1`);
        router.refresh();
        return;
      }
      await adminFetch(`/pages/${pageId}`, { method: "PUT", json: payload });
      setMsg("Classic content saved. Elementor layout is unchanged.");
    } catch (e) {
      setErr(String(e));
    } finally {
      setSaving(false);
    }
  }

  const classicFields = (
    <>
      <SlugField
        title={title}
        slug={slug}
        onTitleChange={onTitleChange}
        onSlugChange={setSlug}
        slugManual={slugManual}
        onSlugManualChange={setSlugManual}
      />
      <label className="cms-label">Template</label>
      <select className="cms-select" value={template} onChange={(e) => setTemplate(e.target.value)}>
        <option value="default">default</option>
        <option value="services">services</option>
        <option value="contact">contact</option>
      </select>
      <label className="cms-label">Status</label>
      <select className="cms-select" value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="published">Published</option>
        <option value="draft">Draft</option>
      </select>
      <WysiwygField label="Classic content (HTML)" value={contentHtml} onChange={setContentHtml} />
      <p className="cms-field-hint">
        This is the original classic content. It is preserved when you edit with Elementor.
      </p>
      <SeoPanel seo={seo} onChange={setSeo} contentHtml={contentHtml} slug={slug} pathPrefix="/" />
    </>
  );

  return (
    <WpEditScreen
      title={isNew ? "Add new page" : title}
      backHref="/admin/site-pages"
      desimentor={
        !isNew && pageId
          ? { entityType: "page", entityId: pageId, label: "Edit with Elementor" }
          : undefined
      }
      onSave={saveClassic}
      saving={saving}
      saveLabel={isNew ? "Save page" : "Save classic content"}
      message={msg}
      error={err}
    >
      {showWelcome && !isNew ? (
        <div className="cms-notice entity-editor-welcome">
          Page created. Use <strong>Classic editor</strong> for HTML, or <strong>Elementor</strong> for a visual layout.
          Both are saved separately — switch the live version anytime.
        </div>
      ) : null}
      <EntityEditorModePanel
        entityType="page"
        entityId={pageId ?? 0}
        displayMode={displayMode}
        desimentorMeta={desimentorMeta}
        onDisplayModeChange={setDisplayMode}
        isNew={isNew}
        classicPanel={classicFields}
      />
    </WpEditScreen>
  );
}
