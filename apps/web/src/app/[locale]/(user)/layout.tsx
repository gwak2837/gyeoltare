import { notFound, redirect } from "next/navigation";

import { getCurrentSession } from "@/features/auth/server/get-current-session";
import { isLocale } from "@/i18n/config";
import { getLocalizedPath } from "@/i18n/pathnames";

export default async function AppLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const session = await getCurrentSession();

  if (!session) {
    redirect(getLocalizedPath(locale, "/login"));
  }

  return children;
}
