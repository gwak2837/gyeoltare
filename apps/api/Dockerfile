FROM node:24-bookworm-slim AS deps

RUN corepack enable
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.json biome.jsonc ./
COPY apps/api/package.json apps/api/package.json
COPY packages/contracts/package.json packages/contracts/package.json
COPY packages/db/package.json packages/db/package.json
COPY packages/typescript-config/package.json packages/typescript-config/package.json

RUN pnpm install --frozen-lockfile

COPY . .

FROM oven/bun:1.3-slim AS build

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001

COPY --from=deps /app ./

RUN bun build ./apps/api/src/main.ts --target bun --outfile ./apps/api/dist/main.js
RUN bun x tsc --project ./apps/api/tsconfig.types.json
RUN bun build --compile --minify --sourcemap ./apps/api/dist/main.js --outfile ./apps/api/dist/gyeoltare-api

FROM gcr.io/distroless/base-debian12:nonroot

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001

COPY --from=build /app/apps/api/dist/gyeoltare-api ./gyeoltare-api

EXPOSE 3001

ENTRYPOINT ["./gyeoltare-api"]
