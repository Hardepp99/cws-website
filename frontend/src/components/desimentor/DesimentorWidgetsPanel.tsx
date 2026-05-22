"use client";

import { useMemo, useState } from "react";
import { WIDGET_CATEGORIES, WIDGET_REGISTRY } from "@/lib/desimentor/widget-registry";
import { createSection } from "@/lib/desimentor/document-utils";
import { useDesimentorStore } from "@/lib/desimentor/store";
import { DesimentorPaletteWidget } from "./DesimentorPaletteWidget";
import { DesimentorTemplatesSidebar } from "./DesimentorTemplatesSidebar";

export function DesimentorWidgetsPanel() {
  const updateDocument = useDesimentorStore((s) => s.updateDocument);
  const document = useDesimentorStore((s) => s.document);
  const [query, setQuery] = useState("");
  const [openCats, setOpenCats] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(WIDGET_CATEGORIES.map((c) => [c.id, c.id === "basic" || c.id === "layout"]))
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return WIDGET_REGISTRY;
    return WIDGET_REGISTRY.filter(
      (w) => w.label.toLowerCase().includes(q) || w.type.toLowerCase().includes(q)
    );
  }, [query]);

  function toggleCat(id: string) {
    setOpenCats((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <aside className="desimentor-panel-left">
      <DesimentorTemplatesSidebar />

      <div className="desimentor-sidebar-block">
        <input
          type="search"
          className="dsmt-input desimentor-widget-search"
          placeholder="Search widgets…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="button"
          className="desimentor-section-btn"
          title="Add section"
          onClick={() => updateDocument({ ...document, sections: [...document.sections, createSection()] })}
        >
          <i className="fa-solid fa-layer-group" aria-hidden="true" />
          <span>Section</span>
        </button>
      </div>

      {WIDGET_CATEGORIES.map((cat) => {
        const widgets = filtered.filter((w) => w.category === cat.id);
        if (!widgets.length) return null;
        const open = openCats[cat.id] ?? false;
        return (
          <div key={cat.id} className="desimentor-widget-category">
            <button
              type="button"
              className="desimentor-category-toggle"
              onClick={() => toggleCat(cat.id)}
              aria-expanded={open}
            >
              <i className={`fa-solid fa-chevron-${open ? "down" : "right"}`} aria-hidden="true" />
              {cat.label}
              <span className="desimentor-category-count">{widgets.length}</span>
            </button>
            {open ? (
              <div className="desimentor-widgets-grid">
                {widgets.map((w) => (
                  <DesimentorPaletteWidget key={w.type} def={w} />
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </aside>
  );
}
