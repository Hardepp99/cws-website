"use client";

function normalizeHex(value: string): string {
  const v = value.trim();
  if (/^#[0-9A-Fa-f]{6}$/.test(v)) return v;
  if (/^#[0-9A-Fa-f]{3}$/.test(v)) return v;
  if (/^[0-9A-Fa-f]{6}$/.test(v)) return `#${v}`;
  return "#0057FF";
}

export function ColorField({
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
  const hex = normalizeHex(value || "#0057FF");

  return (
    <div className="cms-color-field">
      <label className="cms-label">{label}</label>
      {hint ? <p className="cms-field-hint">{hint}</p> : null}
      <div className="cms-color-row">
        <input
          type="color"
          className="cms-color-picker"
          value={hex}
          onChange={(e) => onChange(e.target.value)}
          aria-label={`${label} picker`}
        />
        <input
          className="cms-input cms-color-text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#0057FF"
        />
      </div>
    </div>
  );
}
