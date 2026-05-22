import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { layoutLabel } from "@/components/admin/homepage/layouts";
import { DeleteRowButton } from "@/components/admin/wp/DeleteRowButton";
import { RestoreRowButton } from "@/components/admin/wp/RestoreRowButton";
import { WpListScreen, WpListTable, WpRowActions } from "@/components/admin/wp/WpListTable";
import { WpStatusViews } from "@/components/admin/wp/WpStatusViews";
import { cmsAdminFetch } from "@/lib/admin/server";

type SectionRow = {
  id: number;
  sortOrder: number;
  layout: string;
  title: string;
  status: string;
  updated_at: string;
};

type ListResponse = {
  pageId?: number;
  items: SectionRow[];
  total: number;
  page: number;
  perPage: number;
  status: string;
  counts: { all: number; published: number; draft: number; trash: number };
};

function statusBadge(status: string) {
  const cls =
    status === "published" ? "status-published" : status === "draft" ? "status-draft" : "status-trash";
  return <span className={`status-badge ${cls}`}>{status}</span>;
}

export default async function AdminHomepageListPage({
  searchParams,
}: {
  searchParams: { page?: string; status?: string };
}) {
  const page = Math.max(1, parseInt(searchParams.page || "1", 10) || 1);
  const statusFilter = searchParams.status || "all";
  const perPage = 10;
  let data: ListResponse = {
    items: [],
    total: 0,
    page: 1,
    perPage,
    status: statusFilter,
    counts: { all: 0, published: 0, draft: 0, trash: 0 },
  };
  let err = "";

  try {
    const qs = new URLSearchParams({ page: String(page), perPage: String(perPage), status: statusFilter });
    data = await cmsAdminFetch<ListResponse>(`/homepage/sections/list?${qs}`);
  } catch (e) {
    err = String(e);
  }

  const basePath = `/admin/homepage${statusFilter !== "all" ? `?status=${statusFilter}` : ""}`;

  return (
    <AdminShell title="Homepage">
      {err ? <div className="cms-notice err">{err}</div> : null}
      <WpListScreen
        title="Homepage sections"
        description="Published sections appear on the live homepage. Drafts stay in admin only. Use Desimentor for extra layout blocks (hybrid with sections)."
        addNewHref="/admin/homepage/new"
        addNewLabel="Add New Section"
        desimentor={data.pageId ? { entityType: "homepage", entityId: data.pageId } : undefined}
        headerActions={
          <Link href="/admin/desimentor/templates" className="page-title-action page-title-action-secondary">
            Templates
          </Link>
        }
      >
        <WpStatusViews basePath="/admin/homepage" current={statusFilter} counts={data.counts} />
        <WpListTable
          basePath={basePath}
          page={data.page}
          perPage={data.perPage}
          total={data.total}
          columns={[
            {
              key: "order",
              label: "Order",
              className: "column-order num",
              render: (r) => <span>{statusFilter === "trash" ? "—" : r.sortOrder + 1}</span>,
            },
            {
              key: "title",
              label: "Title",
              render: (r) => (
                <strong>
                  <Link className="row-title" href={`/admin/homepage/${r.id}/edit`}>
                    {r.title || "(no title)"}
                  </Link>
                </strong>
              ),
            },
            {
              key: "layout",
              label: "Layout",
              render: (r) => <span className="layout-tag">{layoutLabel(r.layout)}</span>,
            },
            {
              key: "status",
              label: "Status",
              render: (r) => statusBadge(r.status),
            },
            {
              key: "updated",
              label: "Updated",
              render: (r) => <span className="date">{r.updated_at?.slice(0, 10) || "—"}</span>,
            },
          ]}
          rows={data.items}
          rowActions={(r) =>
            r.status === "trash" ? (
              <WpRowActions
                editHref={`/admin/homepage/${r.id}/edit`}
                deleteAction={
                  <>
                    <RestoreRowButton
                      apiPath={`/homepage/sections/${r.id}/restore`}
                      redirectTo="/admin/homepage?status=draft"
                      status="draft"
                    />
                    <DeleteRowButton
                      apiPath={`/homepage/sections/${r.id}?permanent=1`}
                      redirectTo="/admin/homepage?status=trash"
                      label="Delete permanently"
                      confirmMessage="Delete this section permanently? This cannot be undone."
                    />
                  </>
                }
              />
            ) : (
              <WpRowActions
                editHref={`/admin/homepage/${r.id}/edit`}
                deleteAction={
                  <DeleteRowButton
                    apiPath={`/homepage/sections/${r.id}`}
                    redirectTo={`/admin/homepage${statusFilter !== "all" ? `?status=${statusFilter}` : ""}`}
                    label="Trash"
                    confirmMessage="Move this section to trash?"
                  />
                }
              />
            )
          }
        />
        {statusFilter === "trash" && data.items.length > 0 ? (
          <p className="wp-list-desc" style={{ marginTop: 8 }}>
            Restore from the edit screen, or use Trash view actions. Trashed sections are hidden on the live site.
          </p>
        ) : null}
      </WpListScreen>
    </AdminShell>
  );
}
