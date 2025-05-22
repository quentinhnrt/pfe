import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "**.public.blob.vercel-storage.com",
        protocol: "https",
      },
      {
        hostname: "**.pixabay.com",
        protocol: "https",
      },
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
        pathname: "/gh/faker-js/assets-person-portrait/**",
      },
      {
        hostname: "picsum.photos",
        protocol: "https",
      },
      {
        hostname: "localhost",
        protocol: "http",
      },
      {
        protocol: "https",
        hostname: "**",
        pathname: "/api/user/**",
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  output: "standalone",
  reactStrictMode: false,
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
