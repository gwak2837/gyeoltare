import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentSession } from "@/feature/auth/session";
import { buildSettingsPath } from "@/feature/auth/shared";
import { SignOutButton } from "@/feature/auth/sign-out-button";
import { isLocale } from "@/i18n/config";
import { buildLocalizedMetadata } from "@/i18n/metadata";
import { getLocalizedPath } from "@/i18n/pathnames";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const t = await getTranslations({
    locale,
    namespace: "common",
  });

  return await buildLocalizedMetadata({
    description: t("home.metadataDescription"),
    locale,
    pathname: "/",
    title: t("home.metadataTitle"),
  });
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const [session, t] = await Promise.all([
    getCurrentSession(),
    getTranslations({
      locale,
      namespace: "common",
    }),
  ]);

  const settingsHref =
    session?.user.username && session.user.username.length > 0
      ? getLocalizedPath(locale, buildSettingsPath(session.user.username))
      : getLocalizedPath(locale, "/login");

  return (
    <main className="relative isolate overflow-hidden">
      <div className="absolute top-24 -left-16 h-64 w-64 rounded-full bg-page-accent/12 blur-3xl" />
      <div className="absolute top-10 -right-20 h-72 w-72 rounded-full bg-[rgba(123,92,255,0.14)] blur-3xl" />

      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-page-accent text-xs uppercase tracking-[0.32em]">{t("home.eyebrow")}</p>
            <h1 className="mt-3 font-semibold text-2xl tracking-tight sm:text-3xl">{t("home.title")}</h1>
          </div>

          <div className="flex items-center gap-3">
            {session ? (
              <>
                <Link
                  className="hidden rounded-full border border-page-border bg-white px-5 py-3 font-medium text-page-ink text-sm shadow-sm sm:inline-flex"
                  href={settingsHref}
                >
                  {t("home.settingsLink")}
                </Link>
                <SignOutButton
                  className="inline-flex rounded-full bg-page-ink px-5 py-3 font-semibold text-sm text-white shadow-sm disabled:opacity-60"
                  idleLabel={t("home.signOut")}
                  locale={locale}
                />
              </>
            ) : (
              <>
                <Link
                  className="hidden rounded-full border border-page-border bg-white px-5 py-3 font-medium text-page-ink text-sm shadow-sm sm:inline-flex"
                  href={getLocalizedPath(locale, "/sign-up")}
                >
                  {t("home.secondaryCta")}
                </Link>
                <Link
                  className="inline-flex rounded-full bg-page-ink px-5 py-3 font-semibold text-sm text-white shadow-sm"
                  href={getLocalizedPath(locale, "/login")}
                >
                  {t("home.primaryCta")}
                </Link>
              </>
            )}
          </div>
        </header>

        <div className="mt-10 grid flex-1 gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <section className="rounded-[2.25rem] border border-page-border/70 bg-page-surface/90 p-7 shadow-[0_28px_120px_rgba(33,26,65,0.12)] backdrop-blur sm:p-10">
            <p className="max-w-2xl text-base text-page-ink/72 leading-7 sm:text-lg">{t("home.description")}</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <article className="rounded-[1.75rem] bg-page-soft p-5">
                <h2 className="font-semibold text-base tracking-tight">{t("home.featureIdentityTitle")}</h2>
                <p className="mt-2 text-page-ink/68 text-sm leading-6">{t("home.featureIdentityBody")}</p>
              </article>
              <article className="rounded-[1.75rem] bg-page-soft p-5">
                <h2 className="font-semibold text-base tracking-tight">{t("home.featureSecurityTitle")}</h2>
                <p className="mt-2 text-page-ink/68 text-sm leading-6">{t("home.featureSecurityBody")}</p>
              </article>
              <article className="rounded-[1.75rem] bg-page-soft p-5">
                <h2 className="font-semibold text-base tracking-tight">{t("home.featureOperationsTitle")}</h2>
                <p className="mt-2 text-page-ink/68 text-sm leading-6">{t("home.featureOperationsBody")}</p>
              </article>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                className="inline-flex rounded-full bg-page-ink px-6 py-3 font-semibold text-sm text-white shadow-sm"
                href={session ? settingsHref : getLocalizedPath(locale, "/login")}
              >
                {session ? t("home.settingsLink") : t("home.primaryCta")}
              </Link>
              {!session ? (
                <Link
                  className="inline-flex rounded-full border border-page-border bg-white px-6 py-3 font-semibold text-page-ink text-sm"
                  href={getLocalizedPath(locale, "/sign-up")}
                >
                  {t("home.secondaryCta")}
                </Link>
              ) : null}
            </div>
          </section>

          <section className="space-y-5">
            <article className="rounded-4xl border border-page-border/80 bg-white p-6 shadow-[0_24px_80px_rgba(33,26,65,0.1)]">
              {session ? (
                <>
                  <p className="font-semibold text-page-accent text-xs uppercase tracking-[0.3em]">
                    {session.user.twoFactorEnabled ? t("home.securityEnabled") : t("home.securityDisabled")}
                  </p>
                  <h2 className="mt-4 font-semibold text-2xl tracking-tight">
                    {t("home.loggedInTitle", { name: session.user.name })}
                  </h2>
                  <p className="mt-3 text-page-ink/70 text-sm leading-6">{t("home.loggedInDescription")}</p>
                  <Link
                    className="mt-6 inline-flex rounded-full border border-page-border bg-page-soft px-5 py-3 font-semibold text-sm"
                    href={settingsHref}
                  >
                    {t("home.settingsLink")}
                  </Link>
                </>
              ) : (
                <>
                  <p className="font-semibold text-page-accent text-xs uppercase tracking-[0.3em]">AUTH FLOW</p>
                  <div className="mt-4 rounded-[1.6rem] bg-page-soft p-5">
                    <div className="space-y-3">
                      <div className="rounded-2xl bg-white px-4 py-3 text-page-ink/55 text-sm shadow-sm">
                        이메일 또는 아이디
                      </div>
                      <div className="rounded-2xl bg-white px-4 py-3 text-page-ink/35 text-sm shadow-sm">비밀번호</div>
                      <div className="rounded-full bg-page-ink px-4 py-3 text-center font-semibold text-sm text-white shadow-sm">
                        {t("home.primaryCta")}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </article>

            <article className="rounded-4xl border border-page-border/80 bg-white p-6 shadow-[0_24px_80px_rgba(33,26,65,0.1)]">
              <h2 className="font-semibold text-xl tracking-tight">{t("home.previewTitle")}</h2>
              <ul className="mt-5 space-y-3 text-page-ink/70 text-sm leading-6">
                <li className="rounded-2xl bg-page-soft px-4 py-3">{t("home.previewItemAccount")}</li>
                <li className="rounded-2xl bg-page-soft px-4 py-3">{t("home.previewItemPasskey")}</li>
                <li className="rounded-2xl bg-page-soft px-4 py-3">{t("home.previewItemTwoFactor")}</li>
                <li className="rounded-2xl bg-page-soft px-4 py-3">{t("home.previewItemPassword")}</li>
              </ul>
            </article>
          </section>
        </div>
      </section>
    </main>
  );
}
