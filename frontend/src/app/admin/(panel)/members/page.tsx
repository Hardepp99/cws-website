import Link from "next/link";
import { AdminRequireAdmin } from "@/components/admin/AdminRequireAdmin";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatusBadge } from "@/components/admin/community/StatusBadge";
import { WpListScreen, WpListTable, WpRowActions } from "@/components/admin/wp/WpListTable";
import { WpListToolbar } from "@/components/admin/wp/WpListToolbar";
import { WpStatusFilter } from "@/components/admin/wp/WpStatusFilter";
import { buildListApiQuery, parseListQuery, type AdminListSearchParams } from "@/lib/admin/list-query";
import { cmsAdminFetch } from "@/lib/admin/server";

type Row = {
  id: number;
  email: string;
  displayName: string;
  status: string;
  createdAt: string;
};

type ListResponse = { items: Row[]; total: number; page: number; perPage: number };

const LIST_PATH = "/admin/members";

export default async function AdminMembersPage({ searchParams }: { searchParams: AdminListSearchParams }) {
  const q = parseListQuery(searchParams, { sort: "id", order: "desc", perPage: 15 });
  const status = searchParams.status ?? "all";
  let data: ListResponse = { items: [], total: 0, page: 1, perPage: q.perPage };
  let err = "";

  try {
    const apiQ = new URLSearchParams(buildListApiQuery({ ...q, status }));
    data = await cmsAdminFetch<ListResponse>(`/members/list?${apiQ}`);
  } catch (e) {
    err = String(e);
  }

  return (
    <AdminShell title="Members">
      <AdminRequireAdmin>
        {err ? <div className="cms-notice err">{err}</div> : null}
        <WpListScreen title="Site members" description="Registered users — comments, forums, and member blog submissions.">
          <WpStatusFilter
            listPath={LIST_PATH}
            current={status}
            listQuery={{ search: q.search || undefined }}
            views={[
              { id: "all", label: "All" },
              { id: "active", label: "Active" },
              { id: "suspended", label: "Suspended" },
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
                  { value: "displayName", label: "Name" },
                ]}
                hiddenParams={{ status: status !== "all" ? status : "" }}
                searchPlaceholder="Search name or email…"
              />
            }
            columns={[
              {
                key: "name",
                label: "Name",
                render: (m) => (
                  <strong>
                    <Link className="row-title" href={`/admin/members/${m.id}`}>
                      {m.displayName}
                    </Link>
                  </strong>
                ),
              },
              { key: "email", label: "Email", render: (m) => m.email },
              { key: "status", label: "Status", render: (m) => <StatusBadge status={m.status} /> },
              { key: "joined", label: "Joined", render: (m) => m.createdAt },
            ]}
            rowActions={(m) => (
              <WpRowActions>
                <Link href={`/admin/members/${m.id}`} className="row-action-btn row-action-btn--edit">
                  Edit
                </Link>
              </WpRowActions>
            )}
          />
        </WpListScreen>
      </AdminRequireAdmin>
    </AdminShell>
  );
}
