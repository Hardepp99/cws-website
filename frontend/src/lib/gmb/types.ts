export type GmbReviewRecord = {
  id: string;
  author: string;
  text: string;
  rating: number;
  ago?: string;
  /** When false, hidden from homepage hero carousel */
  showOnHomepage?: boolean;
  status?: string;
  source?: string;
};

export type GmbConfig = {
  mapsUrl: string;
  placeName: string;
  rating: number;
  reviewCount: string;
  reviews: GmbReviewRecord[];
};
