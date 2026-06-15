import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/wp/admin',
  images: {
    unoptimized: true,
  }
};

export default nextConfig;
