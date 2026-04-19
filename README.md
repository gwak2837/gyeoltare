# gyeoltare

Production-oriented monorepo for a Next.js web server, a Hono API, type-safe RPC clients, and Drizzle-backed PostgreSQL access.

## Requires

- Node.js 24
  - Corepack enabled
- Bun 1
- Docker

## Getting started

```bash
pnpm i
pnpm run db:prepare
pnpm run dev
```

## Workspace layout

- `apps/web`: Next.js App Router web server with Tailwind CSS
- `apps/api`: Hono application assembly and Bun runtime entrypoint
- `packages/api-client`: type-safe Hono RPC clients for browser and server callers
- `packages/db`: Drizzle schema, policies, and read models
- `test/api-integration`: HTTP-level integration tests backed by Testcontainers

## Runtime model

- `apps/web` runs on Node.js and serves HTML/UI only.
- `apps/api` runs on Bun and owns all mutations and reusable backend workflows.
- Next Server Components may read PostgreSQL through read-model helpers only.
- All writes, transactions, and side effects flow through Hono routes and services.
