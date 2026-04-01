import process from 'node:process';
import 'dotenv/config';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { productsRoutes } from './routes/products.js';
import { productTypesRoutes } from './routes/product-types.js';

const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.route('/products', productsRoutes);
app.route('/product-types', productTypesRoutes);

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
