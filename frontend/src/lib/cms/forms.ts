const cmsBase = process.env.CMS_API_URL?.replace(/\/$/, "") || "";

export async function postToCms(path: string, body: unknown): Promise<{ success: boolean; message: string } | null> {
  if (!cmsBase) return null;
  try {
    const res = await fetch(`${cmsBase}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return (await res.json()) as { success: boolean; message: string };
  } catch {
    return null;
  }
}
