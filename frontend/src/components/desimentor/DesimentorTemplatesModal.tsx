"use client";

import { useEffect, useState } from "react";
import { cloneDocument } from "@/lib/desimentor/document-utils";
import { listDesimentorTemplates, saveDesimentorTemplate } from "@/lib/admin/desimentor-client";
import { useDesimentorStore } from "@/lib/desimentor/store";
import type { DesimentorDocument, DesimentorTemplate } from "@/lib/desimentor/types";

export function DesimentorTemplatesModal({
  open,
  onClose,
  mode,
}: {
  open: boolean;
  onClose: () => void;
  mode: "insert" | "save";
}) {
  const [items, setItems] = useState<DesimentorTemplate[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"section" | "page" | "widget">("page");
  const document = useDesimentorStore((s) => s.document);
  const updateDocument = useDesimentorStore((s) => s.updateDocument);

  useEffect(() => {
    if (!open) return;
    listDesimentorTemplates("all").then((r) => setItems(r.items)).catch(() => setItems([]));
  }, [open]);

  if (!open) return null;

  async function onSave() {
    await saveDesimentorTemplate({ name, category, content: document });
    onClose();
  }

  function onInsert(tpl: DesimentorTemplate) {
    const content = tpl.content as DesimentorDocument;
    if (content?.sections) {
      updateDocument({
        ...document,
        sections: [...document.sections, ...cloneDocument(content).sections],
      });
    }
    onClose();
  }

  return (
    <div className="desimentor-modal-overlay" role="dialog">
      <div className="cms-card desimentor-modal">
        <h2>{mode === "save" ? "Save as template" : "Insert template"}</h2>
        {mode === "save" ? (
          <>
            <label className="cms-label">Name</label>
            <input className="cms-input" value={name} onChange={(e) => setName(e.target.value)} />
            <label className="cms-label">Category</label>
            <select className="cms-select" value={category} onChange={(e) => setCategory(e.target.value as typeof category)}>
              <option value="page">Page</option>
              <option value="section">Section</option>
              <option value="widget">Widget</option>
            </select>
            <button type="button" className="cms-btn" onClick={onSave}>
              Save
            </button>
          </>
        ) : (
          <ul className="desimentor-template-list">
            {items.map((t) => (
              <li key={t.id}>
                <button type="button" className="cms-btn cms-btn-ghost" onClick={() => onInsert(t)}>
                  {t.name} ({t.category})
                </button>
              </li>
            ))}
          </ul>
        )}
        <button type="button" className="cms-btn cms-btn-ghost" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
