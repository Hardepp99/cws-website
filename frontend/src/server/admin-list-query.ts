import "server-only";

export type ListQuery = { search: string; sort: string; order: "asc" | "desc" };

export function listQueryFromSearchParams(sp: URLSearchParams): ListQuery {
  return {
    search: (sp.get("search") || "").trim(),
    sort: sp.get("sort") || "",
    order: sp.get("order")?.toLowerCase() === "asc" ? "asc" : "desc",
  };
}

export function orderSql(order: "asc" | "desc"): "ASC" | "DESC" {
  return order === "asc" ? "ASC" : "DESC";
}

export function sortColumn(sort: string, allowed: string[], fallback: string): string {
  return allowed.includes(sort) ? sort : fallback;
}

/** Appends LIKE placeholders for mysql2 `?` binding. */
export function searchWhere(columns: string[], search: string, values: unknown[]): string {
  if (!search) return "";
  const needle = `%${search}%`;
  const parts = columns.map((col) => {
    values.push(needle);
    return `${col} LIKE ?`;
  });
  return ` AND (${parts.join(" OR ")})`;
}
