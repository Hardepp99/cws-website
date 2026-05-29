"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminFetch } from "@/lib/admin/client";

type Option = { value: string; label: string };

export function ModerationEditor({
  title,
  backHref,
  apiPath,
  status,
  statusOptions,
  children,
}: {
  title: string;
  backHref: string;
  apiPath: string;
  status: string;
  statusOptions: Option[];
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState(status);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    setErr("");
    try {
      await adminFetch(apiPath, { method: "PUT", json: { status: currentStatus } });
      setMsg("Saved.");
      router.refresh();
    } catch (e) {
      setErr(String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="cms-card" style={{ maxWidth: 720 }}>
      <p className="cms-field-hint" style={{ marginTop: 0 }}>
        <Link href={backHref}>← Back to list</Link>
      </p>
      <h2 style={{ marginTop: 0 }}>{title}</h2>
      {children}
      <label className="cms-label">Status</label>
      <select className="cms-select" value={currentStatus} onChange={(e) => setCurrentStatus(e.target.value)}>
        {statusOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {err ? <div className="cms-notice err">{err}</div> : null}
      {msg ? <div className="cms-notice ok">{msg}</div> : null}
      <div className="cms-form-actions" style={{ marginTop: 16 }}>
        <button type="button" className="cms-btn cms-btn-green" onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Update status"}
        </button>
      </div>
    </div>
  );
}
