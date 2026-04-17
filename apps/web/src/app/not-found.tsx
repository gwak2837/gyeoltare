export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="max-w-xl rounded-[2rem] border border-page-border bg-page-surface px-8 py-10 text-center shadow-[0_24px_80px_rgba(21,33,29,0.08)] backdrop-blur">
        <p className="text-xs uppercase tracking-[0.35em] text-page-accent">Not Found</p>
        <h1 className="mt-4 text-4xl font-semibold">길을 다시 찾는 중입니다.</h1>
        <p className="mt-4 text-base leading-7 text-page-ink/75">
          요청하신 페이지가 없거나 이동되었습니다. 정보 구조는 route-local first 원칙을 따르되,
          재사용이 확인되면 상위 feature 계층으로 승격됩니다.
        </p>
      </div>
    </main>
  );
}
