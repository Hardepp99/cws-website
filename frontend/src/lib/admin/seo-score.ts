import type { AdminSeoData } from "./seo-types";

export type SeoCheck = { id: string; label: string; ok: boolean; hint?: string };

export function analyzeSeo(seo: AdminSeoData, contentHtml = ""): { score: number; checks: SeoCheck[] } {
  const kw = seo.focusKeyword.trim().toLowerCase();
  const title = seo.title.trim();
  const desc = seo.description.trim();
  const plain = contentHtml.replace(/<[^>]+>/g, " ").toLowerCase();

  const checks: SeoCheck[] = [
    {
      id: "title",
      label: "SEO title length (30–60 chars)",
      ok: title.length >= 30 && title.length <= 60,
      hint: `${title.length} characters`,
    },
    {
      id: "desc",
      label: "Meta description length (120–160 chars)",
      ok: desc.length >= 120 && desc.length <= 160,
      hint: `${desc.length} characters`,
    },
    {
      id: "kw-title",
      label: "Focus keyword in SEO title",
      ok: !kw || title.toLowerCase().includes(kw),
    },
    {
      id: "kw-desc",
      label: "Focus keyword in meta description",
      ok: !kw || desc.toLowerCase().includes(kw),
    },
    {
      id: "kw-body",
      label: "Focus keyword in content",
      ok: !kw || plain.includes(kw),
    },
    {
      id: "canonical",
      label: "Canonical URL set (recommended)",
      ok: !!seo.canonical.trim(),
    },
    {
      id: "og",
      label: "Social share image (OG)",
      ok: !!seo.ogImage.trim(),
    },
  ];

  const score = Math.round((checks.filter((c) => c.ok).length / checks.length) * 100);
  return { score, checks };
}
