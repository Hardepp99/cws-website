"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminFetch } from "@/lib/admin/client";

export function DeleteModerationButton({
  apiPath,
  backHref,
  label = "Delete permanently",
}: {
  apiPath: string;
  backHref: string;
  label?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function remove() {
    if (!confirm("Delete this item permanently? This cannot be undone.")) return;
    setBusy(true);
    try {
      await adminFetch(apiPath, { method: "DELETE" });
      router.push(backHref);
      router.refresh();
    } catch (e) {
      alert(String(e));
      setBusy(false);
    }
  }

  return (
    <button type="button" className="cms-btn cms-btn-danger" onClick={remove} disabled={busy}>
      {busy ? "Deleting…" : label}
    </button>
  );
}
