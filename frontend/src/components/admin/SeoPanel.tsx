"use client";

import { MediaPickerField } from "@/components/admin/media/MediaPickerField";
import { CmsFieldCounter, CmsLabelRow } from "@/components/admin/CmsFieldCounter";
import { analyzeSeo } from "@/lib/admin/seo-score";
import type { AdminSeoData } from "@/lib/admin/seo-types";
import { getSiteUrl } from "@/lib/site-url";

export function SeoPanel({
  seo,
  onChange,
  siteUrl = getSiteUrl(),
  contentHtml = "",
  pathPrefix = "/",
  slug = "",
}: {
  seo: AdminSeoData;
  onChange: (seo: AdminSeoData) => void;
  siteUrl?: string;
  contentHtml?: string;
  pathPrefix?: string;
  slug?: string;
}) {
  const { score, checks } = analyzeSeo(seo, contentHtml);
  const base = siteUrl.replace(/\/$/, "") || "http://localhost:3000";
  const displayUrl = `${base}${pathPrefix}${slug}`.replace(/([^:]\/)\/+/g, "$1");

  const set = (patch: Partial<AdminSeoData>) => onChange({ ...seo, ...patch });

  return (
    <div className="cms-seo-panel">
      <div className="cms-seo-panel-head">
        <h2 className="cms-section-heading cms-seo-panel__title">SEO</h2>
        <div className={`cms-seo-score cms-seo-score--${score >= 70 ? "good" : score >= 40 ? "ok" : "low"}`}>
          <span className="cms-seo-score-num">{score}</span>
          <span className="cms-seo-score-label">/ 100</span>
        </div>
      </div>

      <div className="cms-serp-preview">
        <p className="cms-serp-preview-label">Search appearance preview</p>
        <div className="cms-serp-card">
          <div className="cms-serp-url">{displayUrl}</div>
          <div className="cms-serp-title">{seo.title || "Page title"}</div>
          <div className="cms-serp-desc">{seo.description || "Meta description will appear here."}</div>
        </div>
      </div>

      <CmsLabelRow
        counter={<CmsFieldCounter value={seo.focusKeyword} max={80} unit="characters" />}
      >
        Focus keyphrase
      </CmsLabelRow>
      <input
        className="cms-input cms-seo-input"
        value={seo.focusKeyword}
        onChange={(e) => set({ focusKeyword: e.target.value })}
        placeholder="e.g. web development chandigarh"
      />

      <CmsLabelRow counter={<CmsFieldCounter value={seo.title} min={30} max={60} />}>
        SEO title
      </CmsLabelRow>
      <input
        className="cms-input cms-seo-input"
        type="text"
        value={seo.title}
        onChange={(e) => set({ title: e.target.value })}
        maxLength={70}
      />

      <CmsLabelRow counter={<CmsFieldCounter value={seo.description} min={120} max={160} />}>
        Meta description
      </CmsLabelRow>
      <textarea
        className="cms-textarea cms-seo-textarea cms-seo-textarea--description"
        rows={2}
        value={seo.description}
        onChange={(e) => set({ description: e.target.value })}
        maxLength={320}
      />

      <CmsLabelRow counter={<CmsFieldCounter value={seo.keywords} unit="characters" />}>
        Meta keywords
      </CmsLabelRow>
      <input
        className="cms-input cms-seo-input"
        type="text"
        value={seo.keywords}
        onChange={(e) => set({ keywords: e.target.value })}
        placeholder="comma, separated, keywords"
      />

      <div className="cms-form-grid-2">
        <div>
          <CmsLabelRow counter={<CmsFieldCounter value={seo.canonical} unit="characters" />}>
            Canonical URL
          </CmsLabelRow>
          <input
            className="cms-input cms-seo-input"
            type="url"
            value={seo.canonical}
            onChange={(e) => set({ canonical: e.target.value })}
            placeholder={displayUrl}
          />
        </div>
        <div>
          <MediaPickerField
            label="Open Graph image"
            value={seo.ogImage}
            onChange={(url) => set({ ogImage: url })}
            mediaFilter="image"
            hint="Recommended 1200×630 for social sharing."
          />
        </div>
      </div>

      <label className="cms-label">Search engine visibility</label>
      <select
        className="cms-select cms-seo-select"
        value={seo.robots}
        onChange={(e) => set({ robots: e.target.value as AdminSeoData["robots"] })}
      >
        <option value="index">Index — allow in search results</option>
        <option value="noindex">Noindex — hide from search results</option>
      </select>

      <ul className="cms-seo-checklist">
        {checks.map((c) => (
          <li key={c.id} className={c.ok ? "ok" : "warn"}>
            <span className="cms-seo-check-icon">{c.ok ? "✓" : "!"}</span>
            {c.label}
            {c.hint ? <span className="cms-seo-check-hint"> ({c.hint})</span> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
