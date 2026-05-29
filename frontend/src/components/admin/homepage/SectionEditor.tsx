"use client";

import { MediaPickerField } from "@/components/admin/media/MediaPickerField";
import { WysiwygField } from "@/components/admin/WysiwygField";
import { isGridLayout } from "./layouts";

export type SectionRecord = Record<string, unknown>;

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
  type?: "text" | "textarea" | "number";
  hint?: string;
}) {
  return (
    <div>
      <label className="cms-label">{label}</label>
      {hint ? <p className="cms-field-hint">{hint}</p> : null}
      {type === "textarea" ? (
        <textarea className="cms-textarea" rows={3} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input
          className="cms-input"
          type={type === "number" ? "number" : "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

function CtaFields({
  section,
  onChange,
}: {
  section: SectionRecord;
  onChange: (s: SectionRecord) => void;
}) {
  const label = String(section.ctaLabel ?? section.cta_label ?? "");
  const href = String(section.ctaHref ?? section.cta_href ?? "");
  return (
    <>
      <Field label="Button label" value={label} onChange={(v) => onChange({ ...section, ctaLabel: v, cta_label: v })} />
      <Field
        label="Button link"
        value={href}
        onChange={(v) => onChange({ ...section, ctaHref: v, cta_href: v })}
        hint="Use #ask-price to open the Ask price popup, or /contact for the contact page."
      />
    </>
  );
}

function ItemsEditor({
  items,
  onChange,
  showLetter,
}: {
  items: SectionRecord[];
  onChange: (items: SectionRecord[]) => void;
  showLetter?: boolean;
}) {
  return (
    <div className="cms-repeater">
      <label className="cms-label">Items</label>
      {items.map((item, i) => (
        <div key={i} className="cms-repeater-row">
          <div className="cms-repeater-row-head">
            <strong>Item {i + 1}</strong>
            <button
              type="button"
              className="cms-btn-text danger"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
            >
              Remove
            </button>
          </div>
          <Field label="Title" value={String(item.title ?? "")} onChange={(v) => {
            const next = [...items];
            next[i] = { ...item, title: v };
            onChange(next);
          }} />
          <Field label="Description" value={String(item.desc ?? item.description ?? "")} onChange={(v) => {
            const next = [...items];
            next[i] = { ...item, desc: v, description: v };
            onChange(next);
          }} type="textarea" />
          <Field label="Link (optional)" value={String(item.href ?? "")} onChange={(v) => {
            const next = [...items];
            next[i] = { ...item, href: v };
            onChange(next);
          }} />
          <Field label="Icon class (Font Awesome)" value={String(item.icon ?? "")} onChange={(v) => {
            const next = [...items];
            next[i] = { ...item, icon: v };
            onChange(next);
          }} />
          {showLetter ? (
            <Field label="Letter (marquee)" value={String(item.letter ?? "")} onChange={(v) => {
              const next = [...items];
              next[i] = { ...item, letter: v };
              onChange(next);
            }} />
          ) : null}
          <Field label="Tone (green, blue, orange, royal)" value={String(item.tone ?? "")} onChange={(v) => {
            const next = [...items];
            next[i] = { ...item, tone: v };
            onChange(next);
          }} />
        </div>
      ))}
      <button
        type="button"
        className="cms-btn cms-btn-ghost"
        onClick={() =>
          onChange([
            ...items,
            { title: "", desc: "", href: "", icon: "fas fa-check", tone: "blue" },
          ])
        }
      >
        + Add item
      </button>
    </div>
  );
}

export function SectionEditor({
  section,
  onChange,
}: {
  section: SectionRecord;
  onChange: (s: SectionRecord) => void;
}) {
  const layout = String(section.acfFcLayout ?? "");

  const set = (key: string, value: unknown) => onChange({ ...section, [key]: value });

  if (layout === "hero_slider") {
    const parts = (section.headlineParts as SectionRecord[]) || [];
    const stats = (section.stats as SectionRecord[]) || [];
    const slides = (section.slides as SectionRecord[]) || [];
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
        <div className="cms-repeater">
          <label className="cms-label">Colored headline words</label>
          {parts.map((p, i) => (
            <div key={i} className="cms-repeater-row cms-repeater-row--inline">
              <Field label="Word" value={String(p.text ?? "")} onChange={(v) => {
                const next = [...parts];
                next[i] = { ...p, text: v };
                set("headlineParts", next);
              }} />
              <Field label="Tone" value={String(p.tone ?? "white")} onChange={(v) => {
                const next = [...parts];
                next[i] = { ...p, tone: v };
                set("headlineParts", next);
              }} />
              <button type="button" className="cms-btn-text danger" onClick={() => set("headlineParts", parts.filter((_, j) => j !== i))}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" className="cms-btn cms-btn-ghost" onClick={() => set("headlineParts", [...parts, { text: "", tone: "white" }])}>
            + Add word
          </button>
        </div>
        <div className="cms-repeater">
          <label className="cms-label">Hero slides (image paths)</label>
          {slides.map((sl, i) => (
            <div key={i} className="cms-repeater-row">
              <Field
                label={`Slide ${i + 1} image URL`}
                value={String((sl.image as SectionRecord)?.url ?? sl.image ?? "")}
                onChange={(v) => {
                  const next = [...slides];
                  next[i] = { image: { url: v } };
                  set("slides", next);
                }}
              />
            </div>
          ))}
          <button type="button" className="cms-btn cms-btn-ghost" onClick={() => set("slides", [...slides, { image: { url: "/assets/images/hero1.png" } }])}>
            + Add slide
          </button>
        </div>
        <p className="cms-field-hint">
          Google reviews and Maps link are managed in{" "}
          <a href="/admin/settings" target="_blank" rel="noopener noreferrer">
            Admin → Settings → Google Business
          </a>
          . Choose which reviews appear on the homepage there.
        </p>
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
        <div className="cms-repeater">
          <label className="cms-label">Stats</label>
          {stats.map((st, i) => (
            <div key={i} className="cms-repeater-row">
              <Field label="Icon" value={String(st.icon ?? "")} onChange={(v) => {
                const next = [...stats];
                next[i] = { ...st, icon: v };
                set("stats", next);
              }} />
              <Field label="Count" value={String(st.count ?? "")} onChange={(v) => {
                const next = [...stats];
                next[i] = { ...st, count: Number(v) || 0 };
                set("stats", next);
              }} type="number" />
              <Field label="Label" value={String(st.label ?? "")} onChange={(v) => {
                const next = [...stats];
                next[i] = { ...st, label: v };
                set("stats", next);
              }} />
              <Field label="Tone" value={String(st.tone ?? "")} onChange={(v) => {
                const next = [...stats];
                next[i] = { ...st, tone: v };
                set("stats", next);
              }} />
            </div>
          ))}
          <button type="button" className="cms-btn cms-btn-ghost" onClick={() => set("stats", [...stats, { icon: "fas fa-star", count: 0, label: "", tone: "green" }])}>
            + Add stat
          </button>
        </div>
      </div>
    );
  }

  if (layout === "cta" || layout === "contact_preview") {
    return (
      <div className="cms-section-fields">
        {layout === "contact_preview" ? (
          <Field label="Badge" value={String(section.badge ?? "")} onChange={(v) => set("badge", v)} />
        ) : null}
        <Field label="Title" value={String(section.title ?? "")} onChange={(v) => set("title", v)} />
        <Field label="Subtitle" value={String(section.subtitle ?? "")} onChange={(v) => set("subtitle", v)} type="textarea" />
        <CtaFields section={section} onChange={onChange} />
      </div>
    );
  }

  if (layout === "blog_preview") {
    return (
      <div className="cms-section-fields">
        <p className="cms-field-hint">Blog posts are loaded automatically from your Blog — edit titles here only.</p>
        <Field label="Badge" value={String(section.badge ?? "")} onChange={(v) => set("badge", v)} />
        <Field label="Title" value={String(section.title ?? "")} onChange={(v) => set("title", v)} />
        <Field label="Subtitle" value={String(section.subtitle ?? "")} onChange={(v) => set("subtitle", v)} type="textarea" />
      </div>
    );
  }

  if (layout === "seo_rich") {
    return (
      <div className="cms-section-fields">
        <Field label="Badge" value={String(section.badge ?? "")} onChange={(v) => set("badge", v)} />
        <Field label="Title" value={String(section.title ?? "")} onChange={(v) => set("title", v)} />
        <Field label="Subtitle (optional)" value={String(section.subtitle ?? "")} onChange={(v) => set("subtitle", v)} type="textarea" />
        <WysiwygField label="Content (HTML)" value={String(section.content ?? "")} onChange={(v) => set("content", v)} height={360} />
      </div>
    );
  }

  if (isGridLayout(layout)) {
    const items = (section.items as SectionRecord[]) || [];
    return (
      <div className="cms-section-fields">
        <Field label="Badge" value={String(section.badge ?? "")} onChange={(v) => set("badge", v)} />
        <Field label="Title" value={String(section.title ?? "")} onChange={(v) => set("title", v)} />
        <Field label="Subtitle" value={String(section.subtitle ?? "")} onChange={(v) => set("subtitle", v)} type="textarea" />
        <ItemsEditor
          items={items}
          onChange={(next) => set("items", next)}
          showLetter={layout === "services_marquee"}
        />
      </div>
    );
  }

  if (layout === "about") {
    const features = (section.features as SectionRecord[]) || [];
    return (
      <div className="cms-section-fields">
        <Field label="Badge" value={String(section.badge ?? "")} onChange={(v) => set("badge", v)} />
        <Field label="Title" value={String(section.title ?? "")} onChange={(v) => set("title", v)} />
        <Field label="Subtitle" value={String(section.subtitle ?? "")} onChange={(v) => set("subtitle", v)} type="textarea" />
        <WysiwygField label="Content" value={String(section.content ?? "")} onChange={(v) => set("content", v)} />
        <Field label="Image URL" value={String(section.image ?? "")} onChange={(v) => set("image", v)} />
        <ItemsEditor items={features} onChange={(next) => set("features", next)} />
        <CtaFields section={section} onChange={onChange} />
      </div>
    );
  }

  if (layout === "testimonials") {
    const items = (section.testimonials as SectionRecord[]) || [];
    return (
      <div className="cms-section-fields">
        <Field label="Badge" value={String(section.badge ?? "")} onChange={(v) => set("badge", v)} />
        <Field label="Title" value={String(section.title ?? "")} onChange={(v) => set("title", v)} />
        <Field label="Subtitle" value={String(section.subtitle ?? "")} onChange={(v) => set("subtitle", v)} type="textarea" />
        <div className="cms-repeater">
          <label className="cms-label">Testimonials</label>
          {items.map((t, i) => (
            <div key={i} className="cms-repeater-row">
              <Field label="Name" value={String(t.name ?? "")} onChange={(v) => {
                const next = [...items];
                next[i] = { ...t, name: v };
                set("testimonials", next);
              }} />
              <Field label="Role" value={String(t.role ?? "")} onChange={(v) => {
                const next = [...items];
                next[i] = { ...t, role: v };
                set("testimonials", next);
              }} />
              <Field label="Quote" value={String(t.text ?? "")} onChange={(v) => {
                const next = [...items];
                next[i] = { ...t, text: v };
                set("testimonials", next);
              }} type="textarea" />
            </div>
          ))}
          <button type="button" className="cms-btn cms-btn-ghost" onClick={() => set("testimonials", [...items, { name: "", role: "", text: "" }])}>
            + Add testimonial
          </button>
        </div>
      </div>
    );
  }

  if (layout === "portfolio") {
    return (
      <div className="cms-section-fields">
        <p className="cms-field-hint">
          Client projects are managed in{" "}
          <a href="/admin/portfolio" target="_blank" rel="noopener noreferrer">
            Admin → Portfolio
          </a>
          . Section limits &amp; defaults:{" "}
          <a href="/admin/settings" target="_blank" rel="noopener noreferrer">
            Settings → Portfolio section
          </a>
          .
        </p>
        <Field label="Badge" value={String(section.badge ?? "")} onChange={(v) => set("badge", v)} />
        <Field label="Title" value={String(section.title ?? "")} onChange={(v) => set("title", v)} />
        <Field label="Subtitle" value={String(section.subtitle ?? "")} onChange={(v) => set("subtitle", v)} type="textarea" />
        <Field label="Button label" value={String(section.ctaLabel ?? "")} onChange={(v) => set("ctaLabel", v)} />
        <Field label="Button link" value={String(section.ctaHref ?? "")} onChange={(v) => set("ctaHref", v)} />
      </div>
    );
  }

  if (layout === "why_codify") {
    const cards = (section.cards as SectionRecord[]) || [];
    return (
      <div className="cms-section-fields">
        <Field label="Badge" value={String(section.badge ?? "")} onChange={(v) => set("badge", v)} />
        <Field label="Title" value={String(section.title ?? "")} onChange={(v) => set("title", v)} />
        <Field label="Subtitle" value={String(section.subtitle ?? "")} onChange={(v) => set("subtitle", v)} type="textarea" />
        <div className="cms-repeater">
          <label className="cms-label">Cards</label>
          {cards.map((c, i) => (
            <div key={i} className="cms-repeater-row">
              <Field label="Icon" value={String(c.icon ?? "")} onChange={(v) => {
                const next = [...cards];
                next[i] = { ...c, icon: v };
                set("cards", next);
              }} />
              <Field label="Title" value={String(c.title ?? "")} onChange={(v) => {
                const next = [...cards];
                next[i] = { ...c, title: v };
                set("cards", next);
              }} />
              <Field label="Description" value={String(c.description ?? "")} onChange={(v) => {
                const next = [...cards];
                next[i] = { ...c, description: v };
                set("cards", next);
              }} type="textarea" />
              <Field label="Number label" value={String(c.number ?? "")} onChange={(v) => {
                const next = [...cards];
                next[i] = { ...c, number: v };
                set("cards", next);
              }} />
            </div>
          ))}
          <button type="button" className="cms-btn cms-btn-ghost" onClick={() => set("cards", [...cards, { icon: "fas fa-check", title: "", description: "", number: "" }])}>
            + Add card
          </button>
        </div>
      </div>
    );
  }

  if (layout === "process") {
    const steps = (section.steps as SectionRecord[]) || [];
    return (
      <div className="cms-section-fields">
        <Field label="Badge" value={String(section.badge ?? "")} onChange={(v) => set("badge", v)} />
        <Field label="Title" value={String(section.title ?? "")} onChange={(v) => set("title", v)} />
        <Field label="Subtitle" value={String(section.subtitle ?? "")} onChange={(v) => set("subtitle", v)} type="textarea" />
        <div className="cms-repeater">
          <label className="cms-label">Process steps</label>
          {steps.map((st, i) => (
            <div key={i} className="cms-repeater-row">
              <Field label="Icon" value={String(st.icon ?? "")} onChange={(v) => {
                const next = [...steps];
                next[i] = { ...st, icon: v };
                set("steps", next);
              }} />
              <Field label="Title" value={String(st.title ?? "")} onChange={(v) => {
                const next = [...steps];
                next[i] = { ...st, title: v };
                set("steps", next);
              }} />
              <Field label="Description" value={String(st.description ?? "")} onChange={(v) => {
                const next = [...steps];
                next[i] = { ...st, description: v };
                set("steps", next);
              }} type="textarea" />
            </div>
          ))}
          <button type="button" className="cms-btn cms-btn-ghost" onClick={() => set("steps", [...steps, { icon: "fas fa-circle", title: "", description: "" }])}>
            + Add step
          </button>
        </div>
      </div>
    );
  }

  if (layout === "courses") {
    const courses = (section.courses as SectionRecord[]) || [];
    return (
      <div className="cms-section-fields">
        <Field label="Badge" value={String(section.badge ?? "")} onChange={(v) => set("badge", v)} />
        <Field label="Title" value={String(section.title ?? "")} onChange={(v) => set("title", v)} />
        <Field label="Subtitle" value={String(section.subtitle ?? "")} onChange={(v) => set("subtitle", v)} type="textarea" />
        <ItemsEditor items={courses} onChange={(next) => set("courses", next)} />
      </div>
    );
  }

  // Default: badge, title, subtitle, optional content wysiwyg
  return (
    <div className="cms-section-fields">
      <Field label="Badge" value={String(section.badge ?? "")} onChange={(v) => set("badge", v)} />
      <Field label="Title" value={String(section.title ?? "")} onChange={(v) => set("title", v)} />
      <Field label="Subtitle" value={String(section.subtitle ?? "")} onChange={(v) => set("subtitle", v)} type="textarea" />
      {"content" in section || layout === "why_codify" || layout === "process" ? (
        <WysiwygField label="Content (HTML)" value={String(section.content ?? "")} onChange={(v) => set("content", v)} />
      ) : null}
    </div>
  );
}
