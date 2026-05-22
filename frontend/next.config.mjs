/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev }) => {
    if (dev) {
      config.optimization = {
        ...config.optimization,
        moduleIds: "named",
      };
    }
    return config;
  },
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
