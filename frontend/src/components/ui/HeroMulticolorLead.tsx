import type { ReactNode } from "react";

type HighlightRule = {
  phrase: string;
  className: string;
};

/** Longest phrases first — avoids partial overlaps (e.g. "mobile" before "mobile apps"). */
const HERO_LEAD_HIGHLIGHTS: HighlightRule[] = [
  { phrase: "digital marketing", className: "home-hero__word--orange" },
  { phrase: "mobile apps", className: "home-hero__word--purple" },
  { phrase: "real enquiries", className: "home-hero__word--mint" },
  { phrase: "websites", className: "home-hero__word--blue" },
  { phrase: "visitors", className: "home-hero__word--cyan" },
];

type TextMatch = {
  start: number;
  end: number;
  className: string;
};

function findHighlights(text: string): TextMatch[] {
  const matches: TextMatch[] = [];
  const lower = text.toLowerCase();

  for (const rule of HERO_LEAD_HIGHLIGHTS) {
    const phraseLower = rule.phrase.toLowerCase();
    let searchFrom = 0;

    while (searchFrom < text.length) {
      const idx = lower.indexOf(phraseLower, searchFrom);
      if (idx === -1) break;

      const end = idx + rule.phrase.length;
      const overlaps = matches.some((m) => idx < m.end && end > m.start);
      if (!overlaps) {
        matches.push({ start: idx, end, className: rule.className });
      }
      searchFrom = idx + phraseLower.length;
    }
  }

  return matches.sort((a, b) => a.start - b.start);
}

function buildSegments(text: string): ReactNode[] {
  const matches = findHighlights(text);
  if (!matches.length) return [text];

  const nodes: ReactNode[] = [];
  let cursor = 0;

  for (const match of matches) {
    if (match.start < cursor) continue;
    if (match.start > cursor) {
      nodes.push(text.slice(cursor, match.start));
    }
    nodes.push(
      <span key={`${match.start}-${match.className}`} className={match.className}>
        {text.slice(match.start, match.end)}
      </span>,
    );
    cursor = match.end;
  }

  if (cursor < text.length) {
    nodes.push(text.slice(cursor));
  }

  return nodes;
}

export function HeroMulticolorLead({ text }: { text: string }) {
  return <>{buildSegments(text)}</>;
}
