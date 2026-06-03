"use client";

/** Per-page CSS scoped under `.pro-page` on the live site (classic HTML mode). */
export function PageProCssField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <>
      <label className="cms-label">Page custom CSS (optional)</label>
      <textarea
        className="cms-textarea cms-textarea--mono"
        rows={8}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`.pro-page__section--highlight { /* overrides */ }\n.pro-page__icon-list li { border-radius: 20px; }`}
        spellCheck={false}
      />
      <p className="cms-field-hint">
        Scoped to <code>.pro-page</code>. Use one <strong>&lt;h2&gt;</strong> per section in classic HTML;
        lists with <code>&lt;i class=&quot;fas fa-…&quot;&gt;</code> render as icon rows; images become split
        layouts. Switch to <strong>Desimentor</strong> for full visual builder layouts.
      </p>
    </>
  );
}
