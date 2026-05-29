import Link from "next/link";
import { AdminRequireAdmin } from "@/components/admin/AdminRequireAdmin";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminSectionTabs, FORUMS_TABS } from "@/components/admin/community/AdminSectionTabs";
import { StatusBadge } from "@/components/admin/community/StatusBadge";
import { WpListScreen, WpListTable, WpRowActions } from "@/components/admin/wp/WpListTable";
import { WpListToolbar } from "@/components/admin/wp/WpListToolbar";
import { WpStatusFilter } from "@/components/admin/wp/WpStatusFilter";
import { buildListApiQuery, parseListQuery, type AdminListSearchParams } from "@/lib/admin/list-query";
import { cmsAdminFetch } from "@/lib/admin/server";

type Row = {
  id: number;
  body: string;
  status: string;
  authorName: string;
  topicTitle: string;
  forumSlug: string;
  topicSlug: string;
  createdAt: string;
};

const LIST_PATH = "/admin/forums/replies";

export default async function AdminForumRepliesPage({ searchParams }: { searchParams: AdminListSearchParams }) {
  const q = parseListQuery(searchParams, { sort: "id", order: "desc", perPage: 15 });
  const status = searchParams.status ?? "all";
  let data = { items: [] as Row[], total: 0, page: 1, perPage: q.perPage };
  let err = "";

  try {
    const apiQ = new URLSearchParams(buildListApiQuery({ ...q, status }));
    data = await cmsAdminFetch<typeof data>(`/community/forum-replies/list?${apiQ}`);
  } catch (e) {
    err = String(e);
  }

  return (
    <AdminShell title="Forums">
      <AdminRequireAdmin>
        <AdminSectionTabs tabs={FORUMS_TABS} />
        {err ? <div className="cms-notice err">{err}</div> : null}
        <WpListScreen title="Forum replies" description="Replies to forum topics — approve before they appear publicly.">
          <WpStatusFilter
            listPath={LIST_PATH}
            current={status}
            listQuery={{ search: q.search || undefined }}
            views={[
              { id: "all", label: "All" },
              { id: "pending", label: "Pending" },
              { id: "approved", label: "Approved" },
              { id: "rejected", label: "Rejected" },
              { id: "spam", label: "Spam" },
            ]}
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
                sortOptions={[{ value: "id", label: "Date" }]}
                hiddenParams={{ status: status !== "all" ? status : "" }}
                searchPlaceholder="Search reply, author, topic…"
              />
            }
            columns={[
              {
                key: "reply",
                label: "Reply",
                render: (r) => <p className="cms-list-excerpt">{r.body}</p>,
              },
              { key: "topic", label: "Topic", render: (r) => r.topicTitle },
              { key: "author", label: "Author", render: (r) => r.authorName },
              { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
              { key: "date", label: "Date", render: (r) => r.createdAt },
            ]}
            rowActions={(r) => (
              <WpRowActions>
                <Link href={`${LIST_PATH}/${r.id}`} className="row-action-btn row-action-btn--edit">
                  Moderate
                </Link>
                <Link
                  href={`/community/${r.forumSlug}/${r.topicSlug}`}
                  className="row-action-btn"
                  target="_blank"
                  rel="noreferrer"
                >
                  View topic
                </Link>
              </WpRowActions>
            )}
          />
        </WpListScreen>
      </AdminRequireAdmin>
    </AdminShell>
  );
}
