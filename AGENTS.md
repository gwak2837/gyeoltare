# AGENTS.md

## Scope

- 이 파일은 `gyeoltare/gyeoltare`와 그 하위 디렉터리에 적용된다.

## Collaboration

- 도중에 결정이 필요하거나 애매한 부분이나 맥락을 모르거나 궁금한 점이 있으면 먼저 질문한다.
- 이 repo의 아키텍처 기본값을 바꾸는 변경은 사용자 확인 없이 진행하지 않는다.
- 구조 변경 전에는 관련 문서를 먼저 읽고, 문서와 충돌하면 먼저 질문한다.

## Architecture Defaults

- workspace package scope는 전부 `@gyeoltare/*`를 사용한다.
- runtime은 `web=Node.js`, `api=Bun`이다.
- 배포는 same-domain을 전제로 한다.
- `/* -> Next`, `/api/* -> Hono`
- `GET /health -> Next`
- `GET /api/live -> Hono`
- `GET /api/ready -> Hono`
- `GET /api/startup -> Hono`

## Web Rules

- `apps/web`는 App Router + Server Components + Tailwind를 사용한다.
- Next.js는 HTML 서버로만 사용한다.
- Next API route는 probe 정도만 허용한다.
- Server Action은 사용하지 않는다.
- 프론트 구조는 route-local first를 기본으로 한다.
- 먼저 `app/.../_component`, `app/.../_lib`, `app/.../_query`에 둔다.
- 두 군데 이상에서 재사용될 때만 `src/feature/*` 또는 `src/component/*`로 승격한다.

## API Rules

- Hono public interface는 `/openapi.json`, `/api/v1/*`를 유지한다.
- 백엔드는 도메인별 colocation을 기본으로 한다.
- `<domain>/route.ts`
- `<domain>/service.ts`
- `<domain>/repository.ts`
- `<domain>/schema.ts`는 모듈이 자체 schema를 소유할 때만 둔다.
  - 다른 패키지 schema를 그대로 다시 내보내는 pass-through `schema.ts`는 만들지 않는다.
- `controller.ts`는 기본적으로 만들지 않는다.

## DB Boundary

- PostgreSQL + Drizzle를 사용한다.
- Drizzle migration 파일은 사용하지 않고 `drizzle-kit push`만 사용한다.

## Contracts And i18n

- 내부 TypeScript 소비자는 `Hono RPC + Zod`를 사용한다.
- 비-TS 소비자와 모바일 확장을 위해 OpenAPI도 함께 유지한다.
- i18n은 `next-intl + locale prefix`를 사용한다.
- locale은 `ko` default 이다.
- URL은 `/ko/...`, `/en/...`, ... 형식이다.
- Hono API는 locale에 종속되지 않게 유지한다.
- API는 stable error code를 반환하고, 웹이 locale message로 매핑한다.

## Testing And Lint

- 테스트 러너는 `bun test`를 사용한다.
- API integration test는 `test/api-integration`에 둔다.
- Testcontainers + PostgreSQL + `drizzle-kit push`로 검증한다.
- 브라우저 테스트가 필요해지면 Playwright를 사용한다.
- lint/format은 Biome only다.
- `tsc --noEmit`는 별도 유지한다.

## Escalation

- 위 기본값을 바꾸는 작업은 먼저 질문한다.
