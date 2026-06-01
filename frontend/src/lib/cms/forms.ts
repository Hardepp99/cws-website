import { getSiteUrl } from "@/lib/site-url";

async function cmsOrigin(): Promise<string> {
  const site = getSiteUrl();
  if (site) return site.replace(/\/$/, "");
  return "http://127.0.0.1:3000";
}

export async function postToCms(
  path: string,
  body: unknown,
): Promise<{ success: boolean; message: string } | null> {
  try {
    const base = await cmsOrigin();
    const res = await fetch(`${base}/api/v1${path.startsWith("/") ? path : `/${path}`}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return (await res.json()) as { success: boolean; message: string };
  } catch {
    return null;
  }
}
