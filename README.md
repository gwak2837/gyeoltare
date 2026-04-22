# gyeoltare

## Requires

- Node.js 24
  - Corepack enabled
- Bun 1
- Docker 29

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
- `packages/db`: Drizzle schema, client
- `test/api-integration`: HTTP-level integration tests backed by Testcontainers

## Runtime model

- `apps/web` runs on Node.js and serves HTML/UI only.
- `apps/api` runs on Bun and owns all mutations and reusable backend workflows.

## Deployment automation

- `.github/workflows/publish-images.yml` publishes `web` and `api` images to GHCR with SBOM, provenance, and cosign signatures.
- `stage` branch publish updates the `stg` image patches in `gwak2837/gyeoltare-ops` automatically so Argo CD can reconcile staging.
- `main` branch publish opens a PR in `gwak2837/gyeoltare-ops` that updates the `prod` image patches.
- cross-repo staging update and production PR creation both use a GitHub App installation token minted from repository variable `OPS_REPO_APP_CLIENT_ID` and secret `OPS_REPO_APP_PRIVATE_KEY`.
- tag publish keeps publishing release images to GHCR but does not change `gwak2837/gyeoltare-ops` automatically.
