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
  title: string;
  slug: string;
  status: string;
  authorName: string;
  forumTitle: string;
  forumSlug: string;
  createdAt: string;
};

const LIST_PATH = "/admin/forums/topics";

export default async function AdminForumTopicsPage({ searchParams }: { searchParams: AdminListSearchParams }) {
  const q = parseListQuery(searchParams, { sort: "id", order: "desc", perPage: 15 });
  const status = searchParams.status ?? "all";
  let data = { items: [] as Row[], total: 0, page: 1, perPage: q.perPage };
  let err = "";

  try {
    const apiQ = new URLSearchParams(buildListApiQuery({ ...q, status }));
    data = await cmsAdminFetch<typeof data>(`/community/forum-topics/list?${apiQ}`);
  } catch (e) {
    err = String(e);
  }

  return (
    <AdminShell title="Forums">
      <AdminRequireAdmin>
        <AdminSectionTabs tabs={FORUMS_TABS} />
        {err ? <div className="cms-notice err">{err}</div> : null}
        <WpListScreen title="Forum topics" description="Threads created by members in community forums.">
          <WpStatusFilter
            listPath={LIST_PATH}
            current={status}
            listQuery={{ search: q.search || undefined }}
            views={[
              { id: "all", label: "All" },
              { id: "pending", label: "Pending" },
              { id: "published", label: "Published" },
              { id: "rejected", label: "Rejected" },
              { id: "locked", label: "Locked" },
              { id: "trash", label: "Trash" },
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
                searchPlaceholder="Search topic, author, forum…"
              />
            }
            columns={[
              {
                key: "title",
                label: "Topic",
                render: (t) => (
                  <strong>
                    <Link className="row-title" href={`${LIST_PATH}/${t.id}`}>
                      {t.title}
                    </Link>
                  </strong>
                ),
              },
              { key: "forum", label: "Forum", render: (t) => t.forumTitle },
              { key: "author", label: "Author", render: (t) => t.authorName },
              { key: "status", label: "Status", render: (t) => <StatusBadge status={t.status} /> },
              { key: "date", label: "Created", render: (t) => t.createdAt },
            ]}
            rowActions={(t) => (
              <WpRowActions>
                <Link href={`${LIST_PATH}/${t.id}`} className="row-action-btn row-action-btn--edit">
                  Moderate
                </Link>
                <Link
                  href={`/community/${t.forumSlug}/${t.slug}`}
                  className="row-action-btn"
                  target="_blank"
                  rel="noreferrer"
                >
                  View
                </Link>
              </WpRowActions>
            )}
          />
        </WpListScreen>
      </AdminRequireAdmin>
    </AdminShell>
  );
}
