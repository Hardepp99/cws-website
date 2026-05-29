import type { GmbConfig } from "./types";
import type { GmbReviewRecord } from "./types";

export type GmbApiPayload = {
  mapsUrl: string;
  placeName: string;
  rating: number;
  reviewCount: string;
  reviews: Array<{
    id: string;
    author: string;
    text: string;
    rating: number;
    ago?: string;
  }>;
  cachedAt?: string;
  live?: boolean;
};

export function gmbConfigFromApiPayload(payload: GmbApiPayload | null | undefined): GmbConfig | null {
  if (!payload?.reviews?.length) {
    return null;
  }

  const reviews: GmbReviewRecord[] = payload.reviews.map((r) => ({
    id: r.id,
    author: r.author,
    text: r.text,
    rating: r.rating,
    ago: r.ago,
    showOnHomepage: true,
  }));

  return {
    mapsUrl: payload.mapsUrl,
    placeName: payload.placeName,
    rating: payload.rating,
    reviewCount: payload.reviewCount,
    reviews,
  };
}
