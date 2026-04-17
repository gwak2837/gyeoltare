import type { DashboardSnapshot } from "@gyeoltare/db/read-models/dashboard";
import { getTranslations } from "next-intl/server";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { type Locale, toIntlLocale } from "@/i18n/config";
import { getLocalizedPath } from "@/i18n/pathnames";

type DashboardShellProps = {
  locale: Locale;
  snapshot: DashboardSnapshot;
};

export async function DashboardShell({ locale, snapshot }: DashboardShellProps) {
  const t = await getTranslations("dashboard");
  const formatter = new Intl.DateTimeFormat(toIntlLocale(locale), {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <section className="mx-auto max-w-6xl rounded-[2.5rem] border border-page-border bg-page-surface p-8 shadow-[0_30px_90px_rgba(21,33,29,0.08)] backdrop-blur md:p-12">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-page-accent text-xs uppercase tracking-[0.35em]">{t("eyebrow")}</p>
          <h1 className="mt-3 font-semibold text-4xl md:text-5xl">{t("title")}</h1>
          <p className="mt-4 max-w-2xl text-base text-page-ink/75 leading-7">{t("description")}</p>
        </div>
        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          <a
            className="rounded-full border border-page-border bg-white/75 px-4 py-2 text-sm transition hover:bg-white"
            href={getLocalizedPath(locale, "/")}
          >
            {t("backHome")}
          </a>
        </div>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.75rem] bg-page-ink px-6 py-7 text-white">
          <p className="text-page-accent-soft text-xs uppercase tracking-[0.3em]">
            {t("cards.publicProfiles")}
          </p>
          <p className="mt-4 font-semibold text-5xl">{snapshot.totalProfiles}</p>
        </div>
        <div className="rounded-[1.75rem] border border-page-border bg-white/80 px-6 py-7">
          <p className="text-page-accent text-xs uppercase tracking-[0.3em]">
            {t("cards.inboxBacklog")}
          </p>
          <p className="mt-4 font-semibold text-5xl">{snapshot.pendingContactMessages}</p>
        </div>
        <div className="rounded-[1.75rem] border border-page-border bg-white/80 px-6 py-7">
          <p className="text-page-accent text-xs uppercase tracking-[0.3em]">
            {t("cards.lastSynced")}
          </p>
          <p className="mt-4 font-semibold text-2xl">
            {formatter.format(new Date(snapshot.generatedAt))}
          </p>
        </div>
      </div>
    </section>
  );
}
