import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizeFonts: false, // Disable font optimization
  },
  devIndicators: false,
};

export default nextConfig;
