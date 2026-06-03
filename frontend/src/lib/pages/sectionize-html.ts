import { formatCmsHtml } from "@/lib/format-cms-html";

export type ProContentBlock =
  | { type: "html"; html: string }
  | { type: "figure"; src: string; alt: string; caption?: string }
  | { type: "icon-list"; items: { text: string; iconClass: string }[] }
  | { type: "cards"; items: { title: string; html: string }[] };

export type ProContentSection = {
  id: string;
  title?: string;
  eyebrow?: string;
  blocks: ProContentBlock[];
  variant: "default" | "alt" | "highlight";
};

export type ProContentStructure = {
  version: 1;
  sectionCount: number;
  hasIntro: boolean;
  sections: ProContentSection[];
};

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function slugify(text: string, index: number): string {
  const base = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return base || `section-${index + 1}`;
}

function parseIconList(ulHtml: string): ProContentBlock | null {
  const items: { text: string; iconClass: string }[] = [];
  const liRe = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let m: RegExpExecArray | null;
  while ((m = liRe.exec(ulHtml))) {
    const inner = m[1].trim();
    const iconMatch = inner.match(/<i[^>]*class=["']([^"']+)["'][^>]*>/i);
    const text = stripTags(inner.replace(/<i[^>]*>[\s\S]*?<\/i>/gi, ""));
    if (text) {
      items.push({ text, iconClass: iconMatch?.[1] ?? "fas fa-check-circle" });
    }
  }
  return items.length ? { type: "icon-list", items } : null;
}

function parseBlocks(fragment: string): ProContentBlock[] {
  const blocks: ProContentBlock[] = [];
  let rest = fragment.trim();
  if (!rest) return blocks;

  const imgRe = /<figure[^>]*>[\s\S]*?<\/figure>|<img[^>]+>/gi;
  let imgMatch: RegExpExecArray | null;
  let lastIndex = 0;
  const imgParts: { index: number; html: string }[] = [];
  while ((imgMatch = imgRe.exec(rest))) {
    imgParts.push({ index: imgMatch.index, html: imgMatch[0] });
  }

  if (imgParts.length === 0) {
    const ulRe = /<ul[^>]*>[\s\S]*?<\/ul>/gi;
    const ulMatch = ulRe.exec(rest);
    if (ulMatch) {
      const before = rest.slice(0, ulMatch.index).trim();
      if (before) blocks.push({ type: "html", html: before });
      const list = parseIconList(ulMatch[0]);
      if (list) blocks.push(list);
      rest = rest.slice(ulMatch.index + ulMatch[0].length).trim();
    }
    if (rest) blocks.push({ type: "html", html: rest });
    return blocks;
  }

  for (const part of imgParts) {
    const before = rest.slice(lastIndex, part.index).trim();
    if (before) {
      const ulRe = /<ul[^>]*>[\s\S]*?<\/ul>/i;
      const ulM = ulRe.exec(before);
      if (ulM) {
        const pre = before.slice(0, ulM.index).trim();
        if (pre) blocks.push({ type: "html", html: pre });
        const list = parseIconList(ulM[0]);
        if (list) blocks.push(list);
        const post = before.slice(ulM.index + ulM[0].length).trim();
        if (post) blocks.push({ type: "html", html: post });
      } else {
        blocks.push({ type: "html", html: before });
      }
    }
    const srcMatch = part.html.match(/src=["']([^"']+)["']/i);
    const altMatch = part.html.match(/alt=["']([^"']*)["']/i);
    if (srcMatch) {
      blocks.push({
        type: "figure",
        src: srcMatch[1],
        alt: altMatch?.[1] ?? "",
      });
    }
    lastIndex = part.index + part.html.length;
  }
  const tail = rest.slice(lastIndex).trim();
  if (tail) blocks.push({ type: "html", html: tail });

  return blocks.length ? blocks : [{ type: "html", html: fragment }];
}

/** Split CMS HTML into intro + H2-based sections for pro template rendering. */
export function sectionizePageHtml(raw: string): ProContentStructure {
  const html = formatCmsHtml(raw);
  if (!html) {
    return { version: 1, sectionCount: 0, hasIntro: false, sections: [] };
  }

  const parts = html.split(/(?=<h2\b[^>]*>)/i);
  let introHtml = "";
  let chunks = parts;

  if (parts.length > 0 && !/^<h2\b/i.test(parts[0].trim())) {
    introHtml = parts[0].trim();
    chunks = parts.slice(1);
  }

  const sections: ProContentSection[] = [];
  chunks.forEach((chunk, index) => {
    const titleMatch = chunk.match(/^<h2[^>]*>([\s\S]*?)<\/h2>/i);
    const title = titleMatch ? stripTags(titleMatch[1]) : undefined;
    const body = titleMatch ? chunk.slice(titleMatch[0].length).trim() : chunk.trim();
    if (!title && !body) return;
    sections.push({
      id: slugify(title ?? "section", index),
      title,
      eyebrow: index === 0 ? "Overview" : undefined,
      blocks: parseBlocks(body),
      variant: index % 2 === 0 ? "default" : "alt",
    });
  });

  if (sections.length === 0 && introHtml) {
    sections.push({
      id: "content",
      title: undefined,
      blocks: parseBlocks(introHtml),
      variant: "default",
    });
    introHtml = "";
  } else if (introHtml) {
    sections.unshift({
      id: "intro",
      eyebrow: "Introduction",
      blocks: parseBlocks(introHtml),
      variant: "highlight",
    });
  }

  return {
    version: 1,
    sectionCount: sections.length,
    hasIntro: Boolean(introHtml) || sections.some((s) => s.id === "intro"),
    sections,
  };
}

export function parseStoredContentStructure(raw: unknown): ProContentStructure | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as ProContentStructure;
  if (o.version !== 1 || !Array.isArray(o.sections)) return null;
  return o;
}
