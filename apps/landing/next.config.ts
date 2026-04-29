import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.us-ta.ru',
      },
    ],
  },
  transpilePackages: ['@usta/ui', '@usta/types'],
  output: 'standalone',
};

export default nextConfig;
