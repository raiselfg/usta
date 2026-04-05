import process from 'node:process';
import 'dotenv/config';
import { serve } from '@hono/node-server';
import { OpenAPIHono } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';
import { productsRoutes } from './routes/products.js';
import { productCategoriesRoutes } from './routes/product-categories.js';
import { auth } from './lib/auth.js';
import { cors } from 'hono/cors';

const app = new OpenAPIHono();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.use(
  '/api/auth/*',
  cors({
    origin: [
      'https://admin.us-ta.ru',
      'https://us-ta.ru',
      'https://cdn.us-ta.ru',
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
