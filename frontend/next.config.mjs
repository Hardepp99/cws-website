/** @type {import('next').NextConfig} */
const nextConfig = {
  /** Next.js 16 defaults to Turbopack; explicit empty config replaces legacy webpack dev tweaks. */
  turbopack: {},
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.cwsindia.online" },
      { protocol: "https", hostname: "cwsindia.online" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "http", hostname: "localhost" },
    ],
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
