"use client";

type GlobalErrorProps = {
  error: Error;
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body>
        <main className="flex min-h-screen items-center justify-center px-6 py-16">
          <div className="max-w-xl rounded-[2rem] border border-page-border bg-page-surface px-8 py-10 shadow-[0_24px_80px_rgba(21,33,29,0.08)] backdrop-blur">
            <p className="text-xs uppercase tracking-[0.35em] text-page-accent">Global Error</p>
            <h1 className="mt-4 text-4xl font-semibold">
              화면을 다시 준비하지 못했습니다. We couldn't prepare the page.
            </h1>
            <p className="mt-4 text-base leading-7 text-page-ink/75">{error.message}</p>
            <button
              className="mt-6 rounded-full bg-page-ink px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
              onClick={reset}
              type="button"
            >
              다시 시도 / Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
