# syntax=docker/dockerfile:1.10

# 1. 설치/빌드
FROM node:24-slim AS build

RUN corepack enable

ARG CI
ARG COMMIT_SHA

ENV CI=$CI
ENV NODE_ENV=production

WORKDIR /workspace

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.json biome.jsonc ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/auth/package.json packages/auth/package.json
COPY packages/api-client/package.json packages/api-client/package.json
COPY packages/db/package.json packages/db/package.json
COPY packages/typescript-config/package.json packages/typescript-config/package.json
COPY packages/util/package.json packages/util/package.json

RUN pnpm config set store-dir /pnpm/store

RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store pnpm install --frozen-lockfile

COPY . .

RUN COMMIT_SHA="$COMMIT_SHA" pnpm --filter @gyeoltare/web build

# 2. 실행
FROM node:24-alpine AS runner

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=build --chown=nextjs:nodejs /workspace/apps/web/public ./apps/web/public
COPY --from=build --chown=nextjs:nodejs /workspace/apps/web/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /workspace/apps/web/.next/static ./apps/web/.next/static

WORKDIR /app/apps/web

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
