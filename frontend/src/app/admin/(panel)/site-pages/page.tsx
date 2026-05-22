import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { WpListScreen, WpListTable, WpRowActions } from "@/components/admin/wp/WpListTable";
import { WpListToolbar } from "@/components/admin/wp/WpListToolbar";
import {
  buildListApiQuery,
  PAGE_SORT_OPTIONS,
  parseListQuery,
  type AdminListSearchParams,
} from "@/lib/admin/list-query";
import { cmsAdminFetch } from "@/lib/admin/server";

type PageRow = {
  id: number;
  slug: string;
  title: string;
  template: string;
  status: string;
  updated_at: string;
};

type ListResponse = {
  items: PageRow[];
  total: number;
  page: number;
  perPage: number;
};

export default async function AdminPagesListPage({
  searchParams,
}: {
  searchParams: AdminListSearchParams;
}) {
  const q = parseListQuery(searchParams, { sort: "updated_at", order: "desc", perPage: 10 });
  const listPath = "/admin/site-pages";
  let data: ListResponse = { items: [], total: 0, page: 1, perPage: q.perPage };
  let err = "";

  try {
    data = await cmsAdminFetch<ListResponse>(`/pages/list?${buildListApiQuery(q)}`);
  } catch (e) {
    err = String(e);
  }

  return (
    <AdminShell title="Pages">
      {err ? <div className="cms-notice err">{err}</div> : null}
      <WpListScreen
        title="Pages"
        description="Edit static pages (About, Contact, Services, etc.). Homepage sections are managed separately."
        addNewHref="/admin/site-pages/new"
        addNewLabel="Add New Page"
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
              sortOptions={PAGE_SORT_OPTIONS}
            />
          }
          columns={[
            {
              key: "title",
              label: "Title",
              render: (p) => (
                <strong>
                  <Link className="row-title" href={`/admin/site-pages/${p.id}`}>
                    {p.title}
                  </Link>
                </strong>
              ),
            },
            {
              key: "slug",
              label: "Slug",
              render: (p) => <code>/{p.slug}</code>,
            },
            {
              key: "template",
              label: "Template",
              render: (p) => p.template,
            },
            {
              key: "updated",
              label: "Updated",
              render: (p) => <span className="date">{p.updated_at?.slice(0, 10)}</span>,
            },
          ]}
          rows={data.items}
          rowActions={(p) => (
            <WpRowActions
              editHref={`/admin/site-pages/${p.id}`}
              desimentorHref={`/admin/desimentor/page/${p.id}`}
            />
          )}
          emptyMessage={q.search ? "No pages match your search." : "No items found."}
        />
      </WpListScreen>
      <p className="wp-list-desc" style={{ marginTop: 12 }}>
        <Link href="/admin/homepage">Edit homepage sections →</Link>
      </p>
    </AdminShell>
  );
}
