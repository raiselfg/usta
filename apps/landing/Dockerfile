# Base image
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# 1. Prune step
FROM base AS pruner
RUN npm install -g turbo
WORKDIR /app
COPY . .
RUN turbo prune @usta/landing --docker

# 2. Installer step
FROM base AS builder
WORKDIR /app

# Копируем только json-файлы и лок-файл для кэширования зависимостей
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Устанавливаем зависимости БЕЗ запуска скриптов (так как схемы Prisma еще нет)
RUN pnpm install --frozen-lockfile --ignore-scripts

# Теперь копируем полный исходный код
COPY --from=pruner /app/out/full/ .

# Генерируем клиент Prisma и собираем проект
# Турбо сам запустит db:generate перед билдом благодаря настройкам в turbo.json
RUN pnpm turbo run build --filter=@usta/landing...

# 3. Runner step
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder /app/apps/landing/public ./apps/landing/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/landing/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/landing/.next/static ./apps/landing/.next/static

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/landing/server.js"]
