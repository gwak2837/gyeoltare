import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentSession } from "@/feature/auth/session";
import { isLocale } from "@/i18n/config";
import { buildLocalizedMetadata } from "@/i18n/metadata";
import { getLocalizedPath } from "@/i18n/pathnames";
import { SignUpScreen } from "./_components/sign-up-screen";

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

  const session = await getCurrentSession();

  if (session) {
    redirect(getLocalizedPath(locale, "/"));
  }

  return <SignUpScreen locale={locale} />;
}
