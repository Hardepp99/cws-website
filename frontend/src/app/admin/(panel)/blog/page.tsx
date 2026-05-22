import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { WpListScreen, WpListTable, WpRowActions } from "@/components/admin/wp/WpListTable";
import { WpListToolbar } from "@/components/admin/wp/WpListToolbar";
import {
  BLOG_SORT_OPTIONS,
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
  published_date: string;
};

type ListResponse = {
  items: Row[];
  total: number;
  page: number;
  perPage: number;
};

export default async function AdminBlogListPage({
  searchParams,
}: {
  searchParams: AdminListSearchParams;
}) {
  const q = parseListQuery(searchParams, { sort: "published_date", order: "desc", perPage: 10 });
  const listPath = "/admin/blog";
  let data: ListResponse = { items: [], total: 0, page: 1, perPage: q.perPage };
  let err = "";

  try {
    data = await cmsAdminFetch<ListResponse>(`/blog/list?${buildListApiQuery(q)}`);
  } catch (e) {
    err = String(e);
  }

  return (
    <AdminShell title="Blog">
      {err ? <div className="cms-notice err">{err}</div> : null}
      <WpListScreen
        title="Blog posts"
        description="Posts shown in blog preview sections and /blog pages."
        addNewHref="/admin/blog/new"
        addNewLabel="Add New Post"
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
              sortOptions={BLOG_SORT_OPTIONS}
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
            { key: "slug", label: "Slug", render: (p) => <code>/blog/{p.slug}</code> },
            { key: "date", label: "Published", render: (p) => p.published_date },
            { key: "status", label: "Status", render: (p) => p.status },
          ]}
          rows={data.items}
          rowActions={(p) => <WpRowActions editHref={`/admin/blog/${p.id}`} />}
          emptyMessage={q.search ? "No posts match your search." : "No items found."}
        />
      </WpListScreen>
    </AdminShell>
  );
}
