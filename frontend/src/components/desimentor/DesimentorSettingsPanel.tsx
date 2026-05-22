"use client";

import { useEffect, useState } from "react";
import { getWidgetDef } from "@/lib/desimentor/widget-registry";
import { findSelectionPath } from "@/lib/desimentor/document-utils";
import {
  updateColumnWidth,
  updateElementStyles,
  updateWidgetProp,
} from "@/lib/desimentor/mutations";
import { useDesimentorStore } from "@/lib/desimentor/store";
import type { DesimentorDocument, ElementStyles } from "@/lib/desimentor/types";
import { DesimentorField } from "./DesimentorSettingsFields";

function getSelected(doc: DesimentorDocument, selectedId: string | null) {
  if (!selectedId) return null;
  const path = findSelectionPath(doc, selectedId);
  if (!path) return null;
  if (path.kind === "section") return { kind: "section" as const, data: doc.sections[path.sectionIndex] };
  if (path.kind === "column" && path.columnIndex !== undefined) {
    return { kind: "column" as const, data: doc.sections[path.sectionIndex].columns[path.columnIndex] };
  }
  if (path.kind === "widget" && path.columnIndex !== undefined && path.widgetIndex !== undefined) {
    return {
      kind: "widget" as const,
      data: doc.sections[path.sectionIndex].columns[path.columnIndex].widgets[path.widgetIndex],
    };
  }
  return null;
}

const TYPOGRAPHY_KEYS: (keyof ElementStyles)[] = [
  "fontSize",
  "fontWeight",
  "lineHeight",
  "color",
  "textAlign",
];

const SPACING_KEYS: (keyof ElementStyles)[] = [
  "marginTop",
  "marginRight",
  "marginBottom",
  "marginLeft",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
];

const BACKGROUND_KEYS: (keyof ElementStyles)[] = ["backgroundColor", "backgroundImage"];

const BORDER_KEYS: (keyof ElementStyles)[] = [
  "borderWidth",
  "borderColor",
  "borderStyle",
  "borderRadius",
  "boxShadow",
  "maxWidth",
];

function StyleGroup({
  title,
  keys,
  styles,
  onChange,
}: {
  title: string;
  keys: (keyof ElementStyles)[];
  styles: ElementStyles;
  onChange: (key: keyof ElementStyles, value: string) => void;
}) {
  return (
    <fieldset className="desimentor-style-group">
      <legend>{title}</legend>
      <div className="desimentor-style-grid">
        {keys.map((key) => (
          <div key={key} className="desimentor-field">
            <label className="dsmt-label">{key.replace(/([A-Z])/g, " $1").trim()}</label>
            {key === "textAlign" ? (
              <select className="dsmt-input" value={styles[key] ?? ""} onChange={(e) => onChange(key, e.target.value)}>
                <option value="">—</option>
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
                <option value="justify">Justify</option>
              </select>
            ) : key === "backgroundImage" ? (
              <input
                className="dsmt-input"
                placeholder="url(...)"
                value={styles[key] ?? ""}
                onChange={(e) => onChange(key, e.target.value)}
              />
            ) : (
              <input className="dsmt-input" value={styles[key] ?? ""} onChange={(e) => onChange(key, e.target.value)} />
            )}
          </div>
        ))}
      </div>
    </fieldset>
  );
}

export function DesimentorSettingsPanel() {
  const document = useDesimentorStore((s) => s.document);
  const selectedId = useDesimentorStore((s) => s.selectedId);
  const updateDocument = useDesimentorStore((s) => s.updateDocument);
  const [tab, setTab] = useState<"content" | "style" | "advanced">("content");

  const selected = getSelected(document, selectedId);

  useEffect(() => {
    setTab("content");
  }, [selectedId]);

  const styles: ElementStyles =
    selected?.kind === "section"
      ? (selected.data.settings ?? {})
      : selected?.kind === "column"
        ? (selected.data.styles ?? {})
        : selected?.kind === "widget"
          ? (selected.data.styles ?? {})
          : {};

  function setStyle(key: keyof ElementStyles, value: string) {
    if (!selectedId) return;
    updateDocument(updateElementStyles(document, selectedId, { [key]: value }));
  }

  if (!selected) {
    return (
      <aside className="desimentor-panel-right">
        <p className="desimentor-settings-empty">Select an element on the canvas.</p>
      </aside>
    );
  }

  const widgetDef = selected.kind === "widget" ? getWidgetDef(selected.data.type) : undefined;

  return (
    <aside className="desimentor-panel-right">
      <div className="desimentor-tabs">
        <button type="button" className={tab === "content" ? "active" : ""} onClick={() => setTab("content")}>
          Content
        </button>
        <button type="button" className={tab === "style" ? "active" : ""} onClick={() => setTab("style")}>
          Style
        </button>
        <button type="button" className={tab === "advanced" ? "active" : ""} onClick={() => setTab("advanced")}>
          Advanced
        </button>
      </div>
      <div className="desimentor-settings-body">
        {tab === "content" && selected.kind === "widget" && widgetDef ? (
          <>
            <p className="desimentor-settings-widget-title">
              <i className={`fa-solid ${widgetDef.icon}`} aria-hidden="true" /> {widgetDef.label}
            </p>
            {selected.data.type === "slider" ? (
              <p className="dsmt-hint" style={{ marginBottom: 8 }}>
                Edit text on canvas. Use Desktop / Tablet / Mobile in the top bar for responsive preview and per-device backgrounds.
              </p>
            ) : null}
            {widgetDef.contentFields.map((f) => (
              <DesimentorField
                key={f.key}
                field={f}
                value={selected.data.props[f.key]}
                onChange={(value) => {
                  if (!selectedId) return;
                  updateDocument(updateWidgetProp(document, selectedId, f.key, value));
                }}
              />
            ))}
          </>
        ) : null}

        {tab === "content" && selected.kind === "section" ? (
          <>
            <p className="desimentor-settings-widget-title">Section</p>
            <div className="desimentor-field">
              <label className="dsmt-label">Padding top</label>
              <input className="dsmt-input" value={styles.paddingTop ?? ""} onChange={(e) => setStyle("paddingTop", e.target.value)} />
            </div>
            <div className="desimentor-field">
              <label className="dsmt-label">Padding bottom</label>
              <input className="dsmt-input" value={styles.paddingBottom ?? ""} onChange={(e) => setStyle("paddingBottom", e.target.value)} />
            </div>
            <div className="desimentor-field">
              <label className="dsmt-label">Background</label>
              <input className="dsmt-input" value={styles.backgroundColor ?? ""} onChange={(e) => setStyle("backgroundColor", e.target.value)} />
            </div>
          </>
        ) : null}

        {tab === "content" && selected.kind === "column" ? (
          <>
            <p className="desimentor-settings-widget-title">Column</p>
            <div className="desimentor-field">
              <label className="dsmt-label">Width %</label>
              <input
                className="dsmt-input"
                type="number"
                min={10}
                max={100}
                value={selected.data.width}
                onChange={(e) => {
                  if (!selectedId) return;
                  updateDocument(updateColumnWidth(document, selectedId, Number(e.target.value)));
                }}
              />
            </div>
          </>
        ) : null}

        {tab === "style" ? (
          <>
            <StyleGroup title="Typography" keys={TYPOGRAPHY_KEYS} styles={styles} onChange={setStyle} />
            <StyleGroup title="Spacing" keys={SPACING_KEYS} styles={styles} onChange={setStyle} />
            <StyleGroup title="Background" keys={BACKGROUND_KEYS} styles={styles} onChange={setStyle} />
            <StyleGroup title="Border & effects" keys={BORDER_KEYS} styles={styles} onChange={setStyle} />
          </>
        ) : null}

        {tab === "advanced" ? (
          <>
            <div className="desimentor-field">
              <label className="dsmt-label">Custom CSS</label>
              <textarea
                className="dsmt-input dsmt-textarea"
                rows={6}
                value={styles.customCss ?? ""}
                onChange={(e) => setStyle("customCss", e.target.value)}
                placeholder=".selector { }"
              />
            </div>
          </>
        ) : null}
      </div>
    </aside>
  );
}
