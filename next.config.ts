import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: [
    "preview-chat-8411f3ee-f1d5-4ffc-9c59-b17411b4b759.space-z.ai",
    "space-z.ai",
  ],
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
