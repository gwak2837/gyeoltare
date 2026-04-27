import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentSession } from "@/feature/auth/session";
import { buildSettingsPath } from "@/feature/auth/shared";
import { isLocale } from "@/i18n/config";
import { buildLocalizedMetadata } from "@/i18n/metadata";
import { getLocalizedPath } from "@/i18n/pathnames";
import { SettingsScreen } from "./_components/settings-screen";

export async function generateMetadata({ params }: PageProps<"/[locale]/[username]/settings">): Promise<Metadata> {
  const { locale, username } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const t = await getTranslations({
    locale,
    namespace: "settings",
  });

  return await buildLocalizedMetadata({
    description: t("metadata.description"),
    locale,
    pathname: buildSettingsPath(username),
    title: t("metadata.title"),
  });
}

export default async function SettingsPage({ params }: PageProps<"/[locale]/[username]/settings">) {
  const { locale, username } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const session = await getCurrentSession();

  if (!session) {
    redirect(getLocalizedPath(locale, "/login"));
  }

  if (!session.user.username) {
    redirect(getLocalizedPath(locale, "/"));
  }

  if (session.user.username !== username) {
    redirect(getLocalizedPath(locale, buildSettingsPath(session.user.username)));
  }

  return <SettingsScreen initialSession={session} locale={locale} />;
}
