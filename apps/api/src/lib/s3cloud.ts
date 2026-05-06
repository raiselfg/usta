import {
  S3Client,
  PutObjectCommand,
  S3ServiceException,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import path from 'path';
import sharp from 'sharp';

import { ValidationError, StorageError } from './errors.js';

const ENDPOINT = process.env.AWS_ENDPOINT!;
const PUBLIC_ENDPOINT = process.env.AWS_PUBLIC_ENDPOINT!;
const REGION = process.env.AWS_REGION!;
const ACCESS_KEY = process.env.AWS_ACCESS_KEY!;
const SECRET_KEY = process.env.AWS_SECRET_KEY!;
const BUCKET = process.env.AWS_BUCKET!;

const MIME_TYPES: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  avif: 'image/avif',
};

const ALLOWED_EXTENSIONS = new Set(Object.keys(MIME_TYPES));
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const client = new S3Client({
  forcePathStyle: true,
  region: REGION,
  endpoint: ENDPOINT,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
});

export async function uploadFile(fileBody: File): Promise<string> {
  if (fileBody.size > MAX_FILE_SIZE) {
    throw new ValidationError(
      `File size exceeds 2MB limit: ${(fileBody.size / 1024 / 1024).toFixed(2)}MB`,
    );
  }

  const inputBuffer = Buffer.from(await fileBody.arrayBuffer());
  const fileName = `${randomUUID()}.avif`;

  const optimizedBuffer = await sharp(inputBuffer)
    .resize({
      width: 1280,
      height: 1280,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .avif({
      quality: 70,
      effort: 5,
    })
    .toBuffer();

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: fileName,
    Body: optimizedBuffer,
    ContentType: 'image/avif',
    ContentLength: optimizedBuffer.byteLength,
  });

  try {
    await client.send(command);
    return `${PUBLIC_ENDPOINT}/${BUCKET}/${fileName}`;
  } catch (error) {
    if (error instanceof S3ServiceException) {
      console.error(`S3 Error: ${error.name}`, {
        code: error.$metadata.httpStatusCode,
        msg: error.message,
      });
      throw new StorageError(`Storage failed: ${error.name}`);
    }

    console.error('Unexpected upload error:', error);
    throw new StorageError('Internal upload error');
  }
}

export async function deleteFile(fileUrl: string): Promise<void> {
  const fileName = fileUrl.split(`/${BUCKET}/`)[1];

  if (!fileName) {
    throw new ValidationError(`Invalid file URL: ${fileUrl}`);
  }

  const command = new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: fileName,
  });

  try {
    await client.send(command);
  } catch (error) {
    if (error instanceof S3ServiceException) {
      console.error(`S3 Error: ${error.name}`, {
        code: error.$metadata.httpStatusCode,
        msg: error.message,
      });
      throw new StorageError(`Storage failed: ${error.name}`);
    }

    console.error('Unexpected delete error:', error);
    throw new StorageError('Internal delete error');
  }
}
