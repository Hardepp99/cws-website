import { GraphQLClient } from "graphql-request";

const endpoint = process.env.WORDPRESS_GRAPHQL_URL || "";

export function getWpClient(): GraphQLClient | null {
  if (!endpoint) return null;
  return new GraphQLClient(endpoint, {
    headers: { "Content-Type": "application/json" },
    fetch: (url, init) => fetch(url, { ...init, cache: "no-store" }),
  });
}

export async function wpQuery<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T | null> {
  const client = getWpClient();
  if (!client) return null;
  try {
    return await client.request<T>(query, variables);
  } catch (e) {
    console.warn("[WP GraphQL]", e);
    return null;
  }
}

export function wpMediaUrl(path: string): string {
  if (path.startsWith("http")) return path;
  const base = process.env.NEXT_PUBLIC_SITE_URL || "";
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}
