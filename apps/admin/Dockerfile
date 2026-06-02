# 1. Base stage
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.30.1 --activate
RUN apt-get update -y && apt-get install -y openssl

# 2. Builder stage
FROM base AS builder
WORKDIR /app
COPY . .
# Prune the workspace for the admin app
RUN npx turbo prune @usta/admin --docker

# Work inside the pruned workspace
WORKDIR /app/out/full
RUN pnpm install

# Vite инлайнит VITE_* на этапе сборки — пробрасываем через build-arg
ARG VITE_BETTER_AUTH_BASE_URL
ENV VITE_BETTER_AUTH_BASE_URL=$VITE_BETTER_AUTH_BASE_URL

# Build the admin app
RUN pnpm turbo run build --filter=@usta/admin

# 3. Runner stage
FROM base AS runner
WORKDIR /app/apps/admin/dist
COPY --from=builder /app/out/full/apps/admin/dist .

# Use serve for simple and robust SPA hosting
RUN pnpm install -g serve

# Standard port for serve
EXPOSE 3000

# Serve the current folder in SPA mode (-s)
CMD ["serve", "-s", ".", "-l", "3000"]
