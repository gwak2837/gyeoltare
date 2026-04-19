import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { SignUpScreen } from "@/features/auth/screens/sign-up-screen";
import { isLocale } from "@/i18n/config";
import { buildLocalizedMetadata } from "@/i18n/metadata";

export async function generateMetadata({ params }: PageProps<"/[locale]/sign-up">): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const t = await getTranslations({
    locale,
    namespace: "auth",
  });

  return await buildLocalizedMetadata({
    description: t("signUp.metadataDescription"),
    locale,
    pathname: "/sign-up",
    title: t("signUp.metadataTitle"),
  });
}

export default async function SignUpPage({ params }: PageProps<"/[locale]/sign-up">) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <SignUpScreen locale={locale} />;
}
