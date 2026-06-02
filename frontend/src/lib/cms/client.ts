function resolveBase(): string {
  const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (site) return `${site}/api/v1`;
  if (typeof window !== "undefined") {
    return `${window.location.origin}/api/v1`;
  }
  return "http://127.0.0.1:3000/api/v1";
}

export function getCmsApiBase(): string {
  return resolveBase();
}

export function cmsApiEnabled(): boolean {
  if (process.env.CWS_NODE_CMS === "0") return false;
  if (
    process.env.MYSQL_DATABASE?.trim() ||
    process.env.DB_NAME?.trim() ||
    process.env.MYSQL_HOST?.trim() ||
    process.env.DB_HOST?.trim()
  ) {
    return true;
  }
  // Server-side local/dev still uses DB defaults from db.ts (cws_cms on 127.0.0.1)
  if (typeof window === "undefined") return true;
  return false;
}

export async function cmsFetch<T>(path: string, init?: RequestInit): Promise<T | null> {
  const apiBase = resolveBase();
  const url = `${apiBase}${path.startsWith("/") ? path : `/${path}`}`;
  const apiPath = path.startsWith("/api/v1") ? path.slice("/api/v1".length) || "/" : path;

  if (typeof window === "undefined") {
    try {
      const { dispatchCms } = await import("@/server/dispatch-cms");
      const result = await dispatchCms({
        method: init?.method || "GET",
        path: apiPath.startsWith("/") ? apiPath : `/${apiPath}`,
        searchParams: new URL(url).searchParams,
        body:
          init?.body && typeof init.body === "string"
            ? (JSON.parse(init.body) as Record<string, unknown>)
            : undefined,
      });
      if (result.status >= 400) {
        if (result.status !== 404) {
          console.warn("[CMS API]", result.status, path);
        }
        return null;
      }
      return (result.data ?? null) as T | null;
    } catch (e) {
      console.warn("[CMS API]", path, e);
      return null;
    }
  }

  try {
    const res = await fetch(url, {
      ...init,
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers as Record<string, string>),
      },
    });
    if (!res.ok) {
      console.warn("[CMS API]", res.status, path);
      return null;
    }
    return (await res.json()) as T;
  } catch (e) {
    console.warn("[CMS API]", path, e);
    return null;
  }
}
