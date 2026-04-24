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

## Deployment automation

- `stage` branch publish updates the `stg` image patches in `gwak2837/gyeoltare-ops` automatically so Argo CD can reconcile staging.
- `main` branch publish opens a PR in `gwak2837/gyeoltare-ops` that updates the `prod` image patches.
