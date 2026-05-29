import "server-only";

import { cookies, headers } from "next/headers";

const CMS = process.env.CMS_API_URL?.replace(/\/$/, "") || "";

async function siteOrigin(): Promise<string> {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (env) return env;
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  const proto = h.get("x-forwarded-proto") || "http";
  return host ? `${proto}://${host}` : "http://127.0.0.1:3000";
}

export async function getAdminToken(): Promise<string | undefined> {
  return (await cookies()).get("cws_admin_token")?.value;
}

/** Server-side admin API — routes through Next proxy so auth cookie works on WAMP. */
export async function cmsAdminFetch<T>(
  path: string,
  init?: RequestInit & { json?: unknown },
): Promise<T> {
  const token = await getAdminToken();
  if (!token) {
    throw new Error("Not authenticated");
  }

  const url = `${await siteOrigin()}/api/admin/cms${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    ...init,
    method: init?.method || "GET",
    headers: {
      Cookie: `cws_admin_token=${token}`,
      ...(init?.json ? { "Content-Type": "application/json" } : {}),
      ...(init?.headers as Record<string, string>),
    },
    body: init?.json ? JSON.stringify(init.json) : init?.body,
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      (data as { message?: string }).message || (data as { error?: string }).error || "Request failed",
    );
  }
  return data as T;
}

export async function cmsAdminFetchDirect<T>(
  path: string,
  init?: RequestInit & { json?: unknown },
): Promise<T> {
  const token = await getAdminToken();
  if (!CMS || !token) {
    throw new Error("Not authenticated");
  }
  const res = await fetch(`${CMS}/api/v1/admin${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "X-CWS-Admin-Token": token,
      ...(init?.json ? { "Content-Type": "application/json" } : {}),
    },
    body: init?.json ? JSON.stringify(init.json) : init?.body,
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || "Request failed");
  }
  return data as T;
}

export function getCmsPublicUrl(): string {
  return CMS;
}
