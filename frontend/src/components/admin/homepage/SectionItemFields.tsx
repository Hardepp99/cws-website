"use client";

import { MediaPickerField } from "@/components/admin/media/MediaPickerField";
import type { RepeaterFieldDef } from "./section-repeaters";
import { readRepeaterFieldValue, writeRepeaterFieldValue } from "./section-repeaters";
import type { SectionRecord } from "./SectionEditor";

export function SectionItemFields({
  item,
  fields,
  onChange,
}: {
  item: SectionRecord;
  fields: RepeaterFieldDef[];
  onChange: (item: SectionRecord) => void;
}) {
  return (
    <div className="cms-section-fields">
      {fields.map((field) => {
        const value = readRepeaterFieldValue(item, field);
        if (field.type === "media") {
          return (
            <MediaPickerField
              key={field.key}
              label={field.label}
              hint={field.hint}
              value={value}
              mediaFilter={field.mediaFilter ?? "image"}
              onChange={(url) => onChange(writeRepeaterFieldValue(item, field, url))}
            />
          );
        }
        return (
          <div key={field.key}>
            <label className="cms-label">{field.label}</label>
            {field.hint ? <p className="cms-field-hint">{field.hint}</p> : null}
            {field.type === "textarea" ? (
              <textarea
                className="cms-textarea"
                rows={3}
                value={value}
                onChange={(e) => onChange(writeRepeaterFieldValue(item, field, e.target.value))}
              />
            ) : (
              <input
                className="cms-input"
                type={field.type === "number" ? "number" : "text"}
                value={value}
                onChange={(e) => onChange(writeRepeaterFieldValue(item, field, e.target.value))}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
