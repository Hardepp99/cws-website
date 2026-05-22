"use client";

import { useEffect, useState } from "react";
import { cloneDocument } from "@/lib/desimentor/document-utils";
import { listDesimentorTemplates, saveDesimentorTemplate } from "@/lib/admin/desimentor-client";
import { useDesimentorStore } from "@/lib/desimentor/store";
import type { DesimentorDocument, DesimentorTemplate } from "@/lib/desimentor/types";

export function DesimentorTemplatesSidebar() {
  const [items, setItems] = useState<DesimentorTemplate[]>([]);
  const [insertId, setInsertId] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"section" | "page" | "widget">("page");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const document = useDesimentorStore((s) => s.document);
  const updateDocument = useDesimentorStore((s) => s.updateDocument);

  useEffect(() => {
    listDesimentorTemplates("all")
      .then((r) => setItems(r.items))
      .catch(() => setItems([]));
  }, []);

  function refresh() {
    listDesimentorTemplates("all")
      .then((r) => setItems(r.items))
      .catch(() => setItems([]));
  }

  function onInsert() {
    const id = Number(insertId);
    const tpl = items.find((t) => t.id === id);
    if (!tpl) return;
    const content = tpl.content as DesimentorDocument;
    if (content?.sections) {
      updateDocument({
        ...document,
        sections: [...document.sections, ...cloneDocument(content).sections],
      });
      setMsg("Template inserted");
      setInsertId("");
    }
  }

  async function onSave() {
    if (!name.trim()) {
      setMsg("Enter a template name");
      return;
    }
    setSaving(true);
    setMsg("");
    try {
      await saveDesimentorTemplate({ name: name.trim(), category, content: document });
      setName("");
      setMsg("Saved");
      refresh();
    } catch (e) {
      setMsg(String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="desimentor-sidebar-block desimentor-templates-block">
      <h3 className="desimentor-sidebar-heading">Templates</h3>

      <div className="desimentor-field">
        <label className="dsmt-label">Insert template</label>
        <div className="desimentor-inline-actions">
          <select
            className="dsmt-input"
            value={insertId}
            onChange={(e) => setInsertId(e.target.value)}
          >
            <option value="">Choose…</option>
            {items.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.category})
              </option>
            ))}
          </select>
          <button
            type="button"
            className="dsmt-btn"
            disabled={!insertId}
            onClick={onInsert}
            title="Insert template"
          >
            +
          </button>
        </div>
      </div>

      <div className="desimentor-field">
        <label className="dsmt-label">Save as template</label>
        <input
          className="dsmt-input"
          placeholder="Template name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          className="dsmt-input"
          value={category}
          onChange={(e) => setCategory(e.target.value as typeof category)}
        >
          <option value="page">Page</option>
          <option value="section">Section</option>
          <option value="widget">Widget</option>
        </select>
        <button type="button" className="dsmt-btn dsmt-btn-primary" disabled={saving} onClick={onSave}>
          {saving ? "…" : "Save"}
        </button>
      </div>

      {msg ? <p className="desimentor-templates-msg">{msg}</p> : null}
    </div>
  );
}
