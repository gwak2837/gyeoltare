import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { isLocale } from "@/i18n/config";
import { buildLocalizedMetadata } from "@/i18n/metadata";

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

export default async function LoginPage({ params }: PageProps<"/[locale]/login">) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <LoginScreen locale={locale} />;
}
