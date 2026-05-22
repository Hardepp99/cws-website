import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { WpListScreen, WpListTable, WpRowActions } from "@/components/admin/wp/WpListTable";
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

export default async function AdminLandingsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Math.max(1, parseInt(searchParams.page || "1", 10) || 1);
  const perPage = 10;
  let data: ListResponse = { items: [], total: 0, page: 1, perPage };
  let err = "";

  try {
    data = await cmsAdminFetch<ListResponse>(`/landings/list?page=${page}&perPage=${perPage}`);
  } catch (e) {
    err = String(e);
  }

  return (
    <AdminShell title="Service landings">
      {err ? <div className="cms-notice err">{err}</div> : null}
      <WpListScreen
        title="Service landings"
        description="SEO landing pages for each service."
        addNewHref="/admin/landings/new"
        addNewLabel="Add New Landing"
      >
        <WpListTable
          basePath="/admin/landings"
          page={data.page}
          perPage={data.perPage}
          total={data.total}
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
        />
      </WpListScreen>
    </AdminShell>
  );
}
