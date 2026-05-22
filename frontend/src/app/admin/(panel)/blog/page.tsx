import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { WpListScreen, WpListTable, WpRowActions } from "@/components/admin/wp/WpListTable";
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
  searchParams: { page?: string };
}) {
  const page = Math.max(1, parseInt(searchParams.page || "1", 10) || 1);
  const perPage = 10;
  let data: ListResponse = { items: [], total: 0, page: 1, perPage };
  let err = "";

  try {
    data = await cmsAdminFetch<ListResponse>(`/blog/list?page=${page}&perPage=${perPage}`);
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
          basePath="/admin/blog"
          page={data.page}
          perPage={data.perPage}
          total={data.total}
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
        />
      </WpListScreen>
    </AdminShell>
  );
}
