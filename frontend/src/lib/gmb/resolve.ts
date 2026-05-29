import {
  CWS_GMB_MAPS_URL,
  CWS_GMB_PLACE_NAME,
  DEFAULT_GMB_RATING,
  DEFAULT_GMB_REVIEWS,
  DEFAULT_GMB_REVIEW_COUNT,
} from "./defaults";
import type { GmbConfig, GmbReviewRecord } from "./types";
import type { HomepageSection } from "@/lib/wordpress/types";
import type { SiteSettings } from "@/lib/wordpress/types";
import { filterPublishedItems } from "@/lib/homepage/item-status";

function newReviewId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `gmb-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function parseGmbReviewsJson(raw: string | undefined | null): GmbReviewRecord[] {
  if (!raw?.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item, i) => normalizeReviewRecord(item, i))
      .filter((r): r is GmbReviewRecord => Boolean(r));
  } catch {
    return [];
  }
}

function normalizeReviewRecord(item: unknown, index: number): GmbReviewRecord | null {
  if (!item || typeof item !== "object") return null;
  const o = item as Record<string, unknown>;
  const author = String(o.author ?? "").trim();
  const text = String(o.text ?? "").trim();
  if (!author || !text) return null;
  const id = String(o.id ?? "").trim() || `gmb-${index + 1}`;
  const rating = Math.min(5, Math.max(1, Number(o.rating) || 5));
  const showOnHomepage = o.showOnHomepage !== false && o.show_on_homepage !== false;
  return {
    id,
    author,
    text,
    rating,
    ago: o.ago ? String(o.ago) : undefined,
    showOnHomepage,
    status: o.status ? String(o.status) : undefined,
  };
}

/** Build GmbConfig from flat site settings payload */
export function gmbConfigFromSiteSettings(settings: Partial<SiteSettings> | null | undefined): GmbConfig {
  const parsed = parseGmbReviewsJson(settings?.gmbReviewsJson);
  const reviews = parsed.length ? parsed : DEFAULT_GMB_REVIEWS.map((r) => ({ ...r }));

  return {
    mapsUrl: (settings?.gmbMapsUrl ?? CWS_GMB_MAPS_URL).trim() || CWS_GMB_MAPS_URL,
    placeName: (settings?.gmbPlaceName ?? CWS_GMB_PLACE_NAME).trim() || CWS_GMB_PLACE_NAME,
    rating: Number(settings?.gmbRating) || DEFAULT_GMB_RATING,
    reviewCount: (settings?.gmbReviewCount ?? DEFAULT_GMB_REVIEW_COUNT).trim() || DEFAULT_GMB_REVIEW_COUNT,
    reviews,
  };
}

export function serializeGmbReviews(reviews: GmbReviewRecord[]): string {
  return JSON.stringify(reviews, null, 2);
}

export function createEmptyGmbReview(): GmbReviewRecord {
  return {
    id: newReviewId(),
    author: "",
    text: "",
    rating: 5,
    ago: "",
    showOnHomepage: true,
  };
}

type LegacySectionReview = {
  author?: string;
  text?: string;
  rating?: number;
  ago?: string;
  showOnHomepage?: boolean;
  status?: string;
};

/** Reviews shown in homepage hero — site settings win; section is fallback */
export function resolveHeroGmbReviews(
  siteGmb: GmbConfig,
  section?: HomepageSection | null
): GmbReviewRecord[] {
  const fromSite = filterPublishedItems(
    siteGmb.reviews.filter((r) => r.showOnHomepage !== false)
  ) as GmbReviewRecord[];

  if (fromSite.length) return fromSite;

  const sectionRaw = (section?.gmbReviews as LegacySectionReview[]) || [];
  const fromSection = filterPublishedItems(sectionRaw)
    .filter((r) => r.author && r.text)
    .map((r, i) => ({
      id: `section-${i}`,
      author: String(r.author),
      text: String(r.text),
      rating: Number(r.rating) || 5,
      ago: r.ago ? String(r.ago) : undefined,
      showOnHomepage: true,
    }));

  if (fromSection.length) return fromSection;

  return DEFAULT_GMB_REVIEWS.filter((r) => r.showOnHomepage !== false);
}

export function resolveHeroGmbRating(siteGmb: GmbConfig, section?: HomepageSection | null): number {
  if (siteGmb.rating > 0) return siteGmb.rating;
  const sectionRating = Number(section?.gmbRating);
  return sectionRating > 0 ? sectionRating : DEFAULT_GMB_RATING;
}

export function resolveHeroGmbCount(siteGmb: GmbConfig, section?: HomepageSection | null): string {
  if (siteGmb.reviewCount) return siteGmb.reviewCount;
  const sectionCount = String(section?.gmbReviewCount ?? "").trim();
  return sectionCount || DEFAULT_GMB_REVIEW_COUNT;
}
