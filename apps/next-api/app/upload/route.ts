import { NextResponse } from 'next/server';

import { ValidationError } from '@/lib/errors';
import { handle, requireAdmin } from '@/lib/handler';
import { uploadFile } from '@/lib/s3cloud';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

// POST /upload — только админ (multipart/form-data, поле "file")
export const POST = handle(async req => {
  await requireAdmin(req);

  const form = await req.formData();
  const file = form.get('file');

  if (!(file instanceof File)) {
    throw new ValidationError('Field "file" is required');
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new ValidationError('File size exceeds 2MB limit');
  }
  if (!ALLOWED_MIME.includes(file.type)) {
    throw new ValidationError(`Unsupported file type: ${file.type}`);
  }

  console.log('[Upload] Processing file:', {
    name: file.name,
    size: file.size,
    type: file.type,
  });

  const url = await uploadFile(file);
  return NextResponse.json({ url }, { status: 201 });
});
