import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentSession } from "@/feature/auth/session";
import { parseAuthMode, sanitizeReturnTo } from "@/feature/auth/shared";
import { isLocale } from "@/i18n/config";
import { buildLocalizedMetadata } from "@/i18n/metadata";
import { getLocalizedPath } from "@/i18n/pathnames";
import { TwoFactorScreen } from "./_components/two-factor-screen";

export async function generateMetadata({ params }: PageProps<"/[locale]/two-factor">): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const t = await getTranslations({
    locale,
    namespace: "auth",
  });

  return await buildLocalizedMetadata({
    description: t("twoFactor.metadataDescription"),
    locale,
    pathname: "/two-factor",
    title: t("twoFactor.metadataTitle"),
  });
}

export default async function TwoFactorPage({ params, searchParams }: PageProps<"/[locale]/two-factor">) {
  const { locale } = await params;
  const query = await searchParams;

  if (!isLocale(locale)) {
    notFound();
  }

  const mode = parseAuthMode(query.mode);
  const returnTo = sanitizeReturnTo(query.returnTo, locale);
  const session = await getCurrentSession();

  if (session && mode !== "reauth") {
    redirect(getLocalizedPath(locale, "/"));
  }

  return <TwoFactorScreen mode={mode} returnTo={returnTo} />;
}
