/** Server-side CMS fetch for community (no member auth). */
export async function cmsFetch<T>(path: string): Promise<T | null> {
  const cms = process.env.CMS_API_URL?.replace(/\/$/, "");
  if (!cms) return null;
  try {
    const res = await fetch(`${cms}/api/v1${path}`, { next: { revalidate: 30 } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
