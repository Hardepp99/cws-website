import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { WpListScreen, WpListTable, WpRowActions } from "@/components/admin/wp/WpListTable";
import { WpListToolbar } from "@/components/admin/wp/WpListToolbar";
import {
  SERVICE_SORT_OPTIONS,
  buildListApiQuery,
  parseListQuery,
  type AdminListSearchParams,
} from "@/lib/admin/list-query";
import { cmsAdminFetch } from "@/lib/admin/server";

type Row = {
  id: number;
  slug: string;
  title: string;
  status: string;
  updated_at: string;
};

type ListResponse = {
  items: Row[];
  total: number;
  page: number;
  perPage: number;
};

export default async function AdminServicesListPage({
  searchParams,
}: {
  searchParams: AdminListSearchParams;
}) {
  const q = parseListQuery(searchParams, { sort: "title", order: "asc", perPage: 10 });
  const listPath = "/admin/services";
  let data: ListResponse = { items: [], total: 0, page: 1, perPage: q.perPage };
  let err = "";

  try {
    data = await cmsAdminFetch<ListResponse>(`/services/list?${buildListApiQuery(q)}`);
  } catch (e) {
    err = String(e);
  }

  return (
    <AdminShell title="Services">
      {err ? <div className="cms-notice err">{err}</div> : null}
      <WpListScreen
        title="Services"
        description="Detail pages for services (hero, features, CTA)."
        addNewHref="/admin/services/new"
        addNewLabel="Add New Service"
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
              sortOptions={SERVICE_SORT_OPTIONS}
            />
          }
          columns={[
            {
              key: "title",
              label: "Title",
              render: (r) => (
                <strong>
                  <Link className="row-title" href={`/admin/services/${r.id}`}>
                    {r.title}
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
              editHref={`/admin/services/${r.id}`}
              desimentorHref={`/admin/desimentor/service/${r.id}`}
            />
          )}
          emptyMessage={q.search ? "No services match your search." : "No items found."}
        />
      </WpListScreen>
    </AdminShell>
  );
}
