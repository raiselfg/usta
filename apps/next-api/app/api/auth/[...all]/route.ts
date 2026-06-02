import { toNextJsHandler } from 'better-auth/next-js';

import { getAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Перенос `app.all('/api/auth/*', ...)` из Hono. Хендлер создаётся лениво
// (на запрос), чтобы next build не требовал секретов.
export const GET = (req: Request) => toNextJsHandler(getAuth()).GET(req);
export const POST = (req: Request) => toNextJsHandler(getAuth()).POST(req);
