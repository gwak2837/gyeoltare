"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import { type Locale, localeCookieName, locales } from "@/i18n/config";
import { replaceLocaleInPathname } from "@/i18n/pathnames";

export function LocaleSwitcher() {
  const activeLocale = useLocale() as Locale;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("common");

  function handleLocaleChange(nextLocale: Locale) {
    const nextPathname = replaceLocaleInPathname(pathname, nextLocale);
    const query = searchParams.toString();

    // biome-ignore lint/suspicious/noDocumentCookie: The locale cookie is intentionally updated only after an explicit user switch.
    document.cookie = `${localeCookieName}=${nextLocale}; Path=/; Max-Age=31536000; SameSite=Lax`;
    window.location.assign(query ? `${nextPathname}?${query}` : nextPathname);
  }

  return (
    <label className="flex items-center gap-2 text-page-ink/55 text-xs uppercase tracking-[0.2em]">
      <span>{t("localeSwitcher.label")}</span>
      <select
        aria-label={t("localeSwitcher.label")}
        className="rounded-full border border-page-border bg-white/85 px-3 py-2 text-page-ink text-xs tracking-normal outline-none"
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
