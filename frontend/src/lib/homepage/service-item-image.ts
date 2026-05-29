/** Resolve service grid item image URL from CMS/admin JSON shapes. */
export function resolveServiceItemImage(item: {
  image?: string | { url?: string };
  imageUrl?: string;
}): string {
  const img = item.image;
  if (typeof img === "string" && img.trim()) return img.trim();
  if (img && typeof img === "object" && typeof img.url === "string" && img.url.trim()) {
    return img.url.trim();
  }
  if (typeof item.imageUrl === "string" && item.imageUrl.trim()) return item.imageUrl.trim();
  return "";
}
