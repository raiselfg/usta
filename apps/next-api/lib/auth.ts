import { prisma } from '@usta/database';
import { betterAuth } from 'better-auth/minimal';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';

import { env } from './env';

function createAuth() {
  return betterAuth({
    appName: 'USTA',
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
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
    advanced: {
      useSecureCookies: env.NODE_ENV === 'production',
      cookiePrefix: 'usta_auth',
      // admin/landing/api — поддомены одного site (us-ta.ru), поэтому в проде
      // шарим cookie через Domain=.us-ta.ru и используем SameSite=Lax. Это
      // обычная first-party cookie: браузер не режёт её как стороннюю
      // (в отличие от SameSite=None) и шлёт на все поддомены.
      ...(env.NODE_ENV === 'production'
        ? {
            crossSubDomainCookies: {
              enabled: true,
              domain: '.us-ta.ru',
            },
            defaultCookieAttributes: {
              sameSite: 'lax',
              secure: true,
            },
          }
        : {
            // localhost тоже same-site между портами; на http нужен
            // SameSite=Lax без Secure, иначе браузер отклонит cookie.
            defaultCookieAttributes: {
              sameSite: 'lax',
            },
          }),
    },
    // Гарантирует, что Set-Cookie из better-auth попадают в ответ Next.js
    plugins: [nextCookies()],
  });
}

let _auth: ReturnType<typeof createAuth> | null = null;

// Ленивая инициализация: конструктор обращается к env, поэтому создаём
// инстанс при первом запросе, а не на этапе сборки (next build).
export function getAuth(): ReturnType<typeof createAuth> {
  if (!_auth) {
    _auth = createAuth();
  }
  return _auth;
}
