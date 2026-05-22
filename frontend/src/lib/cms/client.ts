const base = process.env.CMS_API_URL?.replace(/\/$/, "") || "";

export function getCmsApiBase(): string {
  return base;
}

export function cmsApiEnabled(): boolean {
  return Boolean(base);
}

export async function cmsFetch<T>(path: string, init?: RequestInit): Promise<T | null> {
  if (!base) return null;
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;
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
