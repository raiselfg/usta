import { serve } from '@hono/node-server';
import 'dotenv/config';
import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { cors } from 'hono/cors';
import process from 'node:process';

import { auth } from './lib/auth.js';
import { productCategoriesRoutes } from './routes/product-categories.js';
import { productsRoutes } from './routes/products.js';

const app = new OpenAPIHono();

// 1. CORS применяется ко ВСЕМ роутам первым делом
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

// 2. Auth middleware
app.use('*', async (c, next) => {
  const path = c.req.path;

  // Точные совпадения
  const isPublicPath = ['/', '/doc', '/docs'].includes(path);

  // Совпадения по началу пути
  const isAuthRoute = path.startsWith('/api/auth');
  const isProductRoute =
    path.startsWith('/products') || path.startsWith('/product-categories');

  // Если это публичный путь, роут авторизации или роут продуктов - пропускаем без проверки
  if (isPublicPath || isAuthRoute || isProductRoute) {
    return next();
  }

  // Для всех остальных путей проверяем сессию
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  await next();
});

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.route('/products', productsRoutes);
app.route('/product-categories', productCategoriesRoutes);

app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'USTA API',
  },
});

app.get('/docs', swaggerUI({ url: '/doc' }));

app.on(['POST', 'GET'], '/api/auth/*', (c) => {
  return auth.handler(c.req.raw);
});

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
