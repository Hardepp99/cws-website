import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { WpListScreen, WpListTable, WpRowActions } from "@/components/admin/wp/WpListTable";
import { cmsAdminFetch } from "@/lib/admin/server";

type MenuMeta = { key: string; label: string; count: number };

export default async function AdminMenusListPage() {
  let rows: MenuMeta[] = [];
  let err = "";

  try {
    rows = await cmsAdminFetch<MenuMeta[]>("/menus/list");
  } catch (e) {
    err = String(e);
  }

  return (
    <AdminShell title="Menus">
      {err ? <div className="cms-notice err">{err}</div> : null}
      <WpListScreen title="Menus" description="Edit navigation links for header and footer.">
        <WpListTable
          basePath="/admin/menus"
          page={1}
          perPage={rows.length || 1}
          total={rows.length}
          columns={[
            {
              key: "label",
              label: "Menu",
              render: (r) => (
                <strong>
                  <Link className="row-title" href={`/admin/menus/${r.key}`}>
                    {r.label}
                  </Link>
                </strong>
              ),
            },
            {
              key: "count",
              label: "Items",
              render: (r) => `${r.count} link${r.count === 1 ? "" : "s"}`,
            },
          ]}
          rows={rows.map((r) => ({ id: r.key, ...r }))}
          rowActions={(r) => <WpRowActions editHref={`/admin/menus/${r.key}`} />}
        />
      </WpListScreen>
    </AdminShell>
  );
}
