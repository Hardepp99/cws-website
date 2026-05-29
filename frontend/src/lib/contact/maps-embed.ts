/** Build a Google Maps iframe embed URL from a public Maps place link (no API key). */
export function googleMapsEmbedUrl(mapsUrl: string, placeName?: string): string {
  const url = mapsUrl.trim();
  if (!url) {
    return fallbackEmbed(placeName);
  }
  if (url.includes("google.com/maps/embed")) {
    return url;
  }

  const coordMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (coordMatch) {
    const [, lat, lng] = coordMatch;
    return `https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=16&output=embed`;
  }

  const placeIdMatch = url.match(/!1s([^!]+)/);
  if (placeIdMatch?.[1]) {
    const q = encodeURIComponent(placeIdMatch[1]);
    return `https://maps.google.com/maps?q=${q}&hl=en&z=16&output=embed`;
  }

  return fallbackEmbed(placeName);
}

function fallbackEmbed(placeName?: string): string {
  const q = encodeURIComponent(placeName?.trim() || "Creative Web Solutions Zirakpur");
  return `https://maps.google.com/maps?q=${q}&hl=en&z=16&output=embed`;
}
