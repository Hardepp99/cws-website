"use client";

import { useEffect, useState } from "react";
import { WpEditScreen } from "@/components/admin/wp/WpEditScreen";
import { adminFetch } from "@/lib/admin/client";

type MenuItem = {
  label?: string;
  title?: string;
  href?: string;
  url?: string;
  children?: MenuItem[];
};

const LABELS: Record<string, string> = {
  primary: "Primary Menu",
  footer: "Footer Company",
  footerServices: "Footer Services",
  footerProducts: "Footer Products & Training",
};

function itemLabel(item: MenuItem): string {
  return String(item.label ?? item.title ?? "");
}

function itemHref(item: MenuItem): string {
  return String(item.href ?? item.url ?? "");
}

export function MenuEditor({ menuKey }: { menuKey: string }) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminFetch<{ items: MenuItem[] }>(`/menus/${menuKey}`)
      .then((d) => setItems(d.items || []))
      .catch((e) => setErr(String(e)));
  }, [menuKey]);

  function updateItem(i: number, patch: Partial<MenuItem>) {
    setItems((prev) => prev.map((it, j) => (j === i ? { ...it, ...patch } : it)));
  }

  async function save() {
    setSaving(true);
    setErr("");
    try {
      const normalized = items.map((it) => ({
        ...it,
        label: itemLabel(it),
        href: itemHref(it),
      }));
      await adminFetch(`/menus/${menuKey}`, { method: "PUT", json: { items: normalized } });
      setMsg("Menu saved.");
    } catch (e) {
      setErr(String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <WpEditScreen
      title={LABELS[menuKey] || menuKey}
      backHref="/admin/menus"
      onSave={save}
      saving={saving}
      message={msg}
      error={err}
    >
      <p className="cms-field-hint">Add links in order. Use <code>/contact</code> or <code>#ask-price</code> for internal targets.</p>
      <div className="cms-repeater">
        {items.map((item, i) => (
          <div key={i} className="cms-repeater-row cms-repeater-row--inline">
            <div>
              <label className="cms-label">Label</label>
              <input
                className="cms-input"
                value={itemLabel(item)}
                onChange={(e) => updateItem(i, { label: e.target.value, title: e.target.value })}
              />
            </div>
            <div>
              <label className="cms-label">URL</label>
              <input
                className="cms-input"
                value={itemHref(item)}
                onChange={(e) => updateItem(i, { href: e.target.value, url: e.target.value })}
              />
            </div>
            <button
              type="button"
              className="cms-btn-text danger"
              onClick={() => setItems((prev) => prev.filter((_, j) => j !== i))}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="cms-btn cms-btn-ghost"
          onClick={() => setItems((prev) => [...prev, { label: "New link", href: "/" }])}
        >
          + Add menu item
        </button>
      </div>
    </WpEditScreen>
  );
}
