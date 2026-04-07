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

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.use(
  '/api/auth/*',
  cors({
    origin: [
      'https://us-ta.ru',
      'https://*.us-ta.ru',
      'http://localhost:*',
      'http://localhost:5173',
    ],
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  }),
);

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
