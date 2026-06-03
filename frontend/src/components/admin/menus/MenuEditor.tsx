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
  footerProducts: "Footer Products",
};

const FOOTER_MENU_KEYS = new Set(["footer", "footerServices", "footerProducts"]);

function itemLabel(item: MenuItem): string {
  return String(item.label ?? item.title ?? "");
}

function itemHref(item: MenuItem): string {
  return String(item.href ?? item.url ?? "");
}

function normalizeMenuItem(item: MenuItem): MenuItem {
  const children = Array.isArray(item.children)
    ? item.children.map((c) => normalizeMenuItem(c))
    : undefined;
  return {
    label: itemLabel(item),
    href: itemHref(item),
    icon: item.icon?.trim() || undefined,
    ...(children?.length ? { children } : {}),
  };
}

export function MenuEditor({ menuKey }: { menuKey: string }) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const isFooterMenu = FOOTER_MENU_KEYS.has(menuKey);
  const isPrimary = menuKey === "primary";

  useEffect(() => {
    setLoading(true);
    setErr("");
    adminFetch<{ items: MenuItem[] }>(`/menus/${menuKey}`)
      .then((d) => setItems(d.items || []))
      .catch((e) => setErr(String(e)))
      .finally(() => setLoading(false));
  }, [menuKey]);

  function updateItem(i: number, patch: Partial<MenuItem>) {
    setItems((prev) => prev.map((it, j) => (j === i ? { ...it, ...patch } : it)));
  }

  function updateChild(parentIndex: number, childIndex: number, patch: Partial<MenuItem>) {
    setItems((prev) =>
      prev.map((it, j) => {
        if (j !== parentIndex) return it;
        const children = [...(it.children || [])];
        children[childIndex] = { ...children[childIndex], ...patch };
        return { ...it, children };
      })
    );
  }

  function addChild(parentIndex: number) {
    setItems((prev) =>
      prev.map((it, j) => {
        if (j !== parentIndex) return it;
        const children = [...(it.children || []), { label: "New link", href: "/" }];
        return { ...it, children };
      })
    );
  }

  function removeChild(parentIndex: number, childIndex: number) {
    setItems((prev) =>
      prev.map((it, j) => {
        if (j !== parentIndex) return it;
        return { ...it, children: (it.children || []).filter((_, ci) => ci !== childIndex) };
      })
    );
  }

  async function save() {
    setSaving(true);
    setErr("");
    try {
      const normalized = items.map((it) => normalizeMenuItem(it));
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
      {loading ? <p>Loading menu…</p> : null}
      {isFooterMenu ? (
        <p className="cms-field-hint">
          Column headings (Company, Services, etc.) are edited under{" "}
          <a href="/admin/settings">Settings → Site</a>. Here you set each link label, URL, and icon
          shown in the footer.
        </p>
      ) : (
        <p className="cms-field-hint">
          Add top-level links in order. For dropdown menus (About, Services), add sub-items under each parent.
          Use <code>/contact</code> or <code>#ask-price</code> for internal targets.
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
            {isPrimary ? (
              <div className="cms-menu-children">
                <label className="cms-label">Dropdown sub-links (optional)</label>
                {(item.children || []).map((child, ci) => (
                  <div key={ci} className="cms-repeater-row cms-repeater-row--menu-child">
                    <input
                      className="cms-input"
                      value={itemLabel(child)}
                      placeholder="Label"
                      onChange={(e) =>
                        updateChild(i, ci, { label: e.target.value, title: e.target.value })
                      }
                    />
                    <input
                      className="cms-input"
                      value={itemHref(child)}
                      placeholder="/page"
                      onChange={(e) => updateChild(i, ci, { href: e.target.value, url: e.target.value })}
                    />
                    <input
                      className="cms-input"
                      value={child.icon ?? ""}
                      placeholder="Icon (optional)"
                      onChange={(e) => updateChild(i, ci, { icon: e.target.value })}
                    />
                    <button
                      type="button"
                      className="cms-btn-text danger"
                      onClick={() => removeChild(i, ci)}
                    >
                      Remove sub-link
                    </button>
                  </div>
                ))}
                <button type="button" className="cms-btn cms-btn-ghost cms-btn-sm" onClick={() => addChild(i)}>
                  + Add sub-link
                </button>
              </div>
            ) : null}
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
              {
                label: "New link",
                href: "/",
                icon: isFooterMenu ? "fas fa-angle-right" : "fas fa-link",
                ...(isPrimary ? { children: [] } : {}),
              },
            ])
          }
        >
          + Add menu item
        </button>
      </div>
    </WpEditScreen>
  );
}
