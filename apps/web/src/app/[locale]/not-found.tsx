import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("common");

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="max-w-xl rounded-[2rem] border border-page-border bg-page-surface px-8 py-10 text-center shadow-[0_24px_80px_rgba(21,33,29,0.08)] backdrop-blur">
        <p className="text-xs uppercase tracking-[0.35em] text-page-accent">
          {t("notFound.eyebrow")}
        </p>
        <h1 className="mt-4 text-4xl font-semibold">{t("notFound.title")}</h1>
        <p className="mt-4 text-base leading-7 text-page-ink/75">
          {t("notFound.description")}
        </p>
      </div>
    </main>
  );
}
