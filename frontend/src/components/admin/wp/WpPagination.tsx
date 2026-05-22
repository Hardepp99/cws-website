import Link from "next/link";
import { adminListPath, type ListQueryRecord } from "@/lib/admin/list-query";

export function WpPagination({
  basePath,
  listPath,
  listQuery,
  page,
  perPage,
  total,
}: {
  /** Full path with query (legacy) */
  basePath?: string;
  /** Clean path e.g. /admin/blog */
  listPath?: string;
  /** Query params to preserve (search, sort, order, status) */
  listQuery?: ListQueryRecord & { perPage?: number };
  page: number;
  perPage: number;
  total: number;
}) {
  const pages = Math.max(1, Math.ceil(total / perPage));
  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);

  function href(p: number) {
    if (listPath) {
      return adminListPath(listPath, {
        ...listQuery,
        page: p > 1 ? p : undefined,
        perPage: listQuery?.perPage ?? perPage,
      });
    }
    const path = basePath || listPath || "/";
    const [clean, qs] = path.split("?");
    if (p <= 1 && !qs) return clean;
    const params = new URLSearchParams(qs || "");
    if (p > 1) params.set("page", String(p));
    else params.delete("page");
    const s = params.toString();
    return s ? `${clean}?${s}` : clean;
  }

  if (pages <= 1 && total === 0) return null;

  return (
    <div className="wp-tablenav bottom">
      <div className="tablenav-pages">
        <span className="displaying-num">
          {total} item{total === 1 ? "" : "s"}
        </span>
        <span className="pagination-links">
          {page > 1 ? (
            <>
              <Link className="first-page button" href={href(1)}>
                «
              </Link>
              <Link className="prev-page button" href={href(page - 1)}>
                ‹
              </Link>
            </>
          ) : (
            <>
              <span className="tablenav-pages-navspan button disabled">«</span>
              <span className="tablenav-pages-navspan button disabled">‹</span>
            </>
          )}
          <span className="paging-input">
            <span className="tablenav-paging-text">
              {from}–{to} of <span className="total-pages">{total}</span>
            </span>
          </span>
          {page < pages ? (
            <>
              <Link className="next-page button" href={href(page + 1)}>
                ›
              </Link>
              <Link className="last-page button" href={href(pages)}>
                »
              </Link>
            </>
          ) : (
            <>
              <span className="tablenav-pages-navspan button disabled">›</span>
              <span className="tablenav-pages-navspan button disabled">»</span>
            </>
          )}
        </span>
      </div>
    </div>
  );
}
