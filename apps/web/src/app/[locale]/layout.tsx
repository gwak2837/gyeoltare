import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";

import { cn } from "@/component/cn";
import { THEME_COLOR } from "@/constant";
import { env } from "@/env";
import { isLocale, locales } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import "../globals.css";

export const dynamicParams = false;

export const viewport: Viewport = {
  colorScheme: "light",
  initialScale: 1,
  themeColor: THEME_COLOR,
  viewportFit: "cover",
  width: "device-width",
};

const { WEB_ORIGIN } = env;

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

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
    <html
      lang={locale}
      className={cn(
        jakartaSans.variable,
        plexMono.variable,
        "scheme-light h-full scroll-smooth antialiased motion-reduce:scroll-auto",
      )}
    >
      <body className="flex min-h-full flex-col bg-page-bg font-sans text-page-ink [text-rendering:optimizeLegibility]">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
