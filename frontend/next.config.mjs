/** @type {import('next').NextConfig} */

function hostPatternsFromUrl(url) {
  if (!url?.trim()) return [];
  try {
    const u = new URL(url.trim());
    const protocol = u.protocol === "http:" ? "http" : "https";
    return [{ protocol, hostname: u.hostname }];
  } catch {
    return [];
  }
}

function mergeImagePatterns(patterns) {
  const seen = new Set();
  return patterns.filter((p) => {
    const key = `${p.protocol}://${p.hostname}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const envImageHosts = mergeImagePatterns([
  ...hostPatternsFromUrl(process.env.NEXT_PUBLIC_SITE_URL),
  ...hostPatternsFromUrl(process.env.NEXT_PUBLIC_CMS_PUBLIC_URL),
  ...hostPatternsFromUrl(process.env.CMS_API_URL),
]);

const nextConfig = {
  /** Next.js 16 defaults to Turbopack; explicit empty config replaces legacy webpack dev tweaks. */
  turbopack: {},
  images: {
    remotePatterns: mergeImagePatterns([
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "127.0.0.1" },
      ...envImageHosts,
    ]),
    unoptimized: process.env.NODE_ENV === "development",
  },
  async redirects() {
    return [
      { source: "/index", destination: "/", permanent: true },
      { source: "/index.php", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
