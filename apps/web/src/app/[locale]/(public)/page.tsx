import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { LocaleSwitcher } from "@/components/locale-switcher";
import { isLocale } from "@/i18n/config";
import { buildLocalizedMetadata } from "@/i18n/metadata";
import { getLocalizedPath } from "@/i18n/pathnames";

import { ProfileGrid } from "./home/_components/profile-grid";
import { getFeaturedProfilesQuery } from "./home/_queries/get-featured-profiles";

export const dynamic = "force-dynamic";

type MarketingPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: MarketingPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const t = await getTranslations({
    locale,
    namespace: "marketing",
  });

  return buildLocalizedMetadata({
    description: t("metadata.description"),
    locale,
    pathname: "/",
    title: t("metadata.title"),
  });
}

export default async function MarketingPage({ params }: MarketingPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const t = await getTranslations({
    locale,
    namespace: "marketing",
  });
  const featuredProfiles = await getFeaturedProfilesQuery();

  return (
    <main className="px-6 py-8 md:px-10 lg:px-14">
      <section className="mx-auto max-w-6xl overflow-hidden rounded-[2.75rem] border border-page-border bg-page-surface shadow-[0_30px_90px_rgba(21,33,29,0.08)] backdrop-blur">
        <div className="grid gap-10 p-8 md:p-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-page-accent text-xs uppercase tracking-[0.35em]">{t("eyebrow")}</p>
            <h1 className="mt-5 max-w-3xl font-semibold text-5xl leading-[1.05] md:text-7xl">
              {t("title")}
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-page-ink/78 leading-8">{t("description")}</p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full border border-page-border bg-white/70 px-4 py-2">
                {t("stack.next")}
              </span>
              <span className="rounded-full border border-page-border bg-white/70 px-4 py-2">
                {t("stack.tailwind")}
              </span>
              <span className="rounded-full border border-page-border bg-white/70 px-4 py-2">
                {t("stack.rpc")}
              </span>
              <span className="rounded-full border border-page-border bg-white/70 px-4 py-2">
                {t("stack.db")}
              </span>
            </div>
          </div>

          <div className="rounded-[2rem] bg-page-ink px-6 py-8 text-white">
            <div className="flex items-start justify-between gap-4">
              <p className="text-page-accent-soft text-xs uppercase tracking-[0.3em]">
                {t("boundary.eyebrow")}
              </p>
              <LocaleSwitcher />
            </div>
            <dl className="mt-6 space-y-6 text-sm text-white/78 leading-7">
              <div>
                <dt className="font-semibold text-white">{t("boundary.reads.title")}</dt>
                <dd>{t("boundary.reads.description")}</dd>
              </div>
              <div>
                <dt className="font-semibold text-white">{t("boundary.writes.title")}</dt>
                <dd>{t("boundary.writes.description")}</dd>
              </div>
              <div>
                <dt className="font-semibold text-white">{t("boundary.contract.title")}</dt>
                <dd>{t("boundary.contract.description")}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-6xl">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-page-accent text-xs uppercase tracking-[0.35em]">
              {t("featured.eyebrow")}
            </p>
            <h2 className="mt-3 font-semibold text-3xl md:text-4xl">{t("featured.title")}</h2>
          </div>
          <a
            className="rounded-full border border-page-border bg-white/70 px-4 py-2 text-sm transition hover:bg-white"
            href={getLocalizedPath(locale, "/dashboard")}
          >
            {t("featured.cta")}
          </a>
        </div>

        <ProfileGrid locale={locale} profiles={featuredProfiles} />
      </section>
    </main>
  );
}
