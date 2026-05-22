"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { layoutLabel } from "./layouts";
import {
  countItemsByStatus,
  getRepeaterItems,
  getSectionRepeaters,
  setRepeaterItems,
  type SectionRepeaterDef,
} from "./section-repeaters";
import type { SectionRecord } from "./SectionEditor";
import { useAdminDialog } from "@/components/admin/dialog/AdminDialogProvider";
import { useHomepageSection } from "./useHomepageSection";
import { WpListScreen, WpListTable, WpRowActions } from "@/components/admin/wp/WpListTable";
import { WpStatusViews } from "@/components/admin/wp/WpStatusViews";
import { itemListTitle, normalizeItemStatus } from "@/lib/homepage/item-status";

function statusBadge(status: string) {
  const cls =
    status === "published" ? "status-published" : status === "draft" ? "status-draft" : "status-trash";
  return <span className={`status-badge ${cls}`}>{status}</span>;
}

function trashItem(items: SectionRecord[], id: string): SectionRecord[] {
  return items.map((it) =>
    String(it.id) === id ? { ...it, status: "trash" } : it
  );
}

function restoreItem(items: SectionRecord[], id: string, status = "draft"): SectionRecord[] {
  return items.map((it) => (String(it.id) === id ? { ...it, status } : it));
}

function deletePermanent(items: SectionRecord[], id: string): SectionRecord[] {
  return items.filter((it) => String(it.id) !== id);
}

export function SectionItemsList({
  sectionId,
  repeaterKey,
  statusFilter = "all",
  page = 1,
}: {
  sectionId: number;
  repeaterKey: string;
  statusFilter?: string;
  page?: number;
}) {
  const router = useRouter();
  const { confirm } = useAdminDialog();
  const { section, adminTitle, loading, err, saveSection } = useHomepageSection(sectionId);
  const [msg, setMsg] = useState("");
  const [actionErr, setActionErr] = useState("");
  const perPage = 10;

  const layout = String(section?.acfFcLayout ?? "");
  const repeater: SectionRepeaterDef | undefined = getSectionRepeaters(layout).find((r) => r.key === repeaterKey);
  const allItems = section ? getRepeaterItems(section, repeaterKey) : [];
  const counts = countItemsByStatus(allItems);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return allItems;
    return allItems.filter((it) => normalizeItemStatus(it.status) === statusFilter);
  }, [allItems, statusFilter]);

  const total = filtered.length;
  const offset = (page - 1) * perPage;
  const pageItems = filtered.slice(offset, offset + perPage);

  const basePath = `/admin/homepage/${sectionId}/items?key=${encodeURIComponent(repeaterKey)}${
    statusFilter !== "all" ? `&status=${statusFilter}` : ""
  }`;

  async function persistItems(nextItems: SectionRecord[]) {
    if (!section || !repeater) return;
    const nextSection = setRepeaterItems(section, repeaterKey, nextItems);
    await saveSection(nextSection);
    router.refresh();
  }

  async function handleTrash(id: string) {
    setActionErr("");
    try {
      await persistItems(trashItem(allItems, id));
      setMsg("Moved to trash.");
    } catch (e) {
      setActionErr(String(e));
    }
  }

  async function handleRestore(id: string) {
    setActionErr("");
    try {
      await persistItems(restoreItem(allItems, id, "draft"));
      setMsg("Item restored as draft.");
    } catch (e) {
      setActionErr(String(e));
    }
  }

  async function handleDeletePermanent(id: string) {
    setActionErr("");
    try {
      await persistItems(deletePermanent(allItems, id));
      setMsg("Item deleted permanently.");
    } catch (e) {
      setActionErr(String(e));
    }
  }

  if (loading) return <p>Loading…</p>;
  if (!section || !repeater) {
    return <p className="cms-notice err">{err || "Section or list not found."}</p>;
  }

  const sectionTitle = adminTitle || layoutLabel(layout);

  return (
    <WpListScreen
      title={`${repeater.label} — ${sectionTitle}`}
      description="Each row is one item on the live homepage (when published)."
      addNewHref={`/admin/homepage/${sectionId}/items/new?key=${encodeURIComponent(repeaterKey)}`}
      addNewLabel={`Add New ${repeater.singular}`}
    >
      <p className="wp-list-desc">
        <Link href={`/admin/homepage/${sectionId}/edit`}>← Section settings</Link>
        {" · "}
        <Link href="/admin/homepage">All sections</Link>
      </p>
      {msg ? <div className="cms-notice">{msg}</div> : null}
      {actionErr ? <div className="cms-notice err">{actionErr}</div> : null}
      <WpStatusViews
        basePath={`/admin/homepage/${sectionId}/items?key=${encodeURIComponent(repeaterKey)}`}
        current={statusFilter}
        counts={counts}
      />
      <WpListTable
        basePath={basePath}
        page={page}
        perPage={perPage}
        total={total}
        rows={pageItems.map((it) => ({ ...it, id: String(it.id) }))}
        columns={[
          {
            key: "title",
            label: "Title",
            render: (row) => (
              <strong>
                <Link
                  className="row-title"
                  href={`/admin/homepage/${sectionId}/items/${row.id}/edit?key=${encodeURIComponent(repeaterKey)}`}
                >
                  {itemListTitle(row, repeater.singular)}
                </Link>
              </strong>
            ),
          },
          {
            key: "status",
            label: "Status",
            render: (row) => statusBadge(normalizeItemStatus((row as SectionRecord).status)),
          },
        ]}
        rowActions={(row) => {
          const item = row as SectionRecord;
          const st = normalizeItemStatus(item.status);
          const editHref = `/admin/homepage/${sectionId}/items/${item.id}/edit?key=${encodeURIComponent(repeaterKey)}`;
          if (st === "trash") {
            return (
              <WpRowActions
                editHref={editHref}
                deleteAction={
                  <>
                    <button
                      type="button"
                      className="row-action-btn row-action-btn--restore"
                      onClick={() => handleRestore(String(item.id))}
                    >
                      Restore
                    </button>
                    <button
                      type="button"
                      className="row-action-btn row-action-btn--delete"
                      onClick={async () => {
                        const ok = await confirm({
                          title: "Delete permanently",
                          message: "Delete this item permanently? This cannot be undone.",
                          confirmLabel: "Delete permanently",
                          danger: true,
                        });
                        if (ok) handleDeletePermanent(String(item.id));
                      }}
                    >
                      Delete permanently
                    </button>
                  </>
                }
              />
            );
          }
          return (
            <WpRowActions
              editHref={editHref}
              deleteAction={
                <button
                  type="button"
                  className="row-action-btn row-action-btn--delete"
                  onClick={async () => {
                    const ok = await confirm({
                      title: "Move to trash",
                      message: "Move this item to trash?",
                      confirmLabel: "Trash",
                      danger: true,
                    });
                    if (ok) handleTrash(String(item.id));
                  }}
                >
                  Trash
                </button>
              }
            />
          );
        }}
      />
    </WpListScreen>
  );
}
