import type { GmbReviewRecord } from "./types";

/** Creative Web Solutions — Google Maps / GMB listing */
export const CWS_GMB_MAPS_URL =
  "https://www.google.com/maps/place/Creative+Web+Solutions/@30.6389111,76.8206708,17z/data=!3m1!4b1!4m6!3m5!1s0x390feb7d52c85c33:0x5eae611680f7e6ea!8m2!3d30.6389111!4d76.8206708!16s%2Fg%2F11q7pgz80k";

export const CWS_GMB_PLACE_NAME = "Creative Web Solutions · Zirakpur";

export const DEFAULT_GMB_REVIEWS: GmbReviewRecord[] = [
  {
    id: "gmb-1",
    author: "Amit K.",
    rating: 5,
    text: "Website ekdum solid hai — fast load, clean design. Leads WhatsApp pe aa rahi hain regularly.",
    ago: "3 weeks ago",
    showOnHomepage: true,
  },
  {
    id: "gmb-2",
    author: "Priya Sharma",
    rating: 5,
    text: "SEO ke baad Google pe ranking better hai. Team Zirakpur se, seedhi baat, time pe kaam.",
    ago: "1 month ago",
    showOnHomepage: true,
  },
  {
    id: "gmb-3",
    author: "Vikram S.",
    rating: 5,
    text: "Ecommerce + payment gateway setup smooth tha. Content delay hua par delivery professional thi.",
    ago: "2 months ago",
    showOnHomepage: true,
  },
  {
    id: "gmb-4",
    author: "Neha R.",
    rating: 4,
    text: "Logo, social posts, website — sab ek hi jagah. Ab brand thoda premium lagta hai.",
    ago: "2 months ago",
    showOnHomepage: true,
  },
  {
    id: "gmb-5",
    author: "Rajesh T.",
    rating: 5,
    text: "Creative Web Solutions Zirakpur — local team jo samajh ke kaam karti hai. Small business ke liye best.",
    ago: "5 months ago",
    showOnHomepage: true,
  },
];

export const DEFAULT_GMB_RATING = 4.9;
export const DEFAULT_GMB_REVIEW_COUNT = "120+";
