import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentSession } from "@/feature/auth/session";
import { parseAuthMode, sanitizeReturnTo } from "@/feature/auth/shared";
import { isLocale } from "@/i18n/config";
import { buildLocalizedMetadata } from "@/i18n/metadata";
import { getLocalizedPath } from "@/i18n/pathnames";
import { LoginScreen } from "./_components/login-screen";

export async function generateMetadata({ params }: PageProps<"/[locale]/login">): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const t = await getTranslations({
    locale,
    namespace: "auth",
  });

  return await buildLocalizedMetadata({
    description: t("login.metadataDescription"),
    locale,
    pathname: "/login",
    title: t("login.metadataTitle"),
  });
}

export default async function LoginPage({ params, searchParams }: PageProps<"/[locale]/login">) {
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

  return <LoginScreen locale={locale} mode={mode} returnTo={returnTo} />;
}
