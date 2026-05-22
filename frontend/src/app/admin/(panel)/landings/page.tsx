import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { WpListScreen, WpListTable, WpRowActions } from "@/components/admin/wp/WpListTable";
import { WpListToolbar } from "@/components/admin/wp/WpListToolbar";
import {
  LANDING_SORT_OPTIONS,
  buildListApiQuery,
  parseListQuery,
  type AdminListSearchParams,
} from "@/lib/admin/list-query";
import { cmsAdminFetch } from "@/lib/admin/server";

type Row = {
  id: number;
  slug: string;
  service_name: string;
  status: string;
  updated_at: string;
};

type ListResponse = {
  items: Row[];
  total: number;
  page: number;
  perPage: number;
};

export default async function AdminLandingsListPage({
  searchParams,
}: {
  searchParams: AdminListSearchParams;
}) {
  const q = parseListQuery(searchParams, { sort: "service_name", order: "asc", perPage: 10 });
  const listPath = "/admin/landings";
  let data: ListResponse = { items: [], total: 0, page: 1, perPage: q.perPage };
  let err = "";

  try {
    data = await cmsAdminFetch<ListResponse>(`/landings/list?${buildListApiQuery(q)}`);
  } catch (e) {
    err = String(e);
  }

  return (
    <AdminShell title="Service landings">
      {err ? <div className="cms-notice err">{err}</div> : null}
      <WpListScreen
        title="Service landings"
        description="SEO landing pages per service (benefits, FAQ, deliverables)."
        addNewHref="/admin/landings/new"
        addNewLabel="Add New Landing"
      >
        <WpListTable
          listPath={listPath}
          listQuery={{ search: q.search || undefined, sort: q.sort, order: q.order, perPage: q.perPage }}
          page={data.page}
          perPage={data.perPage}
          total={data.total}
          toolbar={
            <WpListToolbar
              path={listPath}
              search={q.search}
              sort={q.sort}
              order={q.order}
              sortOptions={LANDING_SORT_OPTIONS}
            />
          }
          columns={[
            {
              key: "name",
              label: "Service",
              render: (r) => (
                <strong>
                  <Link className="row-title" href={`/admin/landings/${r.id}`}>
                    {r.service_name}
                  </Link>
                </strong>
              ),
            },
            { key: "slug", label: "Slug", render: (r) => <code>/{r.slug}</code> },
            { key: "status", label: "Status", render: (r) => r.status },
            {
              key: "updated",
              label: "Updated",
              render: (r) => <span className="date">{r.updated_at?.slice(0, 10)}</span>,
            },
          ]}
          rows={data.items}
          rowActions={(r) => (
            <WpRowActions
              editHref={`/admin/landings/${r.id}`}
              desimentorHref={`/admin/desimentor/service_landing/${r.id}`}
            />
          )}
          emptyMessage={q.search ? "No landings match your search." : "No items found."}
        />
      </WpListScreen>
    </AdminShell>
  );
}
