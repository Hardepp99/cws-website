import { AdminShell } from "@/components/admin/AdminShell";
import { WpListScreen, WpListTable } from "@/components/admin/wp/WpListTable";
import { WpListToolbar } from "@/components/admin/wp/WpListToolbar";
import {
  FORM_SORT_OPTIONS,
  buildListApiQuery,
  parseListQuery,
  type AdminListSearchParams,
} from "@/lib/admin/list-query";
import { cmsAdminFetch } from "@/lib/admin/server";

type Row = {
  id: number;
  form_type: string;
  payload: string;
  is_read: number;
  created_at: string;
};

type ListResponse = {
  items: Row[];
  total: number;
  page: number;
  perPage: number;
};

function previewPayload(raw: string): string {
  try {
    const o = JSON.parse(raw) as Record<string, unknown>;
    const name = o.name || o.fullName || o.email;
    return name ? String(name) : raw.slice(0, 80);
  } catch {
    return raw.slice(0, 80);
  }
}

export default async function AdminFormsPage({
  searchParams,
}: {
  searchParams: AdminListSearchParams;
}) {
  const q = parseListQuery(searchParams, { sort: "created_at", order: "desc", perPage: 20 });
  const listPath = "/admin/forms";
  let data: ListResponse = { items: [], total: 0, page: 1, perPage: q.perPage };
  let err = "";

  try {
    data = await cmsAdminFetch<ListResponse>(`/forms/list?${buildListApiQuery(q)}`);
  } catch (e) {
    err = String(e);
  }

  return (
    <AdminShell title="Form submissions">
      {err ? <div className="cms-notice err">{err}</div> : null}
      <WpListScreen title="Form submissions" description="Contact, lead, and enrollment form entries.">
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
              sortOptions={FORM_SORT_OPTIONS}
              searchPlaceholder="Search name, email, type, or any field…"
            />
          }
          columns={[
            {
              key: "date",
              label: "Date",
              render: (f) => <span className="date">{f.created_at}</span>,
            },
            { key: "type", label: "Type", render: (f) => f.form_type },
            {
              key: "summary",
              label: "Summary",
              render: (f) => <span>{previewPayload(f.payload)}</span>,
            },
            {
              key: "data",
              label: "Data",
              render: (f) => (
                <details>
                  <summary>View</summary>
                  <pre className="wp-form-payload">{f.payload}</pre>
                </details>
              ),
            },
          ]}
          rows={data.items}
          showActions={false}
          emptyMessage={q.search ? "No submissions match your search." : "No items found."}
        />
      </WpListScreen>
    </AdminShell>
  );
}
