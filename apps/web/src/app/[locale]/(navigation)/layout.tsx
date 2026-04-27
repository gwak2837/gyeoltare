import { notFound } from "next/navigation";

import { isLocale } from "@/i18n/config";

import { NavigationHeader } from "./_components/navigation-header";

export default async function NavigationLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <>
      <NavigationHeader locale={locale} />
      {children}
    </>
  );
}
