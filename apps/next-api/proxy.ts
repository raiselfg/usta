import { NextRequest, NextResponse } from 'next/server';

// 2. CORS (перенос конфигурации из Hono `cors()`)
const ALLOWED_ORIGINS = [
  'https://us-ta.ru',
  'https://admin.us-ta.ru',
  'https://cdn.us-ta.ru',
  'http://localhost:5173',
  'http://localhost:3001',
];
const ALLOW_METHODS = 'POST, GET, OPTIONS, PUT, PATCH, DELETE';
const ALLOW_HEADERS = 'Content-Type, Authorization';
const EXPOSE_HEADERS = 'Content-Length';
const MAX_AGE = '600';

// 3. Rate limiter (перенос `hono-rate-limiter`)
// In-memory fixed-window. Подходит для деплоя в одном процессе (next start).
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 200;
const hits = new Map<string, { count: number; reset: number }>();

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || entry.reset < now) {
    hits.set(key, { count: 1, reset: now + WINDOW_MS });
    return true;
  }

  entry.count += 1;
  return entry.count <= LIMIT;
}

function applyCors(res: NextResponse, origin: string | null): NextResponse {
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.headers.set('Access-Control-Allow-Origin', origin);
    res.headers.set('Access-Control-Allow-Credentials', 'true');
    res.headers.append('Vary', 'Origin');
  }
  res.headers.set('Access-Control-Allow-Methods', ALLOW_METHODS);
  res.headers.set('Access-Control-Allow-Headers', ALLOW_HEADERS);
  res.headers.set('Access-Control-Expose-Headers', EXPOSE_HEADERS);
  res.headers.set('Access-Control-Max-Age', MAX_AGE);
  return res;
}

function applySecureHeaders(res: NextResponse): NextResponse {
  // 1. Security headers (аналог hono `secureHeaders()`)
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'SAMEORIGIN');
  res.headers.set('X-DNS-Prefetch-Control', 'off');
  res.headers.set('Referrer-Policy', 'no-referrer');
  res.headers.set('X-Download-Options', 'noopen');
  res.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
  return res;
}

export function proxy(req: NextRequest) {
  const origin = req.headers.get('origin');

  // CORS preflight
  if (req.method === 'OPTIONS') {
    return applyCors(new NextResponse(null, { status: 204 }), origin);
  }

  // Rate limit
  const key = req.headers.get('x-forwarded-for') || 'anonymous';
  if (!checkRateLimit(key)) {
    return applyCors(
      NextResponse.json(
        { message: 'Слишком много запросов, подождите немного' },
        { status: 429 },
      ),
      origin,
    );
  }

  return applySecureHeaders(applyCors(NextResponse.next(), origin));
}

export const config = {
  // Применяем ко всем маршрутам, кроме внутренних ассетов Next.js
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
