import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { WpListScreen, WpListTable, WpRowActions } from "@/components/admin/wp/WpListTable";
import { WpListToolbar } from "@/components/admin/wp/WpListToolbar";
import {
  MENU_SORT_OPTIONS,
  parseListQuery,
  type AdminListSearchParams,
} from "@/lib/admin/list-query";
import { cmsAdminFetch } from "@/lib/admin/server";

type MenuMeta = { key: string; label: string; count: number };

function filterSortMenus(rows: MenuMeta[], search: string, sort: string, order: "asc" | "desc"): MenuMeta[] {
  let out = [...rows];
  if (search) {
    const s = search.toLowerCase();
    out = out.filter(
      (r) =>
        r.label.toLowerCase().includes(s) ||
        r.key.toLowerCase().includes(s) ||
        String(r.count).includes(s)
    );
  }
  const dir = order === "asc" ? 1 : -1;
  out.sort((a, b) => {
    if (sort === "count") return (a.count - b.count) * dir;
    if (sort === "key") return a.key.localeCompare(b.key) * dir;
    return a.label.localeCompare(b.label) * dir;
  });
  return out;
}

export default async function AdminMenusListPage({
  searchParams,
}: {
  searchParams: AdminListSearchParams;
}) {
  const q = parseListQuery(searchParams, { sort: "label", order: "asc", perPage: 50 });
  const listPath = "/admin/menus";
  let rows: MenuMeta[] = [];
  let err = "";

  try {
    rows = await cmsAdminFetch<MenuMeta[]>("/menus/list");
  } catch (e) {
    err = String(e);
  }

  const filtered = filterSortMenus(rows, q.search, q.sort, q.order);

  return (
    <AdminShell title="Menus">
      {err ? <div className="cms-notice err">{err}</div> : null}
      <WpListScreen title="Menus" description="Edit navigation links for header and footer.">
        <WpListTable
          listPath={listPath}
          listQuery={{ search: q.search || undefined, sort: q.sort, order: q.order }}
          page={1}
          perPage={filtered.length || 1}
          total={filtered.length}
          toolbar={
            <WpListToolbar
              path={listPath}
              search={q.search}
              sort={q.sort}
              order={q.order}
              sortOptions={MENU_SORT_OPTIONS}
            />
          }
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
          rows={filtered.map((r) => ({ id: r.key, ...r }))}
          rowActions={(r) => <WpRowActions editHref={`/admin/menus/${r.key}`} />}
          emptyMessage={q.search ? "No menus match your search." : "No items found."}
        />
      </WpListScreen>
    </AdminShell>
  );
}
