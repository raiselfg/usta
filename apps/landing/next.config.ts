import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    formats: ['image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.us-ta.ru',
      },
    ],
  },
  transpilePackages: ['@usta/ui', '@usta/api', '@usta/database'],
  output: 'standalone',
};

export default nextConfig;
