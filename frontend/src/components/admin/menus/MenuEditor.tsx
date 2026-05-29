"use client";

import { useEffect, useState } from "react";
import { WpEditScreen } from "@/components/admin/wp/WpEditScreen";
import { adminFetch } from "@/lib/admin/client";

type MenuItem = {
  label?: string;
  title?: string;
  href?: string;
  url?: string;
  icon?: string;
  children?: MenuItem[];
};

const LABELS: Record<string, string> = {
  primary: "Primary Menu",
  footer: "Footer Company",
  footerServices: "Footer Services",
  footerProducts: "Footer Products & Training",
};

const FOOTER_MENU_KEYS = new Set(["footer", "footerServices", "footerProducts"]);

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
  const isFooterMenu = FOOTER_MENU_KEYS.has(menuKey);

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
        icon: it.icon?.trim() || undefined,
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
      {isFooterMenu ? (
        <p className="cms-field-hint">
          Column headings (Company, Services, etc.) are edited under{" "}
          <a href="/admin/settings">Settings → Site</a>. Here you set each link label, URL, and icon
          shown in the footer.
        </p>
      ) : (
        <p className="cms-field-hint">
          Add links in order. Use <code>/contact</code> or <code>#ask-price</code> for internal targets.
        </p>
      )}
      <div className="cms-repeater">
        {items.map((item, i) => (
          <div key={i} className="cms-repeater-row cms-repeater-row--menu-item">
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
                placeholder="/about"
              />
            </div>
            <div>
              <label className="cms-label">Icon (Font Awesome)</label>
              <input
                className="cms-input"
                value={item.icon ?? ""}
                onChange={(e) => updateItem(i, { icon: e.target.value })}
                placeholder="fas fa-home"
              />
              {item.icon?.trim() ? (
                <span className="cms-field-hint cms-menu-icon-preview" aria-hidden="true">
                  Preview: <i className={item.icon.trim().startsWith("fa") ? item.icon.trim() : `fas fa-${item.icon.trim()}`} />
                </span>
              ) : null}
            </div>
            <button
              type="button"
              className="cms-btn-text danger cms-repeater-row__remove"
              onClick={() => setItems((prev) => prev.filter((_, j) => j !== i))}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="cms-btn cms-btn-ghost"
          onClick={() =>
            setItems((prev) => [
              ...prev,
              { label: "New link", href: "/", icon: isFooterMenu ? "fas fa-angle-right" : "fas fa-link" },
            ])
          }
        >
          + Add menu item
        </button>
      </div>
    </WpEditScreen>
  );
}
