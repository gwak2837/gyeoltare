import { getRequestConfig } from "next-intl/server";

import { defaultLocale, isLocale } from "./config";
import { getMessages } from "./messages";

export default getRequestConfig(async ({ requestLocale }) => {
  const localeCandidate = await requestLocale;
  const locale = isLocale(localeCandidate) ? localeCandidate : defaultLocale;

  return {
    locale,
    messages: await getMessages(locale),
  };
});
