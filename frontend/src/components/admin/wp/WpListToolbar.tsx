import Link from "next/link";
import type { SortOption } from "@/lib/admin/list-query";

export function WpListToolbar({
  path,
  search = "",
  sort,
  order = "desc",
  sortOptions,
  hiddenParams = {},
  searchPlaceholder = "Search anything…",
}: {
  path: string;
  search?: string;
  sort: string;
  order?: "asc" | "desc";
  sortOptions: SortOption[];
  hiddenParams?: Record<string, string>;
  searchPlaceholder?: string;
}) {
  const hasFilters = Boolean(search || sort || order !== "desc" || Object.keys(hiddenParams).length);

  return (
    <form className="wp-list-toolbar" method="get" action={path}>
      {Object.entries(hiddenParams).map(([key, value]) =>
        value ? <input key={key} type="hidden" name={key} value={value} /> : null
      )}
      <div className="wp-list-toolbar__search">
        <label className="screen-reader-text" htmlFor="wp-list-search">
          Search
        </label>
        <input
          id="wp-list-search"
          type="search"
          name="search"
          className="cms-input wp-list-toolbar__input"
          defaultValue={search}
          placeholder={searchPlaceholder}
          autoComplete="off"
        />
      </div>
      <div className="wp-list-toolbar__sort">
        <label className="screen-reader-text" htmlFor="wp-list-sort">
          Sort by
        </label>
        <select id="wp-list-sort" name="sort" className="cms-select" defaultValue={sort}>
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <div className="wp-list-toolbar__order">
        <label className="screen-reader-text" htmlFor="wp-list-order">
          Order
        </label>
        <select id="wp-list-order" name="order" className="cms-select" defaultValue={order}>
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>
      <button type="submit" className="cms-btn cms-btn-green wp-list-toolbar__submit">
        Search
      </button>
      {hasFilters ? (
        <Link href={path} className="wp-list-toolbar__clear">
          Clear
        </Link>
      ) : null}
    </form>
  );
}
