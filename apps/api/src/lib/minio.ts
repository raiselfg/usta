import { Client } from 'minio';
import 'dotenv/config';

const endpoint = process.env.MINIO_ENDPOINT;

if (!endpoint) {
  console.warn(
    '[Minio] MINIO_ENDPOINT is not defined. Minio client will not be initialized correctly.',
  );
}

const url = endpoint ? new URL(endpoint) : null;

export const minioClient = new Client({
  endPoint: url?.hostname ?? 'localhost',
  port: url?.port ? parseInt(url.port) : url?.protocol === 'https:' ? 443 : 80,
  useSSL: url?.protocol === 'https:',
  accessKey: process.env.MINIO_ACCESS_KEY || '',
  secretKey: process.env.MINIO_SECRET_KEY || '',
  pathStyle: true,
});

const [bucketName, ...prefixParts] = (
  process.env.MINIO_BUCKET_NAME ?? ''
).split('/');

export const minioBucket = bucketName;
export const minioPrefix = prefixParts.length ? prefixParts.join('/') : '';

export async function uploadToMinio(
  file: File,
  fileName: string,
): Promise<string> {
  const objectName = minioPrefix ? `${minioPrefix}/${fileName}` : fileName;
  const buffer = Buffer.from(await file.arrayBuffer());

  await minioClient.putObject(minioBucket, objectName, buffer, buffer.length, {
    'Content-Type': file.type,
  });

  const base = (process.env.MINIO_ENDPOINT ?? '').replace(/\/$/, '');
  return `${base}/${minioBucket}/${objectName}`;
}
