import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  // Минимальный self-contained сервер для Docker
  output: 'standalone',
  // Трассировка зависимостей из корня монорепо (apps/* + packages/*)
  outputFileTracingRoot: path.join(__dirname, '../../'),
};

export default nextConfig;
