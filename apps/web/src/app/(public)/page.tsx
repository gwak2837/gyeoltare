import { ProfileGrid } from "./home/_components/profile-grid";
import { getFeaturedProfilesQuery } from "./home/_queries/get-featured-profiles";

export const dynamic = "force-dynamic";

export default async function MarketingPage() {
  const featuredProfiles = await getFeaturedProfilesQuery();

  return (
    <main className="px-6 py-8 md:px-10 lg:px-14">
      <section className="mx-auto max-w-6xl overflow-hidden rounded-[2.75rem] border border-page-border bg-page-surface shadow-[0_30px_90px_rgba(21,33,29,0.08)] backdrop-blur">
        <div className="grid gap-10 p-8 md:p-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-page-accent">
              Production-ready web shell
            </p>
            <h1 className="mt-5 max-w-3xl text-5xl leading-[1.05] font-semibold md:text-7xl">
              Hono를 도메인 경계로 두고, Next는 HTML에 집중하는 구조.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-page-ink/78">
              이 스캐폴드는 App Router와 Server Components를 사용하면서도 쓰기 경로와 공용 백엔드
              로직은 Hono에 고정합니다. 읽기 전용 뷰 모델은 Drizzle read-model 계층에서 바로
              가져오고, 재사용이 필요한 시점에는 Hono endpoint로 승격할 수 있게 설계되어 있습니다.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full border border-page-border bg-white/70 px-4 py-2">
                Next.js App Router
              </span>
              <span className="rounded-full border border-page-border bg-white/70 px-4 py-2">
                Tailwind CSS
              </span>
              <span className="rounded-full border border-page-border bg-white/70 px-4 py-2">
                Hono RPC + Zod
              </span>
              <span className="rounded-full border border-page-border bg-white/70 px-4 py-2">
                PostgreSQL + Drizzle
              </span>
            </div>
          </div>

          <div className="rounded-[2rem] bg-page-ink px-6 py-8 text-white">
            <p className="text-xs uppercase tracking-[0.3em] text-page-accent-soft">
              Boundary rules
            </p>
            <dl className="mt-6 space-y-6 text-sm leading-7 text-white/78">
              <div>
                <dt className="font-semibold text-white">Reads in Server Components</dt>
                <dd>오직 `packages/db/src/read-models/*` 경로를 통해 직접 조회합니다.</dd>
              </div>
              <div>
                <dt className="font-semibold text-white">Writes and side effects</dt>
                <dd>모든 mutation, transaction, 외부 부작용은 Hono 서비스 계층만 사용합니다.</dd>
              </div>
              <div>
                <dt className="font-semibold text-white">Shared contract</dt>
                <dd>
                  브라우저와 서버 클라이언트 모두 `@repo/contracts`와 `@repo/api-client`를 통해
                  묶습니다.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-6xl">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-page-accent">
              Featured read model
            </p>
            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              홈 화면은 DB read model에서 바로 조립합니다.
            </h2>
          </div>
          <a
            className="rounded-full border border-page-border bg-white/70 px-4 py-2 text-sm transition hover:bg-white"
            href="/dashboard"
          >
            Dashboard 보기
          </a>
        </div>

        <ProfileGrid profiles={featuredProfiles} />
      </section>
    </main>
  );
}
