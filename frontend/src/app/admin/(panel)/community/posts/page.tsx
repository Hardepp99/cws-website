import Link from "next/link";
import { AdminRequireAdmin } from "@/components/admin/AdminRequireAdmin";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminSectionTabs, COMMUNITY_TABS } from "@/components/admin/community/AdminSectionTabs";
import { CommunityModerationSummary } from "@/components/admin/community/CommunityModerationSummary";
import { MemberBlogQuickActions } from "@/components/admin/community/ModerationQuickActions";
import { StatusBadge } from "@/components/admin/community/StatusBadge";
import { WpListScreen, WpListTable, WpRowActions } from "@/components/admin/wp/WpListTable";
import { WpListToolbar } from "@/components/admin/wp/WpListToolbar";
import { WpStatusFilter } from "@/components/admin/wp/WpStatusFilter";
import { buildListApiQuery, parseListQuery, type AdminListSearchParams } from "@/lib/admin/list-query";
import { cmsAdminFetch } from "@/lib/admin/server";

type Row = {
  id: number;
  title: string;
  slug: string;
  status: string;
  authorName: string;
  authorEmail: string;
  updatedAt: string;
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

const LIST_PATH = "/admin/community/posts";

const STATUS_VIEWS = [
  { id: "all", label: "All" },
  { id: "pending_review", label: "Pending review" },
  { id: "published", label: "Published" },
  { id: "rejected", label: "Rejected" },
  { id: "draft", label: "Draft" },
] as const;

export default async function AdminMemberPostsPage({ searchParams }: { searchParams: AdminListSearchParams }) {
  const q = parseListQuery(searchParams, { sort: "id", order: "desc", perPage: 15 });
  const status = searchParams.status ?? "all";
  let data: ListResponse = { items: [], total: 0, page: 1, perPage: q.perPage };
  let moderation: ModerationCounts = { blogComments: 0, memberBlogs: 0, forumTopics: 0, forumReplies: 0 };
  let err = "";

  try {
    const apiQ = new URLSearchParams(buildListApiQuery({ ...q, status }));
    const [list, pending] = await Promise.all([
      cmsAdminFetch<ListResponse>(`/community/member-blogs/list?${apiQ}`),
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
          title="Member blog posts"
          description="Approve or reject member submissions. Use quick actions or open Review for full edit."
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
            listQuery={{ search: q.search || undefined, status: status !== "all" ? status : undefined, perPage: q.perPage }}
            page={data.page}
            perPage={data.perPage}
            total={data.total}
            toolbar={
              <WpListToolbar
                path={LIST_PATH}
                search={q.search}
                sort={q.sort}
                order={q.order}
                sortOptions={[{ value: "id", label: "Updated" }]}
                hiddenParams={{ status: status !== "all" ? status : "" }}
                searchPlaceholder="Search title, author…"
              />
            }
            columns={[
              {
                key: "title",
                label: "Title",
                render: (p) => (
                  <strong>
                    <Link className="row-title" href={`/admin/blog/${p.id}`}>
                      {p.title}
                    </Link>
                  </strong>
                ),
              },
              { key: "author", label: "Author", render: (p) => `${p.authorName} (${p.authorEmail})` },
              { key: "status", label: "Status", render: (p) => <StatusBadge status={p.status} /> },
              { key: "updated", label: "Updated", render: (p) => p.updatedAt },
            ]}
            rowActions={(p) => (
              <WpRowActions>
                <MemberBlogQuickActions id={p.id} currentStatus={p.status} />
                <Link href={`/admin/blog/${p.id}`} className="row-action-btn row-action-btn--view">
                  Review
                </Link>
                {p.slug ? (
                  <Link
                    href={`/blog/${p.slug}`}
                    className="row-action-btn"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Preview
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
