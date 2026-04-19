import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { isLocale } from "@/i18n/config";
import { getLocalizedPath } from "@/i18n/pathnames";

export default async function AuthLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const t = await getTranslations({
    locale,
    namespace: "auth",
  });

  return (
    <main className="relative isolate overflow-hidden">
      <div className="absolute top-20 -left-16 h-72 w-72 rounded-full bg-page-accent/12 blur-3xl" />
      <div className="absolute top-8 -right-10 h-80 w-80 rounded-full bg-[rgba(123,92,255,0.16)] blur-3xl" />

      <div className="mx-auto grid min-h-screen w-full max-w-6xl gap-10 px-6 py-8 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-10">
        <section className="flex flex-col justify-between rounded-[2.4rem] border border-page-border/70 bg-page-surface/88 p-8 shadow-[0_30px_120px_rgba(33,26,65,0.12)] backdrop-blur sm:p-10">
          <div>
            <Link
              className="inline-flex rounded-full border border-page-border bg-white px-4 py-2 font-medium text-page-ink text-sm"
              href={getLocalizedPath(locale, "/")}
            >
              Gyeoltare
            </Link>
            <p className="mt-10 font-semibold text-page-accent text-xs uppercase tracking-[0.32em]">
              {t("layout.eyebrow")}
            </p>
            <h1 className="mt-4 max-w-xl font-semibold text-4xl tracking-tight sm:text-[3.2rem]">
              {t("layout.title")}
            </h1>
            <p className="mt-5 max-w-xl text-base text-page-ink/70 leading-7">{t("layout.description")}</p>
          </div>

          <div className="mt-10 grid gap-4">
            <article className="rounded-[1.8rem] bg-white p-5 shadow-[0_16px_50px_rgba(33,26,65,0.08)]">
              <h2 className="font-semibold text-lg tracking-tight">{t("layout.featureIdentityTitle")}</h2>
              <p className="mt-2 text-page-ink/68 text-sm leading-6">{t("layout.featureIdentityBody")}</p>
            </article>
            <article className="rounded-[1.8rem] bg-white p-5 shadow-[0_16px_50px_rgba(33,26,65,0.08)]">
              <h2 className="font-semibold text-lg tracking-tight">{t("layout.featureSecurityTitle")}</h2>
              <p className="mt-2 text-page-ink/68 text-sm leading-6">{t("layout.featureSecurityBody")}</p>
            </article>
            <article className="rounded-[1.8rem] bg-white p-5 shadow-[0_16px_50px_rgba(33,26,65,0.08)]">
              <h2 className="font-semibold text-lg tracking-tight">{t("layout.featureOperationsTitle")}</h2>
              <p className="mt-2 text-page-ink/68 text-sm leading-6">{t("layout.featureOperationsBody")}</p>
            </article>
          </div>
        </section>

        <section className="flex items-center justify-center">{children}</section>
      </div>
    </main>
  );
}
