# Base image
# Prisma 7 требует Node.js 20.19+, 22.12+ или 24.0+ — берём 22-alpine
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# libc6-compat нужен sharp/Prisma на alpine
RUN apk add --no-cache libc6-compat
RUN corepack enable

# 1. Prune step — оставляем только @usta/next-api и его зависимости
FROM base AS pruner
WORKDIR /app
COPY . .
RUN npx -y turbo@latest prune @usta/next-api --docker

# 2. Builder step
FROM base AS builder
WORKDIR /app

# Устанавливаем зависимости БЕЗ запуска скриптов
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile --ignore-scripts

# Полный исходный код (pruned)
COPY --from=pruner /app/out/full/ .

# Генерируем Prisma Client (нужен для сборки и для трассировки standalone)
RUN pnpm -C packages/database db:generate

# Собираем @usta/next-api вместе с зависимыми пакетами (database, types)
RUN pnpm turbo run build --filter=@usta/next-api...

# 3. Runner step
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Standalone-вывод Next.js уже содержит сервер, node_modules (включая
# сгенерированный Prisma Client и sharp) и workspace-пакеты.
COPY --from=builder --chown=nextjs:nodejs /app/apps/next-api/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/next-api/.next/static ./apps/next-api/.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "apps/next-api/server.js"]
