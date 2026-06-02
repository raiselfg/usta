import { NextRequest, NextResponse } from 'next/server';

import { env } from './env';
import { ApiError, UnauthorizedError } from './errors';
import { auth } from './auth';

type RouteContext = { params: Promise<Record<string, string>> };
type RouteHandler = (
  req: NextRequest,
  ctx: RouteContext,
) => Promise<Response> | Response;

/**
 * Оборачивает route-handler в единый обработчик ошибок — аналог
 * `app.onError` из Hono. Преобразует ApiError и ошибки валидации Zod
 * в корректные JSON-ответы.
 */
export function handle(fn: RouteHandler): RouteHandler {
  return async (req, ctx) => {
    try {
      return await fn(req, ctx);
    } catch (err) {
      if (err instanceof ApiError) {
        return NextResponse.json(
          { message: err.message, code: err.code },
          { status: err.status },
        );
      }

      // ZodError: проверяем по имени, чтобы не зависеть от конкретной
      // копии zod (схемы приходят из @usta/types).
      if (err instanceof Error && err.name === 'ZodError') {
        return NextResponse.json(
          {
            message: 'Validation error',
            code: 'VALIDATION_ERROR',
            issues: (err as unknown as { issues?: unknown }).issues,
          },
          { status: 400 },
        );
      }

      console.error('[Unhandled Error]', err);
      return NextResponse.json(
        {
          message: 'Internal Server Error',
          ...(env.NODE_ENV === 'development'
            ? { stack: (err as Error).stack }
            : {}),
        },
        { status: 500 },
      );
    }
  };
}

/**
 * Проверка прав доступа в админку — аналог `requireAdminAuth` из Hono.
 * Бросает UnauthorizedError, который перехватывается `handle`.
 */
export async function requireAdmin(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });

  if (!session) {
    console.warn(
      `[Auth] Unauthorized access attempt to ${req.method} ${req.nextUrl.pathname}`,
    );
    throw new UnauthorizedError(
      'Unauthorized: Требуется авторизация в админке',
    );
  }

  return session;
}
