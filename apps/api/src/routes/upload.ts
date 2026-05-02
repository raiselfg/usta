import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';

import { uploadFile } from '../lib/minio.js';

export const uploadRoutes = new OpenAPIHono();

const UploadSchema = z
  .object({
    file: z
      .file()
      .refine((f) => f.size <= 2 * 1024 * 1024, 'Максимальный размер файла 2MB')
      .refine(
        (f) =>
          [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/webp',
            'image/avif',
          ].includes(f.type),
        'Допустимы только JPEG, JPG, PNG, WebP, AVIF',
      ),
  })
  .openapi('UploadRequest');

uploadRoutes.openapi(
  createRoute({
    method: 'post',
    path: '/',
    request: {
      body: {
        content: {
          'multipart/form-data': {
            schema: UploadSchema,
          },
        },
      },
    },
    responses: {
      201: {
        content: {
          'application/json': {
            schema: z.object({ url: z.url() }).openapi('UploadResponse'),
          },
        },
        description: 'File uploaded successfully',
      },
      400: { description: 'Invalid input' },
      500: { description: 'Internal server error' },
    },
  }),
  async (c) => {
    const { file } = c.req.valid('form');

    try {
      const url = await uploadFile(file);
      return c.json({ url }, 201);
    } catch (err) {
      console.error('Upload error:', err);
      return c.json({ error: 'Failed to upload file' }, 500);
    }
  },
);
