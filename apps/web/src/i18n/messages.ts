import type { Locale } from "./config";

type MessageNamespace = "auth" | "common" | "dashboard" | "marketing" | "settings";

const dynamic = {
  en: {
    auth: () => import("../../messages/en/auth.json"),
    common: () => import("../../messages/en/common.json"),
    dashboard: () => import("../../messages/en/dashboard.json"),
    marketing: () => import("../../messages/en/marketing.json"),
    settings: () => import("../../messages/en/settings.json"),
  },
  ko: {
    auth: () => import("../../messages/ko/auth.json"),
    common: () => import("../../messages/ko/common.json"),
    dashboard: () => import("../../messages/ko/dashboard.json"),
    marketing: () => import("../../messages/ko/marketing.json"),
    settings: () => import("../../messages/ko/settings.json"),
  },
};

async function loadNamespace(locale: Locale, namespace: MessageNamespace) {
  return (await dynamic[locale][namespace]()).default;
}

export async function getMessages(locale: Locale) {
  const [auth, common, dashboard, marketing, settings] = await Promise.all([
    loadNamespace(locale, "auth"),
    loadNamespace(locale, "common"),
    loadNamespace(locale, "dashboard"),
    loadNamespace(locale, "marketing"),
    loadNamespace(locale, "settings"),
  ]);

  return {
    auth,
    common,
    dashboard,
    marketing,
    settings,
  };
}
