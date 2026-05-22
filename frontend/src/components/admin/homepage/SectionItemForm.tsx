"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SectionItemFields } from "./SectionItemFields";
import { layoutLabel } from "./layouts";
import {
  getRepeaterItems,
  getSectionRepeaters,
  setRepeaterItems,
} from "./section-repeaters";
import type { SectionRecord } from "./SectionEditor";
import { useHomepageSection } from "./useHomepageSection";
import { itemListTitle, newItemId, normalizeItemStatus } from "@/lib/homepage/item-status";
import { WpEditScreen } from "@/components/admin/wp/WpEditScreen";

export function SectionItemForm({
  sectionId,
  repeaterKey,
  itemId,
  isNew,
}: {
  sectionId: number;
  repeaterKey: string;
  itemId?: string;
  isNew?: boolean;
}) {
  const router = useRouter();
  const { section, adminTitle, loading, err, saveSection } = useHomepageSection(sectionId);
  const [item, setItem] = useState<SectionRecord | null>(null);
  const [itemStatus, setItemStatus] = useState("draft");
  const [msg, setMsg] = useState("");
  const [saveErr, setSaveErr] = useState("");
  const [saving, setSaving] = useState(false);

  const layout = String(section?.acfFcLayout ?? "");
  const repeater = getSectionRepeaters(layout).find((r) => r.key === repeaterKey);

  useEffect(() => {
    if (!section || !repeater) return;
    if (isNew) {
      const empty = repeater.emptyItem();
      setItem(empty);
      setItemStatus(String(empty.status ?? "draft"));
      return;
    }
    const found = getRepeaterItems(section, repeaterKey).find((it) => String(it.id) === itemId);
    if (found) {
      setItem(found);
      setItemStatus(normalizeItemStatus(found.status));
    } else {
      setItem(null);
    }
  }, [section, repeater, repeaterKey, itemId, isNew]);

  async function save() {
    if (!section || !repeater || !item) return;
    setSaving(true);
    setSaveErr("");
    setMsg("");
    const row = { ...item, id: item.id ?? newItemId(), status: itemStatus };
    let items = getRepeaterItems(section, repeaterKey);
    if (isNew) {
      items = [...items, row];
    } else {
      items = items.map((it) => (String(it.id) === String(row.id) ? row : it));
    }
    const nextSection = setRepeaterItems(section, repeaterKey, items);
    try {
      await saveSection(nextSection);
      setMsg("Item saved.");
      if (isNew) {
        router.push(
          `/admin/homepage/${sectionId}/items/${row.id}/edit?key=${encodeURIComponent(repeaterKey)}`
        );
        router.refresh();
      }
    } catch (e) {
      setSaveErr(String(e));
    } finally {
      setSaving(false);
    }
  }

  const listHref = `/admin/homepage/${sectionId}/items?key=${encodeURIComponent(repeaterKey)}`;
  const sectionTitle = adminTitle || layoutLabel(layout);

  if (loading) return <p>Loading…</p>;
  if (!repeater) return <p className="cms-notice err">Unknown list for this section.</p>;
  if (!isNew && !item) return <p className="cms-notice err">{err || "Item not found."}</p>;

  const title = isNew
    ? `Add ${repeater.singular}`
    : itemListTitle(item!, repeater.singular);

  return (
    <WpEditScreen
      title={`${title} — ${repeater.label}`}
      backHref={listHref}
      backLabel="← Back to list"
      onSave={save}
      saving={saving}
      saveLabel={itemStatus === "published" ? (isNew ? "Publish" : "Update") : "Save draft"}
      message={msg}
      error={saveErr || err}
    >
      <p className="wp-list-desc">
        Section: <Link href={`/admin/homepage/${sectionId}/edit`}>{sectionTitle}</Link>
      </p>
      <div className="section-item-status-fields">
        <label className="cms-label">Item status</label>
        <select className="cms-select" value={itemStatus} onChange={(e) => setItemStatus(e.target.value)}>
          <option value="published">Published — visible on site</option>
          <option value="draft">Draft — hidden on site</option>
          {itemStatus === "trash" ? <option value="trash">Trash</option> : null}
        </select>
        {itemStatus === "trash" ? (
          <p className="cms-notice">In trash. Set to Draft or Published to show on the site again.</p>
        ) : null}
      </div>
      {item ? (
        <SectionItemFields item={item} fields={repeater.fields} onChange={setItem} />
      ) : null}
    </WpEditScreen>
  );
}
