import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  clean: true,
  splitting: false,
  dts: false,
  noExternal: ['@usta/types', '@usta/database'],
  external: [
    '@hono/node-server',
    '@hono/swagger-ui',
    '@hono/zod-openapi',
    'hono',
    'better-auth',
    'minio',
    'pg',
    '@prisma/client',
    'dotenv',
    'hono-rate-limiter',
  ],
});
