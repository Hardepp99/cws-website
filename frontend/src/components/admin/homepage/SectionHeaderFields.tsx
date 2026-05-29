"use client";

import type { ReactNode } from "react";
import { MediaPickerField } from "@/components/admin/media/MediaPickerField";
import { WysiwygField } from "@/components/admin/WysiwygField";
import { SectionAppearanceFields } from "./SectionAppearanceFields";
import type { SectionRecord } from "./SectionEditor";

function SectionFieldsWrap({
  layout,
  section,
  onChange,
  children,
}: {
  layout: string;
  section: SectionRecord;
  onChange: (s: SectionRecord) => void;
  children: ReactNode;
}) {
  return (
    <div className="cms-section-fields">
      {children}
      {layout !== "hero_slider" ? <SectionAppearanceFields section={section} onChange={onChange} /> : null}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: "text" | "textarea";
  hint?: string;
}) {
  return (
    <div>
      <label className="cms-label">{label}</label>
      {hint ? <p className="cms-field-hint">{hint}</p> : null}
      {type === "textarea" ? (
        <textarea className="cms-textarea" rows={3} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className="cms-input" type="text" value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

function CtaFields({ section, onChange }: { section: SectionRecord; onChange: (s: SectionRecord) => void }) {
  const label = String(section.ctaLabel ?? section.cta_label ?? "");
  const href = String(section.ctaHref ?? section.cta_href ?? "");
  return (
    <>
      <Field label="Button label" value={label} onChange={(v) => onChange({ ...section, ctaLabel: v, cta_label: v })} />
      <Field
        label="Button link"
        value={href}
        onChange={(v) => onChange({ ...section, ctaHref: v, cta_href: v })}
        hint="Use #ask-price to open the Ask price popup."
      />
    </>
  );
}

/** Section-level fields only (no repeater items). */
export function SectionHeaderFields({
  section,
  onChange,
}: {
  section: SectionRecord;
  onChange: (s: SectionRecord) => void;
}) {
  const layout = String(section.acfFcLayout ?? "");
  const set = (key: string, value: unknown) => onChange({ ...section, [key]: value });

  if (layout === "hero_slider") {
    const ctaPrimary = (section.ctaPrimary as SectionRecord) || { label: "", href: "" };
    const ctaSecondary = (section.ctaSecondary as SectionRecord) || { label: "", href: "" };
    return (
      <div className="cms-section-fields">
        <Field label="Eyebrow" value={String(section.eyebrow ?? "")} onChange={(v) => set("eyebrow", v)} />
        <Field label="Headline (fallback)" value={String(section.headline ?? "")} onChange={(v) => set("headline", v)} />
        <Field label="Subheadline" value={String(section.subheadline ?? "")} onChange={(v) => set("subheadline", v)} type="textarea" />
        <Field
          label="Primary CTA label"
          value={String(ctaPrimary.label ?? "")}
          onChange={(v) => set("ctaPrimary", { ...ctaPrimary, label: v })}
        />
        <Field
          label="Primary CTA link"
          value={String(ctaPrimary.href ?? "")}
          onChange={(v) => set("ctaPrimary", { ...ctaPrimary, href: v })}
          hint="#ask-price opens Ask price modal"
        />
        <Field
          label="Secondary CTA label"
          value={String(ctaSecondary.label ?? "")}
          onChange={(v) => set("ctaSecondary", { ...ctaSecondary, label: v })}
        />
        <Field
          label="Secondary CTA link"
          value={String(ctaSecondary.href ?? "")}
          onChange={(v) => set("ctaSecondary", { ...ctaSecondary, href: v })}
        />
        <MediaPickerField
          label="Person image (right of slider)"
          value={String(section.personImage ?? "")}
          onChange={(v) => set("personImage", v)}
          mediaFilter="image"
        />
        <Field
          label="Person image alt text"
          value={String(section.personImageAlt ?? "")}
          onChange={(v) => set("personImageAlt", v)}
        />
      </div>
    );
  }

  if (layout === "cta" || layout === "contact_preview") {
    return (
      <SectionFieldsWrap layout={layout} section={section} onChange={onChange}>
        {layout === "contact_preview" ? (
          <Field label="Badge" value={String(section.badge ?? "")} onChange={(v) => set("badge", v)} />
        ) : null}
        <Field label="Title" value={String(section.title ?? "")} onChange={(v) => set("title", v)} />
        <Field label="Subtitle" value={String(section.subtitle ?? "")} onChange={(v) => set("subtitle", v)} type="textarea" />
        <CtaFields section={section} onChange={onChange} />
      </SectionFieldsWrap>
    );
  }

  if (layout === "blog_preview") {
    return (
      <SectionFieldsWrap layout={layout} section={section} onChange={onChange}>
        <p className="cms-field-hint">Blog posts load from your Blog — set section headings here.</p>
        <Field label="Badge" value={String(section.badge ?? "")} onChange={(v) => set("badge", v)} />
        <Field label="Title" value={String(section.title ?? "")} onChange={(v) => set("title", v)} />
        <Field label="Subtitle" value={String(section.subtitle ?? "")} onChange={(v) => set("subtitle", v)} type="textarea" />
      </SectionFieldsWrap>
    );
  }

  if (layout === "seo_rich") {
    return (
      <SectionFieldsWrap layout={layout} section={section} onChange={onChange}>
        <Field label="Badge" value={String(section.badge ?? "")} onChange={(v) => set("badge", v)} />
        <Field label="Title" value={String(section.title ?? "")} onChange={(v) => set("title", v)} />
        <Field label="Subtitle (optional)" value={String(section.subtitle ?? "")} onChange={(v) => set("subtitle", v)} type="textarea" />
        <WysiwygField label="Content (HTML)" value={String(section.content ?? "")} onChange={(v) => set("content", v)} height={360} />
      </SectionFieldsWrap>
    );
  }

  if (layout === "about") {
    return (
      <SectionFieldsWrap layout={layout} section={section} onChange={onChange}>
        <Field label="Badge" value={String(section.badge ?? "")} onChange={(v) => set("badge", v)} />
        <Field label="Title" value={String(section.title ?? "")} onChange={(v) => set("title", v)} />
        <Field label="Subtitle" value={String(section.subtitle ?? "")} onChange={(v) => set("subtitle", v)} type="textarea" />
        <WysiwygField label="Content" value={String(section.content ?? "")} onChange={(v) => set("content", v)} />
        <MediaPickerField
          label="About image"
          value={String(section.image ?? "")}
          onChange={(v) => set("image", v)}
          mediaFilter="image"
        />
        <CtaFields section={section} onChange={onChange} />
      </SectionFieldsWrap>
    );
  }

  // Grid + most sections: badge, title, subtitle
  if (
    layout === "trust_badges" ||
    layout === "services_marquee" ||
    layout === "services_grid" ||
    layout === "industries" ||
    layout === "website_types" ||
    layout === "tech_stack" ||
    layout === "pricing_packages" ||
    layout === "guarantees" ||
    layout === "faq" ||
    layout === "testimonials" ||
    layout === "portfolio" ||
    layout === "why_codify" ||
    layout === "process" ||
    layout === "courses"
  ) {
    return (
      <SectionFieldsWrap layout={layout} section={section} onChange={onChange}>
        <Field label="Badge" value={String(section.badge ?? "")} onChange={(v) => set("badge", v)} />
        <Field label="Title" value={String(section.title ?? "")} onChange={(v) => set("title", v)} />
        <Field label="Subtitle" value={String(section.subtitle ?? "")} onChange={(v) => set("subtitle", v)} type="textarea" />
      </SectionFieldsWrap>
    );
  }

  return (
    <SectionFieldsWrap layout={layout} section={section} onChange={onChange}>
      <Field label="Badge" value={String(section.badge ?? "")} onChange={(v) => set("badge", v)} />
      <Field label="Title" value={String(section.title ?? "")} onChange={(v) => set("title", v)} />
      <Field label="Subtitle" value={String(section.subtitle ?? "")} onChange={(v) => set("subtitle", v)} type="textarea" />
    </SectionFieldsWrap>
  );
}
