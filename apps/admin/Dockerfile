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
RUN pnpm turbo run build --filter=@usta/admin

# 3. Runner stage
FROM base AS runner
WORKDIR /app
COPY --from=builder /app/out/full/apps/admin/dist ./apps/admin/dist
COPY --from=builder /app/out/full/apps/admin/package.json ./apps/admin/package.json
# We also need the lockfile and node_modules to run pnpm preview
COPY --from=builder /app/out/full/node_modules ./node_modules
COPY --from=builder /app/out/full/apps/admin/node_modules ./apps/admin/node_modules

# Vite preview defaults to 4173
EXPOSE 4173

# We need to run preview from the admin directory
WORKDIR /app/apps/admin
CMD ["pnpm", "preview", "--host", "0.0.0.0"]
