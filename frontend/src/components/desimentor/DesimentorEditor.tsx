"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  fetchDesimentorDocument,
  publishDesimentorDocument,
  saveDesimentorDocument,
} from "@/lib/admin/desimentor-client";
import { emptyDocument } from "@/lib/desimentor/document-utils";
import { useDesimentorStore } from "@/lib/desimentor/store";
import type { DesimentorEntityType } from "@/lib/desimentor/types";
import { DesimentorCanvas } from "./DesimentorCanvas";
import { DesimentorDndRoot } from "./DesimentorDndRoot";
import { DesimentorSettingsPanel } from "./DesimentorSettingsPanel";
import { DesimentorDeviceSwitcher } from "./DesimentorDeviceSwitcher";
import { DesimentorWidgetsPanel } from "./DesimentorWidgetsPanel";

export function DesimentorEditor({
  entityType,
  entityId,
  entityLabel,
  backHref,
}: {
  entityType: DesimentorEntityType;
  entityId: number;
  entityLabel: string;
  backHref: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [err, setErr] = useState("");
  const document = useDesimentorStore((s) => s.document);
  const dirty = useDesimentorStore((s) => s.dirty);
  const saving = useDesimentorStore((s) => s.saving);
  const status = useDesimentorStore((s) => s.status);
  const previewToken = useDesimentorStore((s) => s.previewToken);
  const setMeta = useDesimentorStore((s) => s.setMeta);
  const setDocument = useDesimentorStore((s) => s.setDocument);
  const setSaving = useDesimentorStore((s) => s.setSaving);
  const markSaved = useDesimentorStore((s) => s.markSaved);

  useEffect(() => {
    setMeta({ entityType, entityId, entityLabel });
    fetchDesimentorDocument(entityType, entityId)
      .then((res) => {
        const doc = res.document?.content ?? res.empty ?? emptyDocument();
        setDocument(doc, res.document?.status ?? "draft");
        setMeta({ entityType, entityId, entityLabel, previewToken: res.previewToken });
        setLoaded(true);
      })
      .catch((e) => setErr(String(e)));
  }, [entityType, entityId, entityLabel, setMeta, setDocument]);

  const save = useCallback(
    async (publish = false) => {
      setSaving(true);
      setErr("");
      try {
        if (publish) {
          await saveDesimentorDocument(entityType, entityId, document, "draft");
          await publishDesimentorDocument(entityType, entityId);
          setDocument(document, "published");
        } else {
          await saveDesimentorDocument(entityType, entityId, document, status);
        }
        markSaved();
      } catch (e) {
        setErr(String(e));
        setSaving(false);
      }
    },
    [document, entityId, entityType, markSaved, setDocument, setSaving, status]
  );

  useEffect(() => {
    if (!dirty || !loaded) return;
    const t = setTimeout(() => save(false), 2000);
    return () => clearTimeout(t);
  }, [dirty, document, loaded, save]);

  if (!loaded && !err) {
    return <div className="desimentor-editor"><p style={{ padding: 24 }}>Loading Desimentor…</p></div>;
  }

  const previewUrl = `/admin/desimentor/preview?token=${encodeURIComponent(previewToken)}`;

  return (
    <div className="desimentor-editor">
      <header className="desimentor-topbar">
        <div className="desimentor-topbar-brand">
          <span>Elementor</span> — {entityLabel}
          <span className="desimentor-topbar-note">Classic content is preserved separately</span>
        </div>
        <DesimentorDeviceSwitcher />
        <div className="desimentor-topbar-actions">
          {err ? <span className="desimentor-topbar-err">{err}</span> : null}
          <span className="desimentor-topbar-status">
            {saving ? "Saving…" : dirty ? "Unsaved" : status === "published" ? "Published" : "Draft"}
          </span>
          <a href={previewUrl} target="_blank" rel="noreferrer" className="dsmt-btn">
            Preview
          </a>
          <button type="button" className="dsmt-btn" onClick={() => save(false)} disabled={saving}>
            Save
          </button>
          <button type="button" className="dsmt-btn dsmt-btn-primary" onClick={() => save(true)} disabled={saving}>
            Publish
          </button>
          <Link href={backHref} className="dsmt-btn">
            Exit
          </Link>
        </div>
      </header>
      <DesimentorDndRoot>
        <div className="desimentor-body">
          <DesimentorWidgetsPanel />
          <DesimentorCanvas />
          <DesimentorSettingsPanel />
        </div>
      </DesimentorDndRoot>
    </div>
  );
}
