import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "**.public.blob.vercel-storage.com",
                protocol: "https"
            }
        ]
    },
    output: 'standalone',
    reactStrictMode: false,
};

export default nextConfig;
