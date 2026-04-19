import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";

import { env } from "@/env";
import { isLocale, locales } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";

import "../globals.css";

export const dynamicParams = false;

const { WEB_ORIGIN } = env;

export function generateMetadata(): Metadata {
  return {
    metadataBase: new URL(WEB_ORIGIN),
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const messages = await getMessages(locale);

  return (
    <html lang={locale}>
      <body className="min-h-screen bg-auth-canvas text-auth-ink">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
