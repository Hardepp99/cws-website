import { cmsFetch as fetchCms } from "@/lib/cms/client";

/** Server-side CMS fetch for community pages. */
export async function cmsFetch<T>(path: string): Promise<T | null> {
  return fetchCms<T>(`/api/v1${path.startsWith("/") ? path : `/${path}`}`);
}
