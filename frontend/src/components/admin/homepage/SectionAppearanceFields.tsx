"use client";

import { MediaPickerField } from "@/components/admin/media/MediaPickerField";
import { DEFAULT_SECTION_BACKDROPS } from "@/lib/homepage/section-appearance";
import type { SectionRecord } from "./SectionEditor";

function Field({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  return (
    <div>
      <label className="cms-label">{label}</label>
      {hint ? <p className="cms-field-hint">{hint}</p> : null}
      <input className="cms-input" type="text" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

/** Backdrop + light/dark override for homepage sections (not hero). */
export function SectionAppearanceFields({
  section,
  onChange,
}: {
  section: SectionRecord;
  onChange: (s: SectionRecord) => void;
}) {
  const layout = String(section.acfFcLayout ?? "");
  const set = (key: string, value: unknown) => onChange({ ...section, [key]: value });
  const theme = String(section.sectionTheme ?? section.section_theme ?? "auto");
  const backdrop = String(section.backdropImage ?? section.backdrop_image ?? "");
  const strength = String(section.backdropStrength ?? section.backdrop_strength ?? "");
  const defaultUrl = DEFAULT_SECTION_BACKDROPS[layout] ?? "";

  return (
    <div className="cms-section-appearance">
      <h4 className="cms-subheading">Section appearance</h4>
      <p className="cms-field-hint">
        Homepage uses alternating light and dark bands. Override theme or backdrop image per section.
      </p>
      <div>
        <label className="cms-label" htmlFor="section-theme-select">
          Band theme
        </label>
        <select
          id="section-theme-select"
          className="cms-input"
          value={theme}
          onChange={(e) => set("sectionTheme", e.target.value)}
        >
          <option value="auto">Auto (alternate light / dark)</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      <MediaPickerField
        label="Backdrop image"
        value={backdrop}
        onChange={(v) => set("backdropImage", v)}
        mediaFilter="image"
        hint={
          defaultUrl
            ? `Leave empty for default theme image. Default: ${defaultUrl.slice(0, 48)}…`
            : "Full-width background photo behind this section."
        }
      />
      <Field
        label="Backdrop strength (0–100)"
        value={strength}
        onChange={(v) => set("backdropStrength", v === "" ? "" : Math.min(100, Math.max(0, parseInt(v, 10) || 0)))}
        hint="Higher = more visible photo. Light bands default ~24, dark ~38."
      />
      {defaultUrl && !backdrop ? (
        <p className="cms-field-hint">
          <a href={defaultUrl} target="_blank" rel="noopener noreferrer">
            Preview default backdrop
          </a>
        </p>
      ) : null}
    </div>
  );
}
