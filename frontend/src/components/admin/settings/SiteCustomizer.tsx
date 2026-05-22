"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { SiteCustomizerControl } from "@/components/admin/settings/SiteCustomizerControl";
import { adminFetch } from "@/lib/admin/client";
import {
  ALL_SETTINGS_FIELDS,
  SITE_SETTINGS_SECTIONS,
  emptySettingsFromFields,
} from "@/lib/admin/site-settings-sections";
import {
  CUSTOMIZE_READY_MESSAGE,
  CUSTOMIZE_SETTINGS_MESSAGE,
} from "@/lib/customize/preview-messages";
import "@/app/admin/(panel)/settings/site-customizer.css";

type Settings = Record<string, string>;

export function SiteCustomizer() {
  const [data, setData] = useState<Settings>(emptySettingsFromFields);
  const [saved, setSaved] = useState<Settings>(emptySettingsFromFields);
  const [activeSection, setActiveSection] = useState(SITE_SETTINGS_SECTIONS[0]?.id ?? "identity");
  const [panelOpen, setPanelOpen] = useState(true);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [previewReady, setPreviewReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isDirty = JSON.stringify(data) !== JSON.stringify(saved);

  const postToPreview = useCallback((settings: Settings) => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    win.postMessage({ type: CUSTOMIZE_SETTINGS_MESSAGE, settings }, window.location.origin);
  }, []);

  useEffect(() => {
    adminFetch<Settings>("/settings")
      .then((d) => {
        const flat = emptySettingsFromFields();
        for (const f of ALL_SETTINGS_FIELDS) {
          flat[f.key] = String((d as Settings)[f.key] ?? "");
        }
        setData(flat);
        setSaved(flat);
      })
      .catch((e) => setErr(String(e)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === CUSTOMIZE_READY_MESSAGE) {
        setPreviewReady(true);
        postToPreview(data);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [data, postToPreview]);

  useEffect(() => {
    if (!previewReady) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => postToPreview(data), 120);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [data, previewReady, postToPreview]);

  function updateField(key: string, value: string) {
    setData((prev) => ({ ...prev, [key]: value }));
    setMsg("");
  }

  async function publish() {
    setSaving(true);
    setErr("");
    try {
      await adminFetch("/settings", { method: "PUT", json: data });
      setSaved({ ...data });
      setMsg("Published — changes are live on the website.");
    } catch (e) {
      setErr(String(e));
    } finally {
      setSaving(false);
    }
  }

  const section = SITE_SETTINGS_SECTIONS.find((s) => s.id === activeSection);

  return (
    <div className="site-customizer" role="application" aria-label="Site customizer">
      <header className="customize-controls-header">
        <div className="customize-controls-header__left">
          <button
            type="button"
            className="customize-controls-close"
            onClick={() => setPanelOpen((o) => !o)}
            aria-expanded={panelOpen}
            aria-label={panelOpen ? "Collapse customize panel" : "Expand customize panel"}
          >
            <i className={`fa-solid ${panelOpen ? "fa-chevron-left" : "fa-chevron-right"}`} aria-hidden="true" />
          </button>
          <Link href="/admin" className="customize-controls-back">
            <i className="fa-solid fa-xmark" aria-hidden="true" />
            <span>Close</span>
          </Link>
          <span className="customize-controls-title">
            Customizing <strong>Site Settings</strong>
          </span>
        </div>
        <div className="customize-controls-header__right">
          {isDirty ? <span className="customize-unsaved-badge">Unsaved changes</span> : null}
          {msg ? <span className="customize-notice-ok">{msg}</span> : null}
          {err ? <span className="customize-notice-err">{err}</span> : null}
          <button
            type="button"
            className="customize-publish"
            onClick={publish}
            disabled={saving || loading || !isDirty}
          >
            {saving ? "Publishing…" : "Publish"}
          </button>
        </div>
      </header>

      <div className={`customize-layout${panelOpen ? "" : " customize-layout--panel-collapsed"}`}>
        <aside className="customize-panel" aria-label="Customize settings">
          <nav className="customize-sections" aria-label="Setting sections">
            {SITE_SETTINGS_SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`customize-section-btn${activeSection === s.id ? " is-active" : ""}`}
                onClick={() => setActiveSection(s.id)}
                aria-current={activeSection === s.id ? "true" : undefined}
              >
                <i className={`fa-solid ${s.icon}`} aria-hidden="true" />
                <span>{s.label}</span>
              </button>
            ))}
          </nav>

          <div className="customize-panel-content">
            {loading ? (
              <p className="customize-loading">Loading settings…</p>
            ) : section ? (
              <>
                <div className="customize-panel-heading">
                  <h2>{section.label}</h2>
                  {section.description ? <p>{section.description}</p> : null}
                </div>
                <div className="customize-controls">
                  {section.fields.map((field) => (
                    <SiteCustomizerControl
                      key={field.key}
                      field={field}
                      value={data[field.key] ?? ""}
                      onChange={(v) => updateField(field.key, v)}
                    />
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </aside>

        <div className="customize-preview">
          <div className="customize-preview-toolbar">
            <span className="customize-preview-label">
              <i className="fa-solid fa-desktop" aria-hidden="true" /> Live preview
            </span>
            <a
              href="/customize-preview"
              target="_blank"
              rel="noopener noreferrer"
              className="customize-preview-open"
            >
              Open in new tab
            </a>
          </div>
          <iframe
            ref={iframeRef}
            title="Site preview"
            className="customize-preview-iframe"
            src="/customize-preview"
          />
        </div>
      </div>
    </div>
  );
}
