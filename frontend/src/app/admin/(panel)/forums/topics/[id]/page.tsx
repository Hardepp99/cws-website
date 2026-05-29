"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminRequireAdmin } from "@/components/admin/AdminRequireAdmin";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminSectionTabs, FORUMS_TABS } from "@/components/admin/community/AdminSectionTabs";
import { ModerationEditor } from "@/components/admin/community/ModerationEditor";
import { adminFetch } from "@/lib/admin/client";

type Topic = {
  id: number;
  title: string;
  body: string;
  status: string;
  authorName: string;
  forumTitle: string;
  forumSlug: string;
  topicSlug: string;
  createdAt: string;
};

export default function AdminForumTopicEditPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Topic | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    adminFetch<Record<string, unknown>>(`/community/forum-topics/${id}`)
      .then((row) =>
        setItem({
          id: Number(row.id),
          title: String(row.title),
          body: String(row.body),
          status: String(row.status),
          authorName: String(row.authorName),
          forumTitle: String(row.forumTitle),
          forumSlug: String(row.forumSlug),
          topicSlug: String(row.slug),
          createdAt: String(row.createdAt),
        }),
      )
      .catch((e) => setErr(String(e)));
  }, [id]);

  return (
    <AdminShell title="Moderate topic">
      <AdminRequireAdmin>
        <AdminSectionTabs tabs={FORUMS_TABS} />
        {err ? <div className="cms-notice err">{err}</div> : null}
        {!item && !err ? <p>Loading…</p> : null}
        {item ? (
          <ModerationEditor
            title={item.title}
            backHref="/admin/forums/topics"
            apiPath={`/community/forum-topics/${item.id}`}
            status={item.status}
            statusOptions={[
              { value: "pending", label: "Pending" },
              { value: "published", label: "Published" },
              { value: "rejected", label: "Rejected" },
              { value: "locked", label: "Locked" },
              { value: "trash", label: "Trash" },
            ]}
          >
            <p>
              <strong>{item.authorName}</strong> in {item.forumTitle} · {item.createdAt}
            </p>
            <p className="cms-field-hint">
              <Link href={`/community/${item.forumSlug}/${item.topicSlug}`} target="_blank">
                View on site
              </Link>
            </p>
            <div className="cms-moderation-body" dangerouslySetInnerHTML={{ __html: item.body.replace(/\n/g, "<br>") }} />
          </ModerationEditor>
        ) : null}
      </AdminRequireAdmin>
    </AdminShell>
  );
}
