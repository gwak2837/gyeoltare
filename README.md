# gyeoltare

Production-oriented monorepo for a Next.js web server, a Hono API, type-safe RPC clients, and Drizzle-backed PostgreSQL access.

## Requires

- Node.js 24
  - Corepack enabled
- Bun 1
- PostgreSQL 18
- Docker

## Workspace layout

- `apps/web`: Next.js App Router web server with Tailwind CSS
- `apps/api`: Hono application assembly and Bun runtime entrypoint
- `packages/api-client`: type-safe Hono RPC clients for browser and server callers
- `packages/db`: Drizzle schema, policies, and read models
- `test/api-integration`: HTTP-level integration tests backed by Testcontainers

## Testing

- `bun test`: 빠른 단위 테스트만 실행합니다. `bunfig.toml`에서 `test/api-integration`은 기본 스캔 대상에서 제외합니다.
- `pnpm run test:api:integration`: Bun 프로세스로 실제 API 서버를 띄우고, Postgres 18 Testcontainer와 `drizzle-kit push` 기반으로 black-box 통합 테스트를 실행합니다.
- `pnpm run test:all`: 단위 테스트 뒤에 API 통합 테스트까지 연달아 실행합니다.
- API 통합 테스트는 Docker daemon 접근이 필요합니다.

## Runtime model

- `apps/web` runs on Node.js and serves HTML/UI only.
- `apps/api` runs on Bun and owns all mutations and reusable backend workflows.
- Next Server Components may read PostgreSQL through read-model helpers only.
- All writes, transactions, and side effects flow through Hono routes and services.
