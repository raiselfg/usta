import { Client } from 'minio';
import 'dotenv/config';

const endpoint = process.env.MINIO_ENDPOINT!;
// Strip protocol for the MinIO client (it handles https via useSSL)
const url = new URL(endpoint);

export const minioClient = new Client({
  endPoint: url.hostname,
  port: url.port ? parseInt(url.port) : url.protocol === 'https:' ? 443 : 80,
  useSSL: url.protocol === 'https:',
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
  pathStyle: true,
});

// MINIO_BUCKET_NAME may contain a prefix like "usta-s3/products"
const [bucketName, ...prefixParts] = (
  process.env.MINIO_BUCKET_NAME ?? ''
).split('/');

export const minioBucket = bucketName;
export const minioPrefix = prefixParts.length ? prefixParts.join('/') : '';

/**
 * Uploads a file buffer to MinIO and returns the public URL.
 */
export async function uploadToMinio(
  file: File,
  fileName: string,
): Promise<string> {
  const objectName = minioPrefix ? `${minioPrefix}/${fileName}` : fileName;
  const buffer = Buffer.from(await file.arrayBuffer());

  await minioClient.putObject(minioBucket, objectName, buffer, buffer.length, {
    'Content-Type': file.type,
  });

  // Construct public URL in path-style: endpoint/bucket/prefix/filename
  const base = process.env.MINIO_ENDPOINT!.replace(/\/$/, '');
  return `${base}/${minioBucket}/${objectName}`;
}
