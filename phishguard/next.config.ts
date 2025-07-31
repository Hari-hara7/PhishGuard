import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // 👈 Required for static export (Chrome extension compatibility)
  trailingSlash: true, // 👈 Ensures exported URLs work properly
  typescript: {
    ignoreBuildErrors: true, // Optional: Ignores TS errors during build
  },
  eslint: {
    ignoreDuringBuilds: true, // Optional: Ignores lint errors during build
  },
};

export default nextConfig;
