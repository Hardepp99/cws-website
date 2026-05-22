"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAdminDialog } from "@/components/admin/dialog/AdminDialogProvider";
import { adminFetch } from "@/lib/admin/client";

export function DeleteRowButton({
  apiPath,
  redirectTo,
  label = "Trash",
  confirmMessage = "Move this item to trash?",
}: {
  apiPath: string;
  redirectTo: string;
  label?: string;
  confirmMessage?: string;
}) {
  const router = useRouter();
  const { confirm, alert } = useAdminDialog();
  const [busy, setBusy] = useState(false);

  async function remove() {
    const ok = await confirm({
      title: label === "Delete permanently" ? "Delete permanently" : "Move to trash",
      message: confirmMessage,
      confirmLabel: label,
      danger: true,
    });
    if (!ok) return;
    setBusy(true);
    try {
      await adminFetch(apiPath, { method: "DELETE" });
      router.push(redirectTo);
      router.refresh();
    } catch (e) {
      await alert({ title: "Error", message: String(e) });
      setBusy(false);
    }
  }

  return (
    <button type="button" className="row-action-btn row-action-btn--delete" onClick={remove} disabled={busy}>
      {busy ? "…" : label}
    </button>
  );
}
