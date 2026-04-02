# 1. Base stage
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.30.1 --activate

# 2. Builder stage
FROM base AS builder
WORKDIR /app
COPY . .
# Prune the workspace for the admin app
RUN npx turbo prune --scope=@usta/admin --docker

# Work inside the pruned workspace
WORKDIR /app/out/full
RUN pnpm install

# Build the admin app
# Note: Since this is a monorepo, we might need to build packages first if they are used
RUN pnpm turbo run build --filter=@usta/admin

# 3. Runner stage
FROM nginx:stable-alpine AS runner

# Copy the built site from the builder stage
COPY --from=builder /app/out/full/apps/admin/dist /usr/share/nginx/html

# Copy the custom nginx config for SPA routing
COPY apps/admin/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
