import { prisma } from '@usta/database';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { betterAuth } from 'better-auth/minimal';

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  basePath: '/api/auth',
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    allowSignUp: false,
  },
  trustedOrigins: [
    'https://admin.us-ta.ru',
    'https://us-ta.ru',
    'https://cdn.us-ta.ru',
  ],
  rateLimit: {
    enabled: true,
    window: 10,
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
