import Link from "next/link";

export function WpPagination({
  basePath,
  page,
  perPage,
  total,
}: {
  basePath: string;
  page: number;
  perPage: number;
  total: number;
}) {
  const pages = Math.max(1, Math.ceil(total / perPage));
  if (pages <= 1) return null;

  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);

  function href(p: number) {
    const [path, qs] = basePath.split("?");
    if (p <= 1) return path;
    const params = new URLSearchParams(qs || "");
    params.set("page", String(p));
    return `${path}?${params.toString()}`;
  }

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
