# gyeoltare

## Requires

- Node.js 24
  - Corepack enabled
- Bun 1
- Docker 29

## Getting started

```bash
pnpm i
pnpm db:prepare
pnpm dev
```

## Workspace layout

- `apps/web`: Next.js App Router web server with Tailwind CSS
- `apps/api`: Hono application assembly and Bun runtime entrypoint
- `packages/api-client`: type-safe Hono RPC clients for browser and server callers
- `packages/db`: Drizzle schema, client
- `test/api-integration`: HTTP-level integration tests backed by Testcontainers

## Runtime model

- `apps/web` runs on Node.js and serves HTML/UI only.
- `apps/api` runs on Bun and owns all mutations and reusable backend workflows.
