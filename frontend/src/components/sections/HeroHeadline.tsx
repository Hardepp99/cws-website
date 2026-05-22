export type HeroHeadlineTone = "white" | "blue" | "royal" | "green" | "orange" | "slate";

export interface HeroHeadlinePart {
  text: string;
  tone?: HeroHeadlineTone;
}

export const DEFAULT_HERO_HEADLINE_PARTS: HeroHeadlinePart[] = [
  { text: "Digital", tone: "blue" },
  { text: "solutions", tone: "green" },
  { text: "that help your", tone: "white" },
  { text: "business", tone: "orange" },
  { text: "scale", tone: "slate" },
];

export function resolveHeroHeadlineParts(
  headlineParts: unknown,
  headline?: string
): HeroHeadlinePart[] {
  const parts = headlineParts as HeroHeadlinePart[] | undefined;
  if (parts?.length) return parts;

  if (headline === "Digital solutions that help your business scale") {
    return DEFAULT_HERO_HEADLINE_PARTS;
  }

  if (!headline?.trim()) {
    return DEFAULT_HERO_HEADLINE_PARTS;
  }

  const words = headline.trim().split(/\s+/);
  if (words.length <= 1) {
    return [{ text: headline, tone: "white" }];
  }

  const tones: HeroHeadlineTone[] = ["blue", "green", "white", "orange", "slate"];
  return words.map((word, index) => ({
    text: word,
    tone: tones[index % tones.length],
  }));
}

interface HeroHeadlineProps {
  parts: HeroHeadlinePart[];
  className?: string;
}

export function HeroHeadline({ parts, className = "hero-pro-title" }: HeroHeadlineProps) {
  return (
    <h1 className={className}>
      {parts.map((part, index) => (
        <span key={`${part.text}-${index}`}>
          {index > 0 ? " " : null}
          <span
            className={
              part.tone
                ? `hero-pro-title-word hero-pro-title-word--${part.tone}`
                : "hero-pro-title-word hero-pro-title-word--white"
            }
          >
            {part.text}
          </span>
        </span>
      ))}
    </h1>
  );
}
