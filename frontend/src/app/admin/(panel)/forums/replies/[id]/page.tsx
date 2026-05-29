"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminRequireAdmin } from "@/components/admin/AdminRequireAdmin";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminSectionTabs, FORUMS_TABS } from "@/components/admin/community/AdminSectionTabs";
import { ModerationEditor } from "@/components/admin/community/ModerationEditor";
import { adminFetch } from "@/lib/admin/client";

type Reply = {
  id: number;
  body: string;
  status: string;
  authorName: string;
  topicTitle: string;
  forumSlug: string;
  topicSlug: string;
  createdAt: string;
};

export default function AdminForumReplyEditPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Reply | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    adminFetch<Reply>(`/community/forum-replies/${id}`)
      .then(setItem)
      .catch((e) => setErr(String(e)));
  }, [id]);

  return (
    <AdminShell title="Moderate reply">
      <AdminRequireAdmin>
        <AdminSectionTabs tabs={FORUMS_TABS} />
        {err ? <div className="cms-notice err">{err}</div> : null}
        {!item && !err ? <p>Loading…</p> : null}
        {item ? (
          <ModerationEditor
            title="Forum reply"
            backHref="/admin/forums/replies"
            apiPath={`/community/forum-replies/${item.id}`}
            status={item.status}
            statusOptions={[
              { value: "pending", label: "Pending" },
              { value: "approved", label: "Approved" },
              { value: "rejected", label: "Rejected" },
              { value: "spam", label: "Spam" },
            ]}
          >
            <p>
              <strong>{item.authorName}</strong> on {item.topicTitle} · {item.createdAt}
            </p>
            <p className="cms-field-hint">
              <Link href={`/community/${item.forumSlug}/${item.topicSlug}`} target="_blank">
                View topic on site
              </Link>
            </p>
            <div className="cms-moderation-body">{item.body}</div>
          </ModerationEditor>
        ) : null}
      </AdminRequireAdmin>
    </AdminShell>
  );
}
