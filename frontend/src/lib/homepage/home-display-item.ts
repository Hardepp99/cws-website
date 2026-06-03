export type HomeDisplayItem = {
  title?: string;
  desc?: string;
  description?: string;
  icon?: string;
  href?: string;
  letter?: string;
  tone?: string;
  number?: string;
  image?: string | { url?: string };
  status?: string;
};

export function itemDescription(item: HomeDisplayItem): string {
  return (item.desc || item.description || "").trim();
}
