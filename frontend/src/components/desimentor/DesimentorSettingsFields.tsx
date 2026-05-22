"use client";

import { MediaPickerField } from "@/components/admin/media/MediaPickerField";
import {
  FA_ICON_OPTIONS,
  type WidgetFieldDef,
} from "@/lib/desimentor/widget-registry";

type RepeaterItem = Record<string, string>;

function RepeaterField({
  label,
  value,
  subFields,
  onChange,
}: {
  label: string;
  value: RepeaterItem[];
  subFields: NonNullable<WidgetFieldDef["repeaterFields"]>;
  onChange: (items: RepeaterItem[]) => void;
}) {
  const items = Array.isArray(value) ? value : [];

  function updateRow(index: number, key: string, val: string) {
    const next = items.map((row, i) => (i === index ? { ...row, [key]: val } : row));
    onChange(next);
  }

  function addRow() {
    const blank: RepeaterItem = {};
    subFields.forEach((f) => {
      blank[f.key] = "";
    });
    onChange([...items, blank]);
  }

  function removeRow(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div className="desimentor-repeater desimentor-field">
      <label className="dsmt-label">{label}</label>
      {items.map((row, i) => (
        <div key={i} className="desimentor-repeater-row">
          <div className="desimentor-repeater-row-head">
            <span>#{i + 1}</span>
            <button type="button" className="dsmt-link" onClick={() => removeRow(i)}>
              Remove
            </button>
          </div>
          {subFields.map((sf) => (
            <div key={sf.key} className="desimentor-field">
              {sf.type === "media" ? (
                <MediaPickerField
                  label={sf.label}
                  value={row[sf.key] ?? ""}
                  onChange={(url) => updateRow(i, sf.key, url)}
                  compact
                />
              ) : sf.type === "url" ? (
                <>
                  <label className="dsmt-label">{sf.label}</label>
                  <input
                    className="dsmt-input"
                    type="url"
                    value={row[sf.key] ?? ""}
                    onChange={(e) => updateRow(i, sf.key, e.target.value)}
                  />
                </>
              ) : sf.type === "textarea" ? (
                <>
                  <label className="dsmt-label">{sf.label}</label>
                  <textarea
                    className="dsmt-input dsmt-textarea"
                    rows={2}
                    value={row[sf.key] ?? ""}
                    onChange={(e) => updateRow(i, sf.key, e.target.value)}
                  />
                </>
              ) : (
                <>
                  <label className="dsmt-label">{sf.label}</label>
                  <input
                    className="dsmt-input"
                    value={row[sf.key] ?? ""}
                    onChange={(e) => updateRow(i, sf.key, e.target.value)}
                  />
                </>
              )}
            </div>
          ))}
        </div>
      ))}
      <button type="button" className="dsmt-link" onClick={addRow}>
        + Add
      </button>
    </div>
  );
}

export function DesimentorField({
  field,
  value,
  onChange,
}: {
  field: WidgetFieldDef;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const str = value === null || value === undefined ? "" : String(value);

  switch (field.type) {
    case "textarea":
      return (
        <div className="desimentor-field">
          <label className="dsmt-label">{field.label}</label>
          {field.hint ? <p className="dsmt-hint">{field.hint}</p> : null}
          <textarea
            className="dsmt-input dsmt-textarea"
            rows={field.key === "html" ? 5 : 3}
            value={str}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );
    case "number":
      return (
        <div className="desimentor-field">
          <label className="dsmt-label">{field.label}</label>
          <input
            className="dsmt-input"
            type="number"
            value={typeof value === "number" ? value : str}
            onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
          />
        </div>
      );
    case "color":
      return (
        <div className="desimentor-field">
          <label className="dsmt-label">{field.label}</label>
          <div className="desimentor-color-row">
            <input type="color" value={str || "#000000"} onChange={(e) => onChange(e.target.value)} />
            <input className="dsmt-input" value={str} onChange={(e) => onChange(e.target.value)} />
          </div>
        </div>
      );
    case "select":
      return (
        <div className="desimentor-field">
          <label className="dsmt-label">{field.label}</label>
          <select className="dsmt-input" value={str} onChange={(e) => onChange(e.target.value)}>
            {field.options?.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      );
    case "toggle":
      return (
        <label className="desimentor-toggle-field desimentor-field">
          <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
          <span className="dsmt-label">{field.label}</span>
        </label>
      );
    case "media":
      return (
        <div className="desimentor-field">
          <MediaPickerField
            label={field.label}
            value={str}
            onChange={(url) => onChange(url)}
            hint={field.hint}
            compact
            mediaFilter={field.label.toLowerCase().includes("audio") ? "audio" : "image"}
          />
        </div>
      );
    case "icon":
      return (
        <div className="desimentor-field">
          <label className="dsmt-label">{field.label}</label>
          <select
            className="dsmt-input"
            value={FA_ICON_OPTIONS.includes(str) ? str : FA_ICON_OPTIONS[0]}
            onChange={(e) => onChange(e.target.value)}
          >
            {FA_ICON_OPTIONS.map((ic) => (
              <option key={ic} value={ic}>
                {ic}
              </option>
            ))}
          </select>
          <input
            className="dsmt-input"
            placeholder="Custom class"
            value={str}
            onChange={(e) => onChange(e.target.value)}
          />
          <p className="desimentor-icon-preview">
            <i className={str || "fas fa-star"} aria-hidden="true" />
          </p>
        </div>
      );
    case "url":
      return (
        <div className="desimentor-field">
          <label className="dsmt-label">{field.label}</label>
          <input className="dsmt-input" type="url" value={str} onChange={(e) => onChange(e.target.value)} placeholder="https://" />
        </div>
      );
    case "repeater":
      return (
        <RepeaterField
          label={field.label}
          value={Array.isArray(value) ? (value as RepeaterItem[]) : []}
          subFields={field.repeaterFields ?? []}
          onChange={onChange}
        />
      );
    default:
      return (
        <div className="desimentor-field">
          <label className="dsmt-label">{field.label}</label>
          {field.hint ? <p className="dsmt-hint">{field.hint}</p> : null}
          <input className="dsmt-input" value={str} onChange={(e) => onChange(e.target.value)} />
        </div>
      );
  }
}
