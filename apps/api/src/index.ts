import process from 'node:process';
import 'dotenv/config';
import { serve } from '@hono/node-server';
import { OpenAPIHono } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';
import { productsRoutes } from './routes/products.js';
import { productTypesRoutes } from './routes/product-types.js';

const app = new OpenAPIHono();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

// Register routes
app.route('/products', productsRoutes);
app.route('/product-types', productTypesRoutes);

// OpenAPI documentation
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'USTA API',
  },
});

// Swagger UI
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
