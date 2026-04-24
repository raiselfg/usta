import { prisma } from '@usta/database';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { betterAuth } from 'better-auth/minimal';

export const auth = betterAuth({
  appName: 'USTA',
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  basePath: '/api/auth',
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 6,
    maxPasswordLength: 64,
    disableSignUp: true,
  },
  trustedOrigins: [
    'https://us-ta.ru',
    'https://admin.us-ta.ru',
    'https://cdn.us-ta.ru',
    'http://localhost:5173',
    'http://localhost:3001',
  ],
  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
  },
  session: {
    expiresIn: 604800, // 7 дней
    updateAge: 86400, // обновлять каждые 24 часа
    cookieCache: {
      enabled: true,
      maxAge: 300, // 5 минут кэша
    },
  },
});
