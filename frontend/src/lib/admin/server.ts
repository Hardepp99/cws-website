import "server-only";

import { cookies, headers } from "next/headers";
import { getSiteUrl } from "@/lib/site-url";

async function siteOrigin(): Promise<string> {
  const env = getSiteUrl();
  if (env) return env;
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  const proto = h.get("x-forwarded-proto") || (host?.includes("localhost") ? "http" : "https");
  return host ? `${proto}://${host}` : "http://localhost:3000";
}

export async function getAdminToken(): Promise<string | undefined> {
  return (await cookies()).get("cws_admin_token")?.value;
}

/** Server-side admin API via Next.js `/api/admin/cms` proxy. */
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

export async function getCmsPublicUrl(): Promise<string> {
  return `${(await siteOrigin()).replace(/\/$/, "")}/api/v1`;
}
