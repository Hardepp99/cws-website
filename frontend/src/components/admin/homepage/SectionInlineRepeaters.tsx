"use client";

import { SectionItemFields } from "@/components/admin/homepage/SectionItemFields";
import type { SectionRecord } from "@/components/admin/homepage/SectionEditor";
import {
  getRepeaterItems,
  getSectionRepeaters,
  setRepeaterItems,
  type SectionRepeaterDef,
} from "@/components/admin/homepage/section-repeaters";
import { itemListTitle, newItemId, normalizeItemStatus } from "@/lib/homepage/item-status";

function InlineRepeaterBlock({
  repeater,
  items,
  onChange,
}: {
  repeater: SectionRepeaterDef;
  items: SectionRecord[];
  onChange: (items: SectionRecord[]) => void;
}) {
  function updateItem(index: number, patch: SectionRecord) {
    const next = [...items];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  }

  function removeItem(index: number) {
    onChange(items.filter((_, j) => j !== index));
  }

  return (
    <div className="section-inline-repeater">
      <h3 className="section-inline-repeater__title">{repeater.label}</h3>
      {items.length === 0 ? (
        <p className="cms-field-hint">No {repeater.label.toLowerCase()} yet — add one below.</p>
      ) : null}
      {items.map((item, index) => {
        const status = normalizeItemStatus(item.status);
        const title = itemListTitle(item, repeater.singular);
        return (
          <details key={String(item.id ?? index)} className="section-inline-repeater__item" open={items.length <= 3}>
            <summary className="section-inline-repeater__summary">
              <strong>
                {repeater.singular} {index + 1}: {title || "(untitled)"}
              </strong>
              <span className={`status-badge status-${status === "published" ? "published" : status === "draft" ? "draft" : "trash"}`}>
                {status}
              </span>
            </summary>
            <div className="section-inline-repeater__body">
              <div className="section-item-status-fields">
                <label className="cms-label">Visibility</label>
                <select
                  className="cms-select"
                  value={status}
                  onChange={(e) => updateItem(index, { status: e.target.value })}
                >
                  <option value="published">Published — visible on site</option>
                  <option value="draft">Draft — hidden on site</option>
                </select>
              </div>
              <SectionItemFields
                item={item}
                fields={repeater.fields}
                onChange={(row) => updateItem(index, row)}
              />
              <button type="button" className="cms-btn-text danger" onClick={() => removeItem(index)}>
                Remove {repeater.singular.toLowerCase()}
              </button>
            </div>
          </details>
        );
      })}
      <button
        type="button"
        className="cms-btn cms-btn-ghost"
        onClick={() => onChange([...items, repeater.emptyItem()])}
      >
        + Add {repeater.singular.toLowerCase()}
      </button>
    </div>
  );
}

/** Inline editors for all repeater lists on a homepage section (saved with the section). */
export function SectionInlineRepeaters({
  section,
  onChange,
}: {
  section: SectionRecord;
  onChange: (s: SectionRecord) => void;
}) {
  const layout = String(section.acfFcLayout ?? "");
  const repeaters = getSectionRepeaters(layout);
  if (repeaters.length === 0) return null;

  return (
    <div className="section-inline-repeaters">
      <h2 className="section-repeater-nav__title">Section items</h2>
      <p className="cms-field-hint">
        Edit cards, services, FAQ entries, and other list items here. They are saved when you click Update on this
        section.
      </p>
      {repeaters.map((rep) => (
        <InlineRepeaterBlock
          key={rep.key}
          repeater={rep}
          items={getRepeaterItems(section, rep.key)}
          onChange={(items) => {
            const withIds = items.map((it, i) => ({
              ...it,
              id: it.id ?? newItemId(),
              status: it.status ?? "published",
            }));
            onChange(setRepeaterItems(section, rep.key, withIds));
          }}
        />
      ))}
    </div>
  );
}
