export type MediaItem = {
  id: number;
  originalName: string;
  mimeType: string;
  mediaType: "image" | "audio" | "video" | "document";
  fileSize: number;
  width: number | null;
  height: number | null;
  altText: string;
  title: string;
  caption: string;
  description: string;
  url: string;
  thumbUrl: string;
  largeUrl: string;
  originalUrl: string;
  createdAt: string;
};

export type MediaListResponse = {
  items: MediaItem[];
  total: number;
  page: number;
  perPage: number;
};

export const MEDIA_ACCEPT =
  "image/jpeg,image/png,image/gif,image/webp,audio/mpeg,audio/mp4,audio/wav,audio/ogg,video/mp4,video/webm,video/quicktime,application/pdf";

export const MEDIA_ACCEPT_LABEL =
  "Images (JPG, PNG, GIF, WebP), audio (MP3, M4A, WAV, OGG), video (MP4, WebM, MOV), PDF only";
