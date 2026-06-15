/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/wp/admin',
  assetPrefix: '/wp/admin',
  images: {
    unoptimized: true,
  }
};

export default nextConfig;
