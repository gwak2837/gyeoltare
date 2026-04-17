import type { AbstractIntlMessages } from "next-intl";

import type { Locale } from "./config";

async function loadNamespace(locale: Locale, namespace: "common" | "dashboard" | "marketing") {
  const messages = (
    await {
      en: {
        common: () => import("../../messages/en/common.json"),
        dashboard: () => import("../../messages/en/dashboard.json"),
        marketing: () => import("../../messages/en/marketing.json"),
      },
      ko: {
        common: () => import("../../messages/ko/common.json"),
        dashboard: () => import("../../messages/ko/dashboard.json"),
        marketing: () => import("../../messages/ko/marketing.json"),
      },
    }[locale][namespace]()
  ).default;

  return messages as AbstractIntlMessages;
}

export async function getMessages(locale: Locale): Promise<AbstractIntlMessages> {
  const [common, dashboard, marketing] = await Promise.all([
    loadNamespace(locale, "common"),
    loadNamespace(locale, "dashboard"),
    loadNamespace(locale, "marketing"),
  ]);

  return {
    common,
    dashboard,
    marketing,
  } as AbstractIntlMessages;
}
