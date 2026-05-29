"use client";

import type { FaqItem } from "@/lib/wordpress/types";

type FaqEditorFieldProps = {
  label?: string;
  hint?: string;
  items: FaqItem[];
  onChange: (items: FaqItem[]) => void;
};

export function FaqEditorField({
  label = "FAQ",
  hint = "Add questions and answers shown at the bottom of this page.",
  items,
  onChange,
}: FaqEditorFieldProps) {
  function updateItem(index: number, patch: Partial<FaqItem>) {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function addItem() {
    onChange([...items, { question: "", answer: "" }]);
  }

  return (
    <div className="cms-faq-editor">
      <div className="cms-faq-editor__head">
        <label className="cms-label">{label}</label>
        {hint ? <p className="cms-field-hint">{hint}</p> : null}
      </div>
      {items.length === 0 ? (
        <p className="cms-field-hint cms-faq-editor__empty">No FAQ items yet. Add one below.</p>
      ) : (
        <ul className="cms-faq-editor__list">
          {items.map((item, index) => (
            <li key={index} className="cms-faq-editor__item">
              <div className="cms-faq-editor__item-head">
                <span className="cms-faq-editor__num">#{index + 1}</span>
                <button
                  type="button"
                  className="cms-btn cms-btn--ghost cms-btn--sm"
                  onClick={() => removeItem(index)}
                >
                  Remove
                </button>
              </div>
              <label className="cms-label">Question</label>
              <input
                className="cms-input"
                value={item.question}
                onChange={(e) => updateItem(index, { question: e.target.value })}
                placeholder="e.g. How long does a website take?"
              />
              <label className="cms-label">Answer</label>
              <textarea
                className="cms-textarea"
                rows={3}
                value={item.answer}
                onChange={(e) => updateItem(index, { answer: e.target.value })}
                placeholder="Your answer…"
              />
            </li>
          ))}
        </ul>
      )}
      <button type="button" className="cms-btn cms-btn--secondary cms-faq-editor__add" onClick={addItem}>
        + Add FAQ item
      </button>
    </div>
  );
}
