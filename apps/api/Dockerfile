# 1. 설치
FROM node:24-bookworm-slim AS deps

RUN corepack enable

ENV NODE_ENV=production

WORKDIR /workspace

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.json biome.jsonc ./
COPY apps/api/package.json apps/api/package.json
COPY packages/db/package.json packages/db/package.json
COPY packages/typescript-config/package.json packages/typescript-config/package.json

RUN pnpm install --frozen-lockfile

COPY . .

# 2. 빌드
FROM oven/bun:1.3-slim AS build

WORKDIR /workspace

ENV NODE_ENV=production

COPY --from=deps /workspace ./

RUN mkdir -p /out

RUN bun build --compile \
  --minify \
  --sourcemap \
  ./apps/api/src/main.ts \
  --outfile /out/gyeoltare-api

# 3. 실행
FROM gcr.io/distroless/base-debian12:nonroot

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

COPY --from=build /out/gyeoltare-api /app/gyeoltare-api

EXPOSE 3001

ENTRYPOINT ["/app/gyeoltare-api"]
