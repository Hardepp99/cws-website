"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminFetch } from "@/lib/admin/client";

type Action = { status: string; label: string; className?: string };

export function ModerationQuickActions({
  apiPath,
  actions,
  onUpdated,
}: {
  apiPath: string;
  actions: Action[];
  onUpdated?: () => void;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState("");

  async function apply(status: string) {
    setBusy(status);
    setErr("");
    try {
      await adminFetch(apiPath, { method: "PUT", json: { status } });
      onUpdated?.();
      router.refresh();
    } catch (e) {
      setErr(String(e));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mod-quick-actions">
      {actions.map((a) => (
        <button
          key={a.status}
          type="button"
          className={`row-action-btn ${a.className ?? ""}`.trim()}
          disabled={busy !== null}
          onClick={() => apply(a.status)}
        >
          {busy === a.status ? "…" : a.label}
        </button>
      ))}
      {err ? <span className="mod-quick-actions__err">{err}</span> : null}
    </div>
  );
}

export function CommentQuickActions({ id }: { id: number }) {
  return (
    <ModerationQuickActions
      apiPath={`/blog-comments/${id}`}
      actions={[
        { status: "approved", label: "Approve", className: "row-action-btn--edit" },
        { status: "rejected", label: "Reject", className: "row-action-btn--delete" },
        { status: "spam", label: "Spam" },
      ]}
    />
  );
}

export function MemberBlogQuickActions({ id, currentStatus }: { id: number; currentStatus?: string }) {
  const actions: Action[] = [];
  if (currentStatus !== "published") {
    actions.push({ status: "published", label: "Approve", className: "row-action-btn--edit" });
  }
  if (currentStatus !== "rejected") {
    actions.push({ status: "rejected", label: "Reject", className: "row-action-btn--delete" });
  }
  if (currentStatus !== "pending_review" && currentStatus !== "draft") {
    actions.push({ status: "pending_review", label: "Pending" });
  }

  return (
    <ModerationQuickActions
      apiPath={`/blog/${id}/moderate`}
      actions={
        actions.length
          ? actions
          : [
              { status: "pending_review", label: "Re-review" },
              { status: "rejected", label: "Reject", className: "row-action-btn--delete" },
            ]
      }
    />
  );
}
