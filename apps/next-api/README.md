# @usta/next-api

Бэкенд USTA на Next.js (App Router, route handlers) — миграция с Hono
(`apps/api`). Полная функциональная замена: те же пути, CORS, авторизация и
логика.

## Маршруты

| Метод(ы)         | Путь                          | Доступ |
| ---------------- | ----------------------------- | ------ |
| `*`              | `/api/auth/*`                 | публ.  |
| `GET`            | `/storefront/landing`         | публ.  |
| `GET`            | `/products`                   | публ.  |
| `POST`           | `/products`                   | админ  |
| `GET`            | `/products/:id`               | публ.  |
| `PATCH` `DELETE` | `/products/:id`               | админ  |
| `GET`            | `/product-categories`         | публ.  |
| `POST`           | `/product-categories`         | админ  |
| `POST`           | `/product-categories/reorder` | админ  |
| `GET`            | `/product-categories/:id`     | публ.  |
| `PATCH` `DELETE` | `/product-categories/:id`     | админ  |
| `POST`           | `/upload`                     | админ  |
| `GET`            | `/health`                     | публ.  |

## Кросс-срезы

- **CORS + security headers + rate limit** — `middleware.ts` (перенос `cors()`,
  `secureHeaders()`, `hono-rate-limiter`).
- **Обработка ошибок + проверка прав** — `lib/handler.ts` (`handle()` = аналог
  `app.onError`, `requireAdmin()` = аналог `requireAdminAuth`).
- **Авторизация** — `lib/auth.ts` (better-auth + prisma), хендлер через
  `toNextJsHandler` в `app/api/auth/[...all]/route.ts`.

## Переменные окружения

См. `lib/env.ts`: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`,
`AWS_ENDPOINT`, `AWS_REGION`, `AWS_ACCESS_KEY`, `AWS_SECRET_KEY`, `AWS_BUCKET`,
`REVALIDATION_TOKEN`, `NODE_ENV`. Опционально: `NEXT_PUBLIC_URL` (revalidate).

## Запуск

```bash
pnpm --filter @usta/next-api dev    # порт 3000 (drop-in замена apps/api)
pnpm --filter @usta/next-api build
pnpm --filter @usta/next-api start
```

## Docker

`next.config.ts` использует `output: 'standalone'` с `outputFileTracingRoot`,
указывающим на корень монорепо, — сборка кладёт самодостаточный сервер в
`.next/standalone` (Prisma Client + engine, sharp, aws-sdk внутри; пакеты
`@usta/*` инлайнятся в серверные чанки).

`Dockerfile` (multi-stage, по образцу `apps/api`): `turbo prune` → install →
`turbo run build --filter=@usta/next-api...` (собирает и `@usta/database`,
`@usta/types`, генерирует Prisma Client) → копирование `.next/standalone` +
`.next/static` в минимальный runner на `node:22-alpine`.

```bash
# из корня монорепо
docker build -f apps/next-api/Dockerfile -t usta-next-api .
docker run --env-file apps/next-api/.env -p 3000:3000 usta-next-api
```

Prisma Client генерируется внутри контейнера, поэтому query-engine собирается
под Linux/musl независимо от ОС, где запускается сборка.
