import type { DashboardSnapshot } from "@repo/db/read-models/dashboard";

type DashboardShellProps = {
  snapshot: DashboardSnapshot;
};

export function DashboardShell({ snapshot }: DashboardShellProps) {
  return (
    <section className="mx-auto max-w-6xl rounded-[2.5rem] border border-page-border bg-page-surface p-8 shadow-[0_30px_90px_rgba(21,33,29,0.08)] backdrop-blur md:p-12">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-page-accent">
            Route-local dashboard
          </p>
          <h1 className="mt-3 text-4xl font-semibold md:text-5xl">운영 대시보드 초안</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-page-ink/75">
            이 화면은 read model만 직접 조회합니다. 실제 승인, triage, 외부 통신은 Hono mutation
            endpoint를 통해서만 실행되도록 경계를 유지합니다.
          </p>
        </div>
        <a
          className="rounded-full border border-page-border bg-white/75 px-4 py-2 text-sm transition hover:bg-white"
          href="/"
        >
          홈으로
        </a>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.75rem] bg-page-ink px-6 py-7 text-white">
          <p className="text-xs uppercase tracking-[0.3em] text-page-accent-soft">
            Public profiles
          </p>
          <p className="mt-4 text-5xl font-semibold">{snapshot.totalProfiles}</p>
        </div>
        <div className="rounded-[1.75rem] border border-page-border bg-white/80 px-6 py-7">
          <p className="text-xs uppercase tracking-[0.3em] text-page-accent">Inbox backlog</p>
          <p className="mt-4 text-5xl font-semibold">{snapshot.pendingContactMessages}</p>
        </div>
        <div className="rounded-[1.75rem] border border-page-border bg-white/80 px-6 py-7">
          <p className="text-xs uppercase tracking-[0.3em] text-page-accent">Last synced</p>
          <p className="mt-4 text-2xl font-semibold">
            {new Date(snapshot.generatedAt).toLocaleString("ko-KR")}
          </p>
        </div>
      </div>
    </section>
  );
}
