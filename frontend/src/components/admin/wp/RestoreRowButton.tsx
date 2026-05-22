"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAdminDialog } from "@/components/admin/dialog/AdminDialogProvider";
import { adminFetch } from "@/lib/admin/client";

export function RestoreRowButton({
  apiPath,
  redirectTo,
  status = "draft",
  label = "Restore",
}: {
  apiPath: string;
  redirectTo: string;
  status?: string;
  label?: string;
}) {
  const router = useRouter();
  const { alert } = useAdminDialog();
  const [busy, setBusy] = useState(false);

  async function restore() {
    setBusy(true);
    try {
      await adminFetch(apiPath, { method: "POST", json: { status } });
      router.push(redirectTo);
      router.refresh();
    } catch (e) {
      await alert({ title: "Error", message: String(e) });
      setBusy(false);
    }
  }

  return (
    <button type="button" className="row-action-btn row-action-btn--restore" onClick={restore} disabled={busy}>
      {busy ? "…" : label}
    </button>
  );
}
