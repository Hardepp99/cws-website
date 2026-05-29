import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { WpListScreen, WpListTable, WpRowActions } from "@/components/admin/wp/WpListTable";
import { WpListToolbar } from "@/components/admin/wp/WpListToolbar";
import { buildListApiQuery, parseListQuery, type AdminListSearchParams } from "@/lib/admin/list-query";
import { cmsAdminFetch } from "@/lib/admin/server";

type Row = {
  id: number;
  title: string;
  client_name: string;
  location: string;
  category: string;
  show_on_homepage: number;
  sort_order: number;
  status: string;
};

type ListResponse = {
  items: Row[];
  total: number;
  page: number;
  perPage: number;
};

const SORT_OPTIONS = [
  { value: "sort_order", label: "Sort order" },
  { value: "client_name", label: "Client name" },
  { value: "location", label: "Location" },
  { value: "updated_at", label: "Updated" },
];

export default async function AdminPortfolioListPage({
  searchParams,
}: {
  searchParams: AdminListSearchParams;
}) {
  const q = parseListQuery(searchParams, { sort: "sort_order", order: "asc", perPage: 20 });
  const listPath = "/admin/portfolio";
  let data: ListResponse = { items: [], total: 0, page: 1, perPage: q.perPage };
  let err = "";

  try {
    data = await cmsAdminFetch<ListResponse>(`/portfolio/list?${buildListApiQuery(q)}`);
  } catch (e) {
    err = String(e);
  }

  return (
    <AdminShell title="Portfolio">
      {err ? <div className="cms-notice err">{err}</div> : null}
      <WpListScreen
        title="Local client portfolio"
        description="Projects shown on the homepage. Section heading & max count: Settings → Portfolio section."
        addNewHref="/admin/portfolio/new"
        addNewLabel="Add client project"
        headerActions={
          <Link href="/admin/settings" className="cms-btn cms-btn-ghost">
            Portfolio settings
          </Link>
        }
      >
        <WpListTable
          listPath={listPath}
          listQuery={{ search: q.search || undefined, sort: q.sort, order: q.order, perPage: q.perPage }}
          page={data.page}
          perPage={data.perPage}
          total={data.total}
          toolbar={
            <WpListToolbar path={listPath} search={q.search} sort={q.sort} order={q.order} sortOptions={SORT_OPTIONS} />
          }
          columns={[
            {
              key: "client",
              label: "Client",
              render: (p) => (
                <strong>
                  <Link className="row-title" href={`/admin/portfolio/${p.id}`}>
                    {p.client_name || p.title}
                  </Link>
                </strong>
              ),
            },
            { key: "location", label: "Location", render: (p) => p.location || "—" },
            { key: "category", label: "Type", render: (p) => p.category || "—" },
            {
              key: "home",
              label: "Homepage",
              render: (p) => (p.show_on_homepage ? "Yes" : "—"),
            },
            { key: "status", label: "Status", render: (p) => p.status },
          ]}
          rows={data.items}
          rowActions={(p) => <WpRowActions editHref={`/admin/portfolio/${p.id}`} />}
          emptyMessage="No portfolio items yet. Add your first local client project."
        />
      </WpListScreen>
    </AdminShell>
  );
}
