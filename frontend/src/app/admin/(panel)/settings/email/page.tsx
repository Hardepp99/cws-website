"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminRequireAdmin } from "@/components/admin/AdminRequireAdmin";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminFetch } from "@/lib/admin/client";

type SmtpSettings = {
  smtpHost: string;
  smtpPort: string;
  smtpEncryption: string;
  smtpUsername: string;
  smtpFromEmail: string;
  smtpFromName: string;
  hasPassword: boolean;
};

function EmailSettingsForm() {
  const [data, setData] = useState<SmtpSettings & { smtpPassword: string }>({
    smtpHost: "smtp.hostinger.com",
    smtpPort: "587",
    smtpEncryption: "tls",
    smtpUsername: "",
    smtpFromEmail: "",
    smtpFromName: "CWS India",
    smtpPassword: "",
    hasPassword: false,
  });
  const [testTo, setTestTo] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    adminFetch<SmtpSettings>("/crm/smtp")
      .then((d) => {
        setData((prev) => ({
          ...prev,
          ...d,
          smtpPassword: d.hasPassword ? "********" : "",
        }));
        setTestTo(d.smtpFromEmail || "");
      })
      .catch((e) => setErr(String(e)));
  }, []);

  async function save() {
    setSaving(true);
    setErr("");
    setMsg("");
    try {
      await adminFetch("/crm/smtp", { method: "PUT", json: data });
      setMsg("SMTP settings saved.");
      const refreshed = await adminFetch<SmtpSettings>("/crm/smtp");
      setData((prev) => ({
        ...prev,
        ...refreshed,
        smtpPassword: refreshed.hasPassword ? "********" : "",
      }));
    } catch (e) {
      setErr(String(e));
    } finally {
      setSaving(false);
    }
  }

  async function testSmtp() {
    setTesting(true);
    setErr("");
    setMsg("");
    try {
      const res = await adminFetch<{ message?: string }>("/crm/smtp/test", {
        method: "POST",
        json: testTo ? { to: testTo } : {},
      });
      setMsg(res.message || "Test email sent.");
    } catch (e) {
      setErr(String(e));
    } finally {
      setTesting(false);
    }
  }

  return (
    <div className="cms-card" style={{ maxWidth: 560 }}>
      <p className="cms-field-hint" style={{ marginTop: 0 }}>
        Configure outbound email for CRM compose and replies. Passwords are stored securely in site
        settings and never shown again after saving.
      </p>
      {msg ? <div className="cms-notice ok">{msg}</div> : null}
      {err ? <div className="cms-notice err">{err}</div> : null}
      <div className="cms-form-stack">
        <label className="cms-field">
          <span className="cms-field-label">SMTP host</span>
          <input
            value={data.smtpHost}
            onChange={(e) => setData((d) => ({ ...d, smtpHost: e.target.value }))}
            placeholder="smtp.hostinger.com"
          />
        </label>
        <label className="cms-field">
          <span className="cms-field-label">Port</span>
          <input
            value={data.smtpPort}
            onChange={(e) => setData((d) => ({ ...d, smtpPort: e.target.value }))}
            placeholder="587"
          />
        </label>
        <label className="cms-field">
          <span className="cms-field-label">Encryption</span>
          <select
            value={data.smtpEncryption}
            onChange={(e) => setData((d) => ({ ...d, smtpEncryption: e.target.value }))}
          >
            <option value="tls">TLS (port 587)</option>
            <option value="ssl">SSL (port 465)</option>
          </select>
        </label>
        <label className="cms-field">
          <span className="cms-field-label">Username</span>
          <input
            value={data.smtpUsername}
            onChange={(e) => setData((d) => ({ ...d, smtpUsername: e.target.value }))}
            placeholder="info@cwsindia.online"
            autoComplete="off"
          />
        </label>
        <label className="cms-field">
          <span className="cms-field-label">Password</span>
          <input
            type="password"
            value={data.smtpPassword}
            onChange={(e) => setData((d) => ({ ...d, smtpPassword: e.target.value }))}
            placeholder={data.hasPassword ? "Leave blank to keep current" : "SMTP password"}
            autoComplete="new-password"
          />
        </label>
        <label className="cms-field">
          <span className="cms-field-label">From email</span>
          <input
            type="email"
            value={data.smtpFromEmail}
            onChange={(e) => setData((d) => ({ ...d, smtpFromEmail: e.target.value }))}
          />
        </label>
        <label className="cms-field">
          <span className="cms-field-label">From name</span>
          <input
            value={data.smtpFromName}
            onChange={(e) => setData((d) => ({ ...d, smtpFromName: e.target.value }))}
          />
        </label>
        <label className="cms-field">
          <span className="cms-field-label">Send test to</span>
          <input
            type="email"
            value={testTo}
            onChange={(e) => setTestTo(e.target.value)}
            placeholder="Optional — defaults to From email"
          />
        </label>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 20, flexWrap: "wrap" }}>
        <button type="button" className="cms-btn cms-btn-green" disabled={saving} onClick={save}>
          {saving ? "Saving…" : "Save settings"}
        </button>
        <button type="button" className="cms-btn" disabled={testing} onClick={testSmtp}>
          {testing ? "Sending…" : "Send test email"}
        </button>
        <Link href="/admin/forms" className="cms-btn">
          ← Inbox
        </Link>
      </div>
    </div>
  );
}

export default function AdminEmailSettingsPage() {
  return (
    <AdminShell title="Email (SMTP)">
      <AdminRequireAdmin>
        <h2 style={{ marginTop: 0 }}>Email / SMTP</h2>
        <EmailSettingsForm />
      </AdminRequireAdmin>
    </AdminShell>
  );
}
