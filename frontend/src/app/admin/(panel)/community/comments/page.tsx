import Link from "next/link";
import { AdminRequireAdmin } from "@/components/admin/AdminRequireAdmin";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminSectionTabs, COMMUNITY_TABS } from "@/components/admin/community/AdminSectionTabs";
import { CommentQuickActions } from "@/components/admin/community/ModerationQuickActions";
import { CommunityModerationSummary } from "@/components/admin/community/CommunityModerationSummary";
import { StatusBadge } from "@/components/admin/community/StatusBadge";
import { WpListScreen, WpListTable, WpRowActions } from "@/components/admin/wp/WpListTable";
import { WpListToolbar } from "@/components/admin/wp/WpListToolbar";
import { WpStatusFilter } from "@/components/admin/wp/WpStatusFilter";
import { buildListApiQuery, parseListQuery, type AdminListSearchParams } from "@/lib/admin/list-query";
import { cmsAdminFetch } from "@/lib/admin/server";

type Row = {
  id: number;
  body: string;
  displayName: string;
  email: string;
  postTitle: string;
  postSlug: string;
  status: string;
  createdAt: string;
};

type ListResponse = {
  items: Row[];
  total: number;
  page: number;
  perPage: number;
  counts?: Record<string, number>;
};

type ModerationCounts = {
  blogComments: number;
  memberBlogs: number;
  forumTopics: number;
  forumReplies: number;
};

const LIST_PATH = "/admin/community/comments";

const STATUS_VIEWS = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
  { id: "spam", label: "Spam" },
] as const;

function formatDate(value: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

export default async function AdminBlogCommentsPage({ searchParams }: { searchParams: AdminListSearchParams }) {
  const q = parseListQuery(searchParams, { sort: "id", order: "desc", perPage: 15 });
  const status = searchParams.status ?? "all";
  let data: ListResponse = { items: [], total: 0, page: 1, perPage: q.perPage };
  let moderation: ModerationCounts = { blogComments: 0, memberBlogs: 0, forumTopics: 0, forumReplies: 0 };
  let err = "";

  try {
    const apiQ = new URLSearchParams(buildListApiQuery({ ...q, status }));
    const [list, pending] = await Promise.all([
      cmsAdminFetch<ListResponse>(`/blog-comments/list?${apiQ}`),
      cmsAdminFetch<ModerationCounts>("/community/moderation-counts").catch(() => null),
    ]);
    data = list;
    if (pending) moderation = pending;
  } catch (e) {
    err = String(e);
  }

  const counts = data.counts ?? {};
  const views = STATUS_VIEWS.map((v) => ({
    ...v,
    count: counts[v.id] ?? (v.id === "all" ? data.total : 0),
  }));

  return (
    <AdminShell title="Community">
      <AdminRequireAdmin>
        <AdminSectionTabs tabs={COMMUNITY_TABS} />
        <CommunityModerationSummary counts={moderation} />
        {err ? <div className="cms-notice err">{err}</div> : null}
        <WpListScreen
          title="Blog comments"
          description="Approve member comments before they appear on blog posts. Use quick actions or open Moderate for full detail."
        >
          <WpStatusFilter
            listPath={LIST_PATH}
            current={status}
            listQuery={{ search: q.search || undefined, perPage: String(q.perPage) }}
            views={views}
          />
          <WpListTable
            rows={data.items ?? []}
            listPath={LIST_PATH}
            listQuery={{
              search: q.search || undefined,
              status: status !== "all" ? status : undefined,
              perPage: q.perPage,
            }}
            page={data.page}
            perPage={data.perPage}
            total={data.total}
            emptyMessage={
              err
                ? "Could not load comments. Check CMS is running and migration 015 is applied."
                : q.search || status !== "all"
                  ? "No comments match your filters."
                  : "No comments yet. They appear here when members comment on blog posts."
            }
            toolbar={
              <WpListToolbar
                path={LIST_PATH}
                search={q.search}
                sort={q.sort}
                order={q.order}
                sortOptions={[{ value: "id", label: "Date" }]}
                hiddenParams={{
                  status: status !== "all" ? status : "",
                  perPage: String(q.perPage),
                }}
                searchPlaceholder="Search comment, author, email, post…"
              />
            }
            columns={[
              { key: "id", label: "ID", render: (c) => <code>#{c.id}</code> },
              {
                key: "comment",
                label: "Comment",
                render: (c) => {
                  const text = c.body || "";
                  return (
                    <div>
                      <p className="cms-list-excerpt">
                        {text.slice(0, 140)}
                        {text.length > 140 ? "…" : ""}
                      </p>
                      {c.postSlug ? (
                        <small className="text-muted">
                          on{" "}
                          <Link href={`/blog/${c.postSlug}`} target="_blank" rel="noreferrer">
                            {c.postTitle || c.postSlug}
                          </Link>
                        </small>
                      ) : (
                        <small className="text-muted">{c.postTitle || "Post unavailable"}</small>
                      )}
                    </div>
                  );
                },
              },
              {
                key: "author",
                label: "Author",
                render: (c) => (
                  <div>
                    <strong>{c.displayName}</strong>
                    {c.email ? (
                      <>
                        <br />
                        <small className="text-muted">{c.email}</small>
                      </>
                    ) : null}
                  </div>
                ),
              },
              { key: "status", label: "Status", render: (c) => <StatusBadge status={c.status} /> },
              { key: "date", label: "Submitted", render: (c) => formatDate(c.createdAt) },
            ]}
            rowActions={(c) => (
              <WpRowActions>
                <CommentQuickActions id={c.id} />
                <Link href={`${LIST_PATH}/${c.id}`} className="row-action-btn row-action-btn--view">
                  Moderate
                </Link>
                {c.postSlug ? (
                  <Link
                    href={`/blog/${c.postSlug}`}
                    className="row-action-btn"
                    target="_blank"
                    rel="noreferrer"
                  >
                    View post
                  </Link>
                ) : null}
              </WpRowActions>
            )}
          />
        </WpListScreen>
      </AdminRequireAdmin>
    </AdminShell>
  );
}
