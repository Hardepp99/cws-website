"use client";

import { ColorField } from "@/components/admin/ColorField";
import { MediaPickerField } from "@/components/admin/media/MediaPickerField";
import type { SettingsFieldDef } from "@/lib/admin/site-settings-sections";

export function SiteCustomizerControl({
  field,
  value,
  onChange,
}: {
  field: SettingsFieldDef;
  value: string;
  onChange: (value: string) => void;
}) {
  if (field.type === "media") {
    return (
      <div className="customize-control customize-control--media">
        <MediaPickerField
          label={field.label}
          hint={field.hint}
          value={value}
          onChange={onChange}
          mediaFilter="image"
        />
      </div>
    );
  }

  if (field.type === "color") {
    return (
      <div className="customize-control customize-control--color">
        <ColorField label={field.label} hint={field.hint} value={value} onChange={onChange} />
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div className="customize-control">
        <label className="customize-control-label">{field.label}</label>
        {field.hint ? <p className="customize-control-hint">{field.hint}</p> : null}
        <textarea
          className="cms-textarea customize-control-input"
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  }

  return (
    <div className="customize-control">
      <label className="customize-control-label">{field.label}</label>
      {field.hint ? <p className="customize-control-hint">{field.hint}</p> : null}
      <input
        className="cms-input customize-control-input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
