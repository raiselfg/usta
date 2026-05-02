import { randomUUID } from 'crypto';
import * as Minio from 'minio';
import path from 'path';

const minioClient = new Minio.Client({
  endPoint: 'cdn.us-ta.ru',
  port: 443,
  useSSL: true,
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
});

const BUCKET = process.env.MINIO_BUCKET_NAME!;
const FOLDER = 'products';
const ENDPOINT = process.env.MINIO_ENDPOINT!;

export async function uploadFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name);
  const fileName = `${randomUUID()}${ext}`;
  const objectName = `${FOLDER}/${fileName}`;

  await minioClient.putObject(BUCKET, objectName, buffer, buffer.length, {
    'Content-Type': file.type,
  });

  return `${ENDPOINT}/${BUCKET}/${objectName}`;
}
