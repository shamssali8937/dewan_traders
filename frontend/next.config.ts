import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // Serve modern formats — Next.js picks the best format per browser
    formats: ['image/avif', 'image/webp'],
    // 1-year browser cache for optimized images
    minimumCacheTTL: 31_536_000,
    // Responsive srcset breakpoints
    deviceSizes: [375, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [24, 48, 96, 128, 160, 200, 256, 384],
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }],
      },
      // Long cache for static images served from /public
      {
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

export default nextConfig;
