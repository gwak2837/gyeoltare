import { Aperture } from "@mynaui/icons-react";
import type { Route } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { cn } from "@/component/cn";
import { getCurrentSession } from "@/feature/auth/session";
import { buildSettingsPath } from "@/feature/auth/shared";
import type { Locale } from "@/i18n/config";
import { getLocalizedPath } from "@/i18n/pathnames";

type NavigationHeaderProps = {
  locale: Locale;
};

type NavigationHeaderActionsProps = {
  labels: {
    login: string;
    myPage: string;
    start: string;
  };
  locale: Locale;
  loginPath: Route;
  startPath: Route;
};

type NavigationHeaderGuestActionsProps = Pick<NavigationHeaderActionsProps, "labels" | "loginPath" | "startPath">;

const focusClassName = "focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-page-accent";

const homeSectionLinks = [
  { hash: "experience", key: "experience" },
  { hash: "pricing", key: "pricing" },
  { hash: "faq", key: "faq" },
] as const;

export async function NavigationHeader({ locale }: NavigationHeaderProps) {
  const t = await getTranslations({
    locale,
    namespace: "common",
  });

  const homePath = getLocalizedPath(locale, "/");
  const coupleTypePath = getLocalizedPath(locale, "/couple-type");
  const loginPath = getLocalizedPath(locale, "/login");
  const startPath = getLocalizedPath(locale, "/sign-up");
  const actionLabels = {
    login: t("navigation.login"),
    myPage: t("navigation.myPage"),
    start: t("navigation.start"),
  };

  return (
    <header className="sticky top-0 z-50 border-page-border/70 border-b bg-page-bg/88 px-safe pt-safe backdrop-blur-2xl">
      <nav
        aria-label={t("navigation.aria")}
        className="mx-auto flex h-(--app-header-height) w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
      >
        <Link
          aria-label={t("navigation.homeAria")}
          className={cn(
            "group inline-flex touch-manipulation items-center gap-3 font-bold text-page-ink tracking-tight",
            focusClassName,
          )}
          href={homePath}
        >
          <Aperture aria-hidden="true" className="h-10 w-10 text-[#ff5252]" stroke={1.9} />
          <span className="text-lg" translate="no">
            결타래
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link
            className={cn(
              "touch-manipulation font-semibold text-page-accent text-sm transition-colors hover:text-page-ink",
              focusClassName,
            )}
            href={coupleTypePath}
          >
            {t("navigation.coupleType")}
          </Link>
          {homeSectionLinks.map((item) => (
            <Link
              className={cn(
                "touch-manipulation font-semibold text-page-ink/62 text-sm transition-colors hover:text-page-ink",
                focusClassName,
              )}
              href={getHomeSectionPath(locale, item.hash)}
              key={item.hash}
            >
              {t(`navigation.${item.key}`)}
            </Link>
          ))}
        </div>

        <Suspense fallback={<NavigationHeaderActionsSkeleton />}>
          <NavigationHeaderActions labels={actionLabels} locale={locale} loginPath={loginPath} startPath={startPath} />
        </Suspense>
      </nav>
    </header>
  );
}

async function NavigationHeaderActions({ labels, locale, loginPath, startPath }: NavigationHeaderActionsProps) {
  const session = await getCurrentSession();
  const myPagePath = session?.user.username ? getLocalizedPath(locale, buildSettingsPath(session.user.username)) : null;

  if (myPagePath) {
    return (
      <div className="flex w-35 items-center justify-end sm:w-53">
        <Link
          className={cn(
            "inline-flex min-h-11 touch-manipulation items-center justify-center rounded-full bg-page-accent px-5 font-bold text-sm text-white shadow-[0_16px_40px_rgba(255,77,109,0.25)] transition-colors hover:bg-page-accent/92",
            focusClassName,
          )}
          href={myPagePath}
        >
          {labels.myPage}
        </Link>
      </div>
    );
  }

  return <NavigationHeaderGuestActions labels={labels} loginPath={loginPath} startPath={startPath} />;
}

function NavigationHeaderGuestActions({ labels, loginPath, startPath }: NavigationHeaderGuestActionsProps) {
  return (
    <div className="flex w-35 items-center justify-end gap-3 sm:w-53">
      <Link
        className={cn(
          "hidden touch-manipulation font-semibold text-page-ink/62 text-sm transition-colors hover:text-page-ink sm:inline-flex",
          focusClassName,
        )}
        href={loginPath}
      >
        {labels.login}
      </Link>
      <Link
        className={cn(
          "inline-flex min-h-11 touch-manipulation items-center justify-center rounded-full bg-page-accent px-5 font-bold text-sm text-white shadow-[0_16px_40px_rgba(255,77,109,0.25)] transition-colors hover:bg-page-accent/92",
          focusClassName,
        )}
        href={startPath}
      >
        {labels.start}
      </Link>
    </div>
  );
}

function NavigationHeaderActionsSkeleton() {
  return (
    <div aria-hidden="true" className="flex w-35 items-center justify-end gap-3 sm:w-53">
      <span className="hidden h-5 w-11 rounded-full bg-page-ink/10 sm:block" />
      <span className="h-11 w-22 rounded-full bg-page-accent/18" />
    </div>
  );
}

function getHomeSectionPath(locale: Locale, hash: (typeof homeSectionLinks)[number]["hash"]) {
  return `${getLocalizedPath(locale, "/")}#${hash}` as Route;
}
