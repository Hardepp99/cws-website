"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SectionCommonFields } from "@/components/admin/homepage/SectionCommonFields";
import type { SectionRecord } from "@/components/admin/homepage/SectionEditor";
import { SectionHeaderFields } from "@/components/admin/homepage/SectionHeaderFields";
import { SectionRepeaterNav } from "@/components/admin/homepage/SectionRepeaterNav";
import { sectionHasRepeaters } from "@/components/admin/homepage/section-repeaters";
import { HOMEPAGE_LAYOUTS, emptySection, layoutLabel } from "@/components/admin/homepage/layouts";
import { WpEditScreen } from "@/components/admin/wp/WpEditScreen";
import { adminFetch } from "@/lib/admin/client";

type SectionRowResponse = {
  section: SectionRecord;
  status?: string;
  adminTitle?: string;
  pageId?: number;
};

export function HomepageSectionForm({ sectionId, isNew }: { sectionId?: number; isNew?: boolean }) {
  const router = useRouter();
  const [section, setSection] = useState<SectionRecord | null>(isNew ? emptySection("cta") : null);
  const [layoutPick, setLayoutPick] = useState("cta");
  const [adminTitle, setAdminTitle] = useState("");
  const [status, setStatus] = useState("draft");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [homepagePageId, setHomepagePageId] = useState(0);

  useEffect(() => {
    if (!sectionId || isNew) return;
    setLoading(true);
    adminFetch<SectionRowResponse>(`/homepage/sections/${sectionId}`)
      .then((data) => {
        setSection(data.section);
        setStatus(String(data.status ?? "draft"));
        setAdminTitle(String(data.adminTitle ?? ""));
        setHomepagePageId(Number(data.pageId ?? 0));
      })
      .catch((e) => setErr(String(e)))
      .finally(() => setLoading(false));
  }, [sectionId, isNew]);

  useEffect(() => {
    if (isNew) {
      setSection(emptySection(layoutPick));
    }
  }, [layoutPick, isNew]);

  useEffect(() => {
    if (!isNew || homepagePageId) return;
    adminFetch<{ pageId: number }>("/homepage/sections")
      .then((data) => setHomepagePageId(Number(data.pageId ?? 0)))
      .catch(() => {});
  }, [isNew, homepagePageId]);

  async function save() {
    if (!section) return;
    setSaving(true);
    setErr("");
    setMsg("");
    const payload = { section, status, adminTitle };
    try {
      if (isNew) {
        const res = await adminFetch<{ id: number }>("/homepage/sections", {
          method: "POST",
          json: payload,
        });
        router.push(`/admin/homepage/${res.id}/edit`);
        router.refresh();
        return;
      }
      await adminFetch(`/homepage/sections/${sectionId}`, { method: "PUT", json: payload });
      setMsg("Section saved.");
    } catch (e) {
      setErr(String(e));
    } finally {
      setSaving(false);
    }
  }

  const layout = String(section?.acfFcLayout ?? layoutPick);
  const screenTitle = isNew
    ? "Add homepage section"
    : adminTitle || `Edit: ${layoutLabel(layout)}`;

  if (loading) {
    return <p>Loading…</p>;
  }

  if (!section && !isNew) {
    return <p className="cms-notice err">{err || "Section not found."}</p>;
  }

  return (
    <WpEditScreen
      title={screenTitle}
      backHref="/admin/homepage"
      desimentor={
        homepagePageId > 0 ? { entityType: "homepage", entityId: homepagePageId } : undefined
      }
      onSave={save}
      saving={saving}
      saveLabel={status === "published" ? (isNew ? "Publish" : "Update") : "Save draft"}
      message={msg}
      error={err}
    >
      {isNew ? (
        <>
          <label className="cms-label">Section type</label>
          <select
            className="cms-select"
            value={layoutPick}
            onChange={(e) => setLayoutPick(e.target.value)}
          >
            {HOMEPAGE_LAYOUTS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </>
      ) : null}
      <SectionCommonFields
        adminTitle={adminTitle}
        status={status}
        layout={layout}
        onAdminTitleChange={setAdminTitle}
        onStatusChange={setStatus}
        showLayout={!isNew}
      />
      {section ? (
        <>
          <SectionHeaderFields section={section} onChange={setSection} />
          {!isNew && sectionId && sectionHasRepeaters(layout) ? (
            <SectionRepeaterNav sectionId={sectionId} section={section} />
          ) : null}
        </>
      ) : null}
    </WpEditScreen>
  );
}
