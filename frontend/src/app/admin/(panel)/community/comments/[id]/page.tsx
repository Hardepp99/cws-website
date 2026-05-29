"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminRequireAdmin } from "@/components/admin/AdminRequireAdmin";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminSectionTabs, COMMUNITY_TABS } from "@/components/admin/community/AdminSectionTabs";
import { DeleteModerationButton } from "@/components/admin/community/DeleteModerationButton";
import { ModerationEditor } from "@/components/admin/community/ModerationEditor";
import { ModerationQuickActions } from "@/components/admin/community/ModerationQuickActions";
import { StatusBadge } from "@/components/admin/community/StatusBadge";
import { adminFetch } from "@/lib/admin/client";

type Comment = {
  id: number;
  body: string;
  status: string;
  displayName: string;
  email: string;
  postTitle: string;
  postSlug: string;
  createdAt: string;
};

export default function AdminCommentEditPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Comment | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    adminFetch<Comment>(`/blog-comments/${id}`)
      .then(setItem)
      .catch((e) => setErr(String(e)));
  }, [id]);

  return (
    <AdminShell title="Moderate comment">
      <AdminRequireAdmin>
        <AdminSectionTabs tabs={COMMUNITY_TABS} />
        {err ? <div className="cms-notice err">{err}</div> : null}
        {!item && !err ? <p>Loading…</p> : null}
        {item ? (
          <>
            <div className="cms-card" style={{ maxWidth: 720, marginBottom: 16 }}>
              <p className="cms-field-hint" style={{ marginTop: 0 }}>
                <Link href="/admin/community/comments">← Back to comments</Link>
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center", marginBottom: 12 }}>
                <h2 style={{ margin: 0, flex: "1 1 auto" }}>Blog comment #{item.id}</h2>
                <StatusBadge status={item.status} />
              </div>
              <p style={{ margin: "0 0 0.5rem" }}>
                <strong>{item.displayName}</strong>
                {item.email ? ` · ${item.email}` : null}
              </p>
              <p className="cms-field-hint" style={{ margin: "0 0 1rem" }}>
                Submitted {item.createdAt}
                {item.postSlug ? (
                  <>
                    {" "}
                    · Post:{" "}
                    <Link href={`/blog/${item.postSlug}`} target="_blank" rel="noreferrer">
                      {item.postTitle}
                    </Link>
                  </>
                ) : (
                  <> · {item.postTitle}</>
                )}
              </p>
              <div className="cms-moderation-body">{item.body}</div>
              <div className="cms-form-actions" style={{ marginTop: 16, flexWrap: "wrap", gap: 8 }}>
                <ModerationQuickActions
                  apiPath={`/blog-comments/${item.id}`}
                  actions={[
                    { status: "approved", label: "Approve", className: "row-action-btn--edit" },
                    { status: "pending", label: "Pending" },
                    { status: "rejected", label: "Reject", className: "row-action-btn--delete" },
                    { status: "spam", label: "Spam" },
                  ]}
                  onUpdated={() => {
                    adminFetch<Comment>(`/blog-comments/${id}`).then(setItem).catch(() => {});
                  }}
                />
                <DeleteModerationButton
                  apiPath={`/blog-comments/${item.id}`}
                  backHref="/admin/community/comments"
                />
              </div>
            </div>
            <ModerationEditor
              title="Change status"
              backHref="/admin/community/comments"
              apiPath={`/blog-comments/${item.id}`}
              status={item.status}
              statusOptions={[
                { value: "pending", label: "Pending" },
                { value: "approved", label: "Approved" },
                { value: "rejected", label: "Rejected" },
                { value: "spam", label: "Spam" },
              ]}
            />
          </>
        ) : null}
      </AdminRequireAdmin>
    </AdminShell>
  );
}
