/** Image upload specs — aligned with CMS MediaService (images max 20 MB). */

export const IMAGE_UPLOAD_MAX_SIZE = "20 MB per file";
export const IMAGE_UPLOAD_FORMATS = "JPG, PNG, GIF, WebP";

export type ImageUploadGuide = {
  title?: string;
  ratio: string;
  recommended: string;
  minSize?: string;
  maxFileSize: string;
  formats: string;
  tips?: string;
};

export const IMAGE_UPLOAD_GUIDES = {
  default: {
    title: "Image guidelines",
    ratio: "Any landscape or square",
    recommended: "1200×800 px or larger",
    minSize: "600×400 px",
    maxFileSize: IMAGE_UPLOAD_MAX_SIZE,
    formats: IMAGE_UPLOAD_FORMATS,
    tips: "Use WebP or JPG for photos; PNG for logos or transparency.",
  },
  logo: {
    title: "Logo",
    ratio: "Wide or square (transparent PNG ideal)",
    recommended: "400×120 px (header) or 512×512 px (square mark)",
    minSize: "200×60 px",
    maxFileSize: IMAGE_UPLOAD_MAX_SIZE,
    formats: IMAGE_UPLOAD_FORMATS,
    tips: "PNG with transparent background works best on dark headers.",
  },
  heroSlide: {
    title: "Hero / banner slide",
    ratio: "16∶9 landscape",
    recommended: "1920×1080 px",
    minSize: "1280×720 px",
    maxFileSize: IMAGE_UPLOAD_MAX_SIZE,
    formats: IMAGE_UPLOAD_FORMATS,
    tips: "Keep text and faces away from edges; center important content.",
  },
  heroPerson: {
    title: "Hero person image",
    ratio: "3∶4 or 2∶3 portrait",
    recommended: "600×800 px",
    minSize: "400×533 px",
    maxFileSize: IMAGE_UPLOAD_MAX_SIZE,
    formats: IMAGE_UPLOAD_FORMATS,
    tips: "PNG cutout with transparent background looks best beside the slider.",
  },
  bannerDesktop: {
    title: "Banner — desktop",
    ratio: "21∶9 or 16∶9 wide",
    recommended: "1920×820 px",
    minSize: "1440×600 px",
    maxFileSize: IMAGE_UPLOAD_MAX_SIZE,
    formats: IMAGE_UPLOAD_FORMATS,
  },
  bannerTablet: {
    title: "Banner — tablet",
    ratio: "4∶3 or 3∶2",
    recommended: "1024×768 px",
    minSize: "768×576 px",
    maxFileSize: IMAGE_UPLOAD_MAX_SIZE,
    formats: IMAGE_UPLOAD_FORMATS,
  },
  bannerMobile: {
    title: "Banner — mobile",
    ratio: "4∶5 or 9∶16 portrait",
    recommended: "750×1334 px",
    minSize: "600×900 px",
    maxFileSize: IMAGE_UPLOAD_MAX_SIZE,
    formats: IMAGE_UPLOAD_FORMATS,
    tips: "Crop for narrow screens; avoid small text in the image.",
  },
  sectionBackdrop: {
    title: "Section backdrop",
    ratio: "16∶9 or wider",
    recommended: "1920×1080 px",
    minSize: "1280×720 px",
    maxFileSize: IMAGE_UPLOAD_MAX_SIZE,
    formats: IMAGE_UPLOAD_FORMATS,
    tips: "Soft, low-contrast photos work best behind text.",
  },
  portfolio: {
    title: "Portfolio thumbnail",
    ratio: "16∶10 or 4∶3",
    recommended: "1200×750 px",
    minSize: "800×500 px",
    maxFileSize: IMAGE_UPLOAD_MAX_SIZE,
    formats: IMAGE_UPLOAD_FORMATS,
    tips: "Shows in cards and carousel — sharp screenshot or mockup.",
  },
  blogFeatured: {
    title: "Blog featured image",
    ratio: "16∶9",
    recommended: "1200×675 px",
    minSize: "960×540 px",
    maxFileSize: IMAGE_UPLOAD_MAX_SIZE,
    formats: IMAGE_UPLOAD_FORMATS,
  },
  ogSocial: {
    title: "Social / Open Graph image",
    ratio: "1.91∶1 (Facebook & LinkedIn)",
    recommended: "1200×630 px",
    minSize: "600×315 px",
    maxFileSize: IMAGE_UPLOAD_MAX_SIZE,
    formats: IMAGE_UPLOAD_FORMATS,
    tips: "Used when the page is shared on social networks.",
  },
  serviceCard: {
    title: "Service card image",
    ratio: "1∶1 or 4∶3",
    recommended: "800×800 px",
    minSize: "400×400 px",
    maxFileSize: IMAGE_UPLOAD_MAX_SIZE,
    formats: IMAGE_UPLOAD_FORMATS,
  },
  aboutImage: {
    title: "About section image",
    ratio: "4∶3",
    recommended: "960×720 px",
    minSize: "640×480 px",
    maxFileSize: IMAGE_UPLOAD_MAX_SIZE,
    formats: IMAGE_UPLOAD_FORMATS,
  },
  avatar: {
    title: "Avatar / portrait",
    ratio: "1∶1 square",
    recommended: "400×400 px",
    minSize: "200×200 px",
    maxFileSize: IMAGE_UPLOAD_MAX_SIZE,
    formats: IMAGE_UPLOAD_FORMATS,
  },
  content: {
    title: "Content image",
    ratio: "Flexible (often 16∶9 or 4∶3)",
    recommended: "1200×800 px",
    minSize: "600×400 px",
    maxFileSize: IMAGE_UPLOAD_MAX_SIZE,
    formats: IMAGE_UPLOAD_FORMATS,
  },
} as const satisfies Record<string, ImageUploadGuide>;

export type ImageUploadGuideKey = keyof typeof IMAGE_UPLOAD_GUIDES;

export function getImageUploadGuide(key: ImageUploadGuideKey): ImageUploadGuide {
  return IMAGE_UPLOAD_GUIDES[key];
}

/** Pick a guide from field label when no explicit key is set. */
export function inferImageGuideKey(label: string): ImageUploadGuideKey {
  const l = label.toLowerCase();
  if (l.includes("logo")) return "logo";
  if (l.includes("open graph") || l.includes("og image") || l.includes("social")) return "ogSocial";
  if (l.includes("backdrop")) return "sectionBackdrop";
  if (l.includes("desktop") && (l.includes("background") || l.includes("banner"))) return "bannerDesktop";
  if (l.includes("tablet") && (l.includes("background") || l.includes("banner"))) return "bannerTablet";
  if (l.includes("mobile") && (l.includes("background") || l.includes("banner"))) return "bannerMobile";
  if (l.includes("person") && l.includes("image")) return "heroPerson";
  if (l.includes("slide")) return "heroSlide";
  if (l.includes("hero")) return "heroSlide";
  if (l.includes("portfolio")) return "portfolio";
  if (l.includes("featured")) return "blogFeatured";
  if (l.includes("avatar")) return "avatar";
  if (l.includes("about")) return "aboutImage";
  if (l.includes("card") && l.includes("image")) return "serviceCard";
  if (l === "image" || l.includes("gallery")) return "content";
  return "default";
}

export function resolveImageUploadGuide(
  key: ImageUploadGuideKey | undefined,
  label: string,
  mediaFilter: "all" | "image" | "audio" | "video" | "document",
): ImageUploadGuide | undefined {
  if (mediaFilter !== "image") return undefined;
  const resolvedKey = key ?? inferImageGuideKey(label);
  return getImageUploadGuide(resolvedKey);
}
