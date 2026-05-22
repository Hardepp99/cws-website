"use client";

import { useEffect, useState } from "react";
import { ColorField } from "@/components/admin/ColorField";
import { MediaPickerField } from "@/components/admin/media/MediaPickerField";
import { WpEditScreen } from "@/components/admin/wp/WpEditScreen";
import { adminFetch } from "@/lib/admin/client";

type Settings = Record<string, string>;

type FieldDef =
  | { key: string; label: string; hint?: string; type?: "text" | "textarea" }
  | { key: string; label: string; hint?: string; type: "color" }
  | { key: string; label: string; hint?: string; type: "media" };

const FIELDS: FieldDef[] = [
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "address", label: "Address", hint: "Shown in footer / contact areas.", type: "textarea" },
  { key: "logoUrl", label: "Logo", type: "media" },
  { key: "logoWhiteUrl", label: "Logo (light)", type: "media" },
  { key: "primaryColor", label: "Primary brand color", type: "color" },
  { key: "secondaryColor", label: "Secondary brand color", type: "color" },
  { key: "footerText", label: "Footer text", hint: "Copyright or tagline.", type: "textarea" },
  { key: "facebook", label: "Facebook URL" },
  { key: "linkedin", label: "LinkedIn URL" },
  { key: "instagram", label: "Instagram URL" },
  { key: "footerCompanyTitle", label: "Footer column: Company title" },
  { key: "footerServicesTitle", label: "Footer column: Services title" },
  { key: "footerProductsTitle", label: "Footer column: Products title" },
];

export function SiteSettingsForm() {
  const [data, setData] = useState<Settings>({});
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminFetch<Settings>("/settings")
      .then((d) => {
        const flat: Settings = {};
        for (const f of FIELDS) {
          flat[f.key] = String((d as Settings)[f.key] ?? "");
        }
        setData(flat);
      })
      .catch((e) => setErr(String(e)));
  }, []);

  async function save() {
    setSaving(true);
    setErr("");
    try {
      await adminFetch("/settings", { method: "PUT", json: data });
      setMsg("Settings saved.");
    } catch (e) {
      setErr(String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <WpEditScreen
      title="Site settings"
      backHref="/admin"
      backLabel="← Dashboard"
      onSave={save}
      saving={saving}
      message={msg}
      error={err}
    >
      <div className="cms-settings-grid">
        {FIELDS.map((f) => {
          if (f.type === "media") {
            return (
              <MediaPickerField
                key={f.key}
                label={f.label}
                hint={f.hint}
                value={data[f.key] ?? ""}
                onChange={(v) => setData({ ...data, [f.key]: v })}
                mediaFilter="image"
              />
            );
          }
          if (f.type === "color") {
            return (
              <ColorField
                key={f.key}
                label={f.label}
                hint={f.hint}
                value={data[f.key] ?? ""}
                onChange={(v) => setData({ ...data, [f.key]: v })}
              />
            );
          }
          if (f.type === "textarea") {
            return (
              <div key={f.key}>
                <label className="cms-label">{f.label}</label>
                {f.hint ? <p className="cms-field-hint">{f.hint}</p> : null}
                <textarea
                  className="cms-textarea"
                  rows={3}
                  value={data[f.key] ?? ""}
                  onChange={(e) => setData({ ...data, [f.key]: e.target.value })}
                />
              </div>
            );
          }
          return (
            <div key={f.key}>
              <label className="cms-label">{f.label}</label>
              {f.hint ? <p className="cms-field-hint">{f.hint}</p> : null}
              <input
                className="cms-input"
                value={data[f.key] ?? ""}
                onChange={(e) => setData({ ...data, [f.key]: e.target.value })}
              />
            </div>
          );
        })}
      </div>
    </WpEditScreen>
  );
}
