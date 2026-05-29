"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdminDialog } from "@/components/admin/dialog/AdminDialogProvider";
import { adminFetch } from "@/lib/admin/client";
import { SectionEditor, type SectionRecord } from "./SectionEditor";
import { HOMEPAGE_LAYOUTS, emptySection, layoutLabel } from "./layouts";

export function HomepageBuilder() {
  const { confirm } = useAdminDialog();
  const [sections, setSections] = useState<SectionRecord[]>([]);
  const [pageId, setPageId] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(0);
  const [addLayout, setAddLayout] = useState("cta");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showJson, setShowJson] = useState(false);

  useEffect(() => {
    adminFetch<{ pageId: number; sections: SectionRecord[] }>("/homepage/sections")
      .then((data) => {
        setPageId(data.pageId);
        setSections(data.sections || []);
        setExpanded(data.sections?.length ? 0 : null);
      })
      .catch((e) => setErr(String(e)))
      .finally(() => setLoading(false));
  }, []);

  function move(index: number, dir: -1 | 1) {
    const next = index + dir;
    if (next < 0 || next >= sections.length) return;
    const copy = [...sections];
    [copy[index], copy[next]] = [copy[next], copy[index]];
    setSections(copy);
    setExpanded(next);
  }

  async function remove(index: number) {
    const ok = await confirm({
      title: "Remove section",
      message: "Remove this section from the homepage?",
      confirmLabel: "Remove",
      danger: true,
    });
    if (!ok) return;
    setSections(sections.filter((_, i) => i !== index));
    setExpanded(null);
  }

  function addSection() {
    setSections([...sections, emptySection(addLayout)]);
    setExpanded(sections.length);
  }

  async function save() {
    setSaving(true);
    setErr("");
    setMsg("");
    try {
      await adminFetch("/homepage/sections", {
        method: "PUT",
        json: { pageId, sections },
      });
      setMsg(`Saved ${sections.length} sections. Refresh the website to see changes.`);
    } catch (e) {
      setErr(String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell title="Homepage">
      <AdminPageHeader
        title="Homepage sections (legacy builder)"
        desimentor={pageId > 0 ? { entityType: "homepage", entityId: pageId } : undefined}
        actions={
          <>
            {pageId > 0 ? (
              <Link
                href={`/admin/site-pages/${pageId}`}
                className="page-title-action page-title-action-secondary"
              >
                Classic ↔ Desimentor
              </Link>
            ) : null}
            <Link href="/admin/homepage" className="page-title-action page-title-action-secondary">
              Section list
            </Link>
          </>
        }
      />
      <div className="cms-card">
        <h2>Homepage sections</h2>
        <p className="cms-field-hint">
          Edit each block with form fields and WYSIWYG editors — same sections as on your live homepage. Drag order with ↑ ↓.
        </p>
        {msg ? <div className="cms-notice">{msg}</div> : null}
        {err ? <div className="cms-notice err">{err}</div> : null}

        {loading ? (
          <p>Loading sections…</p>
        ) : (
          <>
            <div className="cms-section-toolbar">
              <select className="cms-select" value={addLayout} onChange={(e) => setAddLayout(e.target.value)}>
                {HOMEPAGE_LAYOUTS.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
              <button type="button" className="cms-btn cms-btn-ghost" onClick={addSection}>
                + Add section
              </button>
              <button type="button" className="cms-btn cms-btn-ghost" onClick={() => setShowJson(!showJson)}>
                {showJson ? "Hide JSON" : "Advanced JSON"}
              </button>
              <button type="button" className="cms-btn cms-btn-green" onClick={save} disabled={saving}>
                {saving ? "Saving…" : "Save homepage"}
              </button>
            </div>

            {showJson ? (
              <textarea
                className="cms-textarea code"
                value={JSON.stringify(sections, null, 2)}
                onChange={(e) => {
                  try {
                    setSections(JSON.parse(e.target.value));
                  } catch {
                    /* ignore while typing */
                  }
                }}
              />
            ) : (
              <div className="cms-section-list">
                {sections.map((section, index) => {
                  const layout = String(section.acfFcLayout ?? "");
                  const isOpen = expanded === index;
                  return (
                    <div key={`${layout}-${index}`} className={`cms-section-card${isOpen ? " is-open" : ""}`}>
                      <div className="cms-section-card-head">
                        <button
                          type="button"
                          className="cms-section-toggle"
                          onClick={() => setExpanded(isOpen ? null : index)}
                        >
                          <span className="cms-section-layout">{layoutLabel(layout)}</span>
                          <span className="cms-section-preview">
                            {String(section.title || section.badge || "").slice(0, 60) || "—"}
                          </span>
                        </button>
                        <div className="cms-section-actions">
                          <button type="button" className="cms-btn-text" onClick={() => move(index, -1)} disabled={index === 0} title="Move up">
                            ↑
                          </button>
                          <button
                            type="button"
                            className="cms-btn-text"
                            onClick={() => move(index, 1)}
                            disabled={index === sections.length - 1}
                            title="Move down"
                          >
                            ↓
                          </button>
                          <button type="button" className="cms-btn-text danger" onClick={() => remove(index)}>
                            Delete
                          </button>
                        </div>
                      </div>
                      {isOpen ? (
                        <div className="cms-section-card-body">
                          <SectionEditor
                            section={section}
                            onChange={(next) => {
                              const copy = [...sections];
                              copy[index] = next;
                              setSections(copy);
                            }}
                          />
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </AdminShell>
  );
}
