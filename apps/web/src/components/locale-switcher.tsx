"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import { localeCookieName, locales, type Locale } from "@/i18n/config";
import { replaceLocaleInPathname } from "@/i18n/pathnames";

export function LocaleSwitcher() {
  const activeLocale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("common");

  function handleLocaleChange(nextLocale: Locale) {
    const nextPathname = replaceLocaleInPathname(pathname, nextLocale);
    const query = searchParams.toString();

    document.cookie = `${localeCookieName}=${nextLocale}; Path=/; Max-Age=31536000; SameSite=Lax`;
    router.replace(query ? `${nextPathname}?${query}` : nextPathname);
  }

  return (
    <label className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-page-ink/55">
      <span>{t("localeSwitcher.label")}</span>
      <select
        aria-label={t("localeSwitcher.label")}
        className="rounded-full border border-page-border bg-white/85 px-3 py-2 text-xs tracking-normal text-page-ink outline-none"
        onChange={(event) => handleLocaleChange(event.target.value as Locale)}
        value={activeLocale}
      >
        {locales.map((locale) => (
          <option key={locale} value={locale}>
            {t(`localeSwitcher.locales.${locale}`)}
          </option>
        ))}
      </select>
    </label>
  );
}
