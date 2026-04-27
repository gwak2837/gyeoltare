import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("common");

  return (
    <main className="flex min-h-app-screen items-center justify-center px-safe py-16">
      <div className="max-w-xl rounded-4xl border border-page-border bg-page-surface px-8 py-10 text-center shadow-[0_24px_80px_rgba(21,33,29,0.08)] backdrop-blur">
        <p className="text-page-accent text-xs uppercase tracking-[0.35em]">{t("notFound.eyebrow")}</p>
        <h1 className="mt-4 font-semibold text-4xl">{t("notFound.title")}</h1>
        <p className="mt-4 text-base text-page-ink/75 leading-7">{t("notFound.description")}</p>
      </div>
    </main>
  );
}
