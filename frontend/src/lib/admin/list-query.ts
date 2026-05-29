export type ListOrder = "asc" | "desc";

export type AdminListSearchParams = {
  page?: string;
  search?: string;
  sort?: string;
  order?: string;
  status?: string;
  perPage?: string;
};

export type ParsedListQuery = {
  page: number;
  perPage: number;
  search: string;
  sort: string;
  order: ListOrder;
};

export function parseListQuery(
  sp: AdminListSearchParams,
  defaults: { sort: string; order?: ListOrder; perPage?: number }
): ParsedListQuery {
  const defaultPerPage = defaults.perPage ?? 10;
  const perPage = Math.min(50, Math.max(5, parseInt(sp.perPage || String(defaultPerPage), 10) || defaultPerPage));

  return {
    page: Math.max(1, parseInt(sp.page || "1", 10) || 1),
    perPage,
    search: (sp.search ?? "").trim(),
    sort: sp.sort || defaults.sort,
    order: sp.order === "asc" ? "asc" : (defaults.order ?? "desc"),
  };
}

export type ListQueryRecord = {
  search?: string;
  sort?: string;
  order?: string;
  status?: string;
  key?: string;
};

/** Build query string for CMS list APIs and admin pagination links. */
export function buildListQueryString(
  q: ListQueryRecord & { page?: number; perPage?: number }
): string {
  const params = new URLSearchParams();
  if (q.page && q.page > 1) params.set("page", String(q.page));
  if (q.perPage) params.set("perPage", String(q.perPage));
  if (q.search) params.set("search", q.search);
  if (q.sort) params.set("sort", q.sort);
  if (q.order) params.set("order", q.order);
  if (q.status && q.status !== "all") params.set("status", q.status);
  if ("key" in q && q.key) params.set("key", q.key);
  const s = params.toString();
  return s ? `?${s}` : "";
}

export function adminListPath(path: string, q: ListQueryRecord & { page?: number; perPage?: number }): string {
  return `${path}${buildListQueryString(q)}`;
}

/** Query string for CMS `/…/list` API requests (no leading `?`). */
export function buildListApiQuery(
  q: ParsedListQuery & { status?: string }
): string {
  const params = new URLSearchParams();
  params.set("page", String(q.page));
  params.set("perPage", String(q.perPage));
  if (q.search) params.set("search", q.search);
  params.set("sort", q.sort);
  params.set("order", q.order);
  if (q.status && q.status !== "all") params.set("status", q.status);
  return params.toString();
}

export type SortOption = { value: string; label: string };

export const PAGE_SORT_OPTIONS: SortOption[] = [
  { value: "updated_at", label: "Updated date" },
  { value: "title", label: "Title" },
  { value: "slug", label: "Slug" },
  { value: "template", label: "Template" },
  { value: "status", label: "Status" },
];

export const BLOG_SORT_OPTIONS: SortOption[] = [
  { value: "published_date", label: "Published date" },
  { value: "updated_at", label: "Updated date" },
  { value: "title", label: "Title" },
  { value: "slug", label: "Slug" },
  { value: "status", label: "Status" },
];

export const SERVICE_SORT_OPTIONS: SortOption[] = [
  { value: "title", label: "Title" },
  { value: "slug", label: "Slug" },
  { value: "status", label: "Status" },
  { value: "updated_at", label: "Updated date" },
];

export const LANDING_SORT_OPTIONS: SortOption[] = [
  { value: "service_name", label: "Service name" },
  { value: "slug", label: "Slug" },
  { value: "status", label: "Status" },
  { value: "updated_at", label: "Updated date" },
];

export const HOMEPAGE_SECTION_SORT_OPTIONS: SortOption[] = [
  { value: "sort_order", label: "Order" },
  { value: "admin_title", label: "Admin title" },
  { value: "layout", label: "Layout" },
  { value: "status", label: "Status" },
  { value: "updated_at", label: "Updated date" },
];

export const FORM_SORT_OPTIONS: SortOption[] = [
  { value: "created_at", label: "Submitted date" },
  { value: "form_type", label: "Form type" },
  { value: "is_read", label: "Read status" },
];

export const SECTION_ITEM_SORT_OPTIONS: SortOption[] = [
  { value: "title", label: "Title" },
  { value: "status", label: "Status" },
];

export const MENU_SORT_OPTIONS: SortOption[] = [
  { value: "label", label: "Menu name" },
  { value: "key", label: "Key" },
  { value: "count", label: "Item count" },
];

export const MEDIA_SORT_OPTIONS: SortOption[] = [
  { value: "created_at", label: "Upload date" },
  { value: "title", label: "Title" },
  { value: "original_name", label: "Filename" },
  { value: "file_size", label: "File size" },
  { value: "media_type", label: "Type" },
];
