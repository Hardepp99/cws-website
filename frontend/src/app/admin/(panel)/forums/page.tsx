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
  sortOrder: number;
  topicCount: number;
};

const LIST_PATH = "/admin/forums";

export default async function AdminForumsPage({ searchParams }: { searchParams: AdminListSearchParams }) {
  const q = parseListQuery(searchParams, { sort: "id", order: "asc", perPage: 20 });
  const status = searchParams.status ?? "all";
  let data = { items: [] as Row[], total: 0, page: 1, perPage: q.perPage };
  let err = "";

  try {
    const apiQ = new URLSearchParams(buildListApiQuery({ ...q, status }));
    data = await cmsAdminFetch<typeof data>(`/forums/list?${apiQ}`);
  } catch (e) {
    err = String(e);
  }

  return (
    <AdminShell title="Forums">
      <AdminRequireAdmin>
        <AdminSectionTabs tabs={FORUMS_TABS} />
        {err ? <div className="cms-notice err">{err}</div> : null}
        <WpListScreen
          title="Forums"
          description="Discussion boards on the public community section."
          addNewHref="/admin/forums/new"
          addNewLabel="Add forum"
        >
          <WpStatusFilter
            listPath={LIST_PATH}
            current={status}
            listQuery={{ search: q.search || undefined }}
            views={[
              { id: "all", label: "All" },
              { id: "published", label: "Published" },
              { id: "draft", label: "Draft" },
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
                sortOptions={[
                  { value: "id", label: "ID" },
                  { value: "title", label: "Title" },
                ]}
                hiddenParams={{ status: status !== "all" ? status : "" }}
                searchPlaceholder="Search forums…"
              />
            }
            columns={[
              {
                key: "title",
                label: "Forum",
                render: (f) => (
                  <strong>
                    <Link className="row-title" href={`/admin/forums/${f.id}`}>
                      {f.title}
                    </Link>
                  </strong>
                ),
              },
              { key: "slug", label: "Slug", render: (f) => <code>/community/{f.slug}</code> },
              { key: "topics", label: "Topics", render: (f) => f.topicCount },
              { key: "status", label: "Status", render: (f) => <StatusBadge status={f.status} /> },
              { key: "order", label: "Order", render: (f) => f.sortOrder },
            ]}
            rowActions={(f) => (
              <WpRowActions>
                <Link href={`/admin/forums/${f.id}`} className="row-action-btn row-action-btn--edit">
                  Edit
                </Link>
                <Link href={`/community/${f.slug}`} className="row-action-btn" target="_blank" rel="noreferrer">
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
