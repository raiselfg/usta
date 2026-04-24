import type { Context, Next } from 'hono';

import 'dotenv/config';
import { serve } from '@hono/node-server';
import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { rateLimiter } from 'hono-rate-limiter';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import process from 'node:process';

import { auth } from './lib/auth.js';
import { productCategoriesRoutes } from './routes/product-categories.js';
import { productsRoutes } from './routes/products.js';
import { storefrontRoutes } from './routes/storefront.js';

const app = new OpenAPIHono();

// Базовые заголовки безопасности (защита от XSS и сниффинга)
app.use('*', secureHeaders());

// CORS
app.use(
  '*',
  cors({
    origin: [
      'https://us-ta.ru',
      'https://admin.us-ta.ru',
      'https://cdn.us-ta.ru',
      'http://localhost:5173',
      'http://localhost:3001',
    ],
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  }),
);

// 3. Rate Limiter
const limiter = rateLimiter({
  windowMs: 10 * 60 * 1000, // Окно: 10 минут
  limit: 200, // Максимум 200 запросов за 10 минут с одного IP
  standardHeaders: 'draft-6',
  keyGenerator: (c) => c.req.header('x-forwarded-for') || 'anonymous',
  handler: (c) =>
    c.json({ message: 'Слишком много запросов, подождите немного' }, 429),
});
app.use('*', limiter);

app.all('/api/auth/*', (c) => {
  return auth.handler(c.req.raw);
});

// 5. Middleware защиты (Проверка прав доступа)
// Лендинг читает данные (GET) свободно. Админка (POST/PATCH/DELETE) обязана иметь сессию.
const requireAuth = async (c: Context, next: Next) => {
  if (c.req.method === 'GET') {
    return await next();
  }

  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    console.error(
      `[Auth] Unauthorized access attempt to ${c.req.method} ${c.req.url}`,
    );
    return c.json(
      { message: 'Unauthorized: Требуется авторизация в админке' },
      401,
    );
  }

  return await next();
};

// Применяем защиту к роутам продуктов и категорий
app.use('/products', requireAuth);
app.use('/products/*', requireAuth);
app.use('/product-categories', requireAuth);
app.use('/product-categories/*', requireAuth);

app.route('/products', productsRoutes);
app.route('/product-categories', productCategoriesRoutes);
app.route('/storefront', storefrontRoutes);

// Документация Swagger API
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'USTA API',
  },
});
app.get('/docs', swaggerUI({ url: '/doc' }));

serve(
  {
    fetch: app.fetch,
    port: Number(process.env.PORT) || 3000,
    hostname: '0.0.0.0',
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
