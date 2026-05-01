import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { randomUUID } from 'crypto';

import { uploadToMinio } from '../lib/minio.js';

export const uploadRoutes = new OpenAPIHono();

const UploadSchema = z
  .object({
    file: z.file(),
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
            schema: z
              .object({
                url: z.string().url(),
              })
              .openapi('UploadResponse'),
          },
        },
        description: 'File uploaded successfully',
      },
      400: {
        description: 'Invalid input',
      },
    },
  }),
  async (c) => {
    const { file } = c.req.valid('form');

    const ext = file.name.split('.').pop() ?? 'jpg';
    const fileName = `${randomUUID()}.${ext}`;
    const url = await uploadToMinio(file, fileName);

    return c.json({ url }, 201);
  },
);
