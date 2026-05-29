"use client";

import { CmsFieldCounter, CmsLabelRow } from "@/components/admin/CmsFieldCounter";
import { slugify } from "@/lib/admin/slugify";

export function SlugField({
  title,
  slug,
  onTitleChange,
  onSlugChange,
  slugManual,
  onSlugManualChange,
  urlPrefix = "/",
  titleLabel = "Title",
  syncFromTitle = true,
}: {
  title: string;
  slug: string;
  onTitleChange: (title: string) => void;
  onSlugChange: (slug: string) => void;
  slugManual: boolean;
  onSlugManualChange: (manual: boolean) => void;
  urlPrefix?: string;
  titleLabel?: string;
  /** Auto-update slug from title until user edits slug */
  syncFromTitle?: boolean;
}) {
  function handleTitle(v: string) {
    onTitleChange(v);
    if (syncFromTitle && !slugManual) {
      onSlugChange(slugify(v));
    }
  }

  return (
    <div className="cms-slug-block">
      <CmsLabelRow counter={<CmsFieldCounter value={title} mode="both" />}>{titleLabel}</CmsLabelRow>
      <input className="cms-input" value={title} onChange={(e) => handleTitle(e.target.value)} />
      <CmsLabelRow counter={<CmsFieldCounter value={slug} unit="characters" />}>URL slug</CmsLabelRow>
      <p className="cms-field-hint">
        Auto-generated from title. Edit slug only if you need a custom URL.
      </p>
      <div className="cms-slug-row">
        <span className="cms-slug-prefix">{urlPrefix}</span>
        <input
          className="cms-input cms-slug-input"
          value={slug}
          onChange={(e) => {
            onSlugManualChange(true);
            onSlugChange(slugify(e.target.value));
          }}
        />
      </div>
      {slugManual ? (
        <button type="button" className="cms-btn-text" onClick={() => onSlugManualChange(false)}>
          Reset slug from title
        </button>
      ) : null}
      <p className="cms-slug-preview">
        Preview: <code>{urlPrefix}{slug || "…"}</code>
      </p>
    </div>
  );
}
