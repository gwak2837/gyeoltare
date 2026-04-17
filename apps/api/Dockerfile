FROM node:24-bookworm-slim AS deps

RUN corepack enable
WORKDIR /app

COPY package.json pnpm-workspace.yaml turbo.json tsconfig.json biome.jsonc ./
COPY apps/api/package.json apps/api/package.json
COPY packages/api/package.json packages/api/package.json
COPY packages/api-client/package.json packages/api-client/package.json
COPY packages/contracts/package.json packages/contracts/package.json
COPY packages/db/package.json packages/db/package.json
COPY packages/typescript-config/package.json packages/typescript-config/package.json
COPY packages/ui/package.json packages/ui/package.json

RUN pnpm install

COPY . .

FROM oven/bun:1.2.15-slim AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001

COPY --from=deps /app ./

EXPOSE 3001

WORKDIR /app/apps/api

CMD ["bun", "./src/main.ts"]
