import type { PublicProfile } from "@gyeoltare/contracts";
import { getTranslations } from "next-intl/server";

import { type Locale, toIntlLocale } from "@/i18n/config";

type ProfileGridProps = {
  locale: Locale;
  profiles: PublicProfile[];
};

export async function ProfileGrid({ locale, profiles }: ProfileGridProps) {
  const t = await getTranslations("common");
  const formatter = new Intl.DateTimeFormat(toIntlLocale(locale), {
    dateStyle: "medium",
  });

  return (
    <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {profiles.map((profile) => (
        <article
          className="rounded-[1.8rem] border border-page-border bg-white/70 p-6 shadow-[0_18px_45px_rgba(21,33,29,0.08)]"
          key={profile.id}
        >
          <div className="flex items-center justify-between gap-4">
            <p className="font-semibold text-lg">{profile.displayName}</p>
            <span className="rounded-full bg-page-accent/10 px-3 py-1 font-medium text-page-accent text-xs">
              /{profile.slug}
            </span>
          </div>
          <p className="mt-4 text-page-ink/75 text-sm leading-7">
            {profile.bio ?? t("profile.emptyBio")}
          </p>
          <p className="mt-6 text-page-ink/45 text-xs uppercase tracking-[0.28em]">
            {t("profile.created", {
              date: formatter.format(new Date(profile.createdAt)),
            })}
          </p>
        </article>
      ))}
    </div>
  );
}
