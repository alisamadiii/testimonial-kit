import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    staleTimes: {
      dynamic: 60 * 5, // 5 minutes
      static: 60 * 5, // 5 minutes
    },
  },
};

export default nextConfig;
