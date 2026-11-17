import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
      ignoreBuildErrors: true
    },
  experimental: {
    agentUpgrade: "security",
  },
  images: {
      remotePatterns: [
          { hostname: 'img.clerk.com'}
      ]
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
