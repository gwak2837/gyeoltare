import { type NextRequest, NextResponse } from "next/server";

import { localeCookieName } from "@/i18n/config";
import { resolveLocaleFromRequest } from "@/i18n/locale";
import { getLocalizedPath, hasLocalePrefix } from "@/i18n/pathnames";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (hasLocalePrefix(pathname)) {
    return NextResponse.next();
  }

  const locale = resolveLocaleFromRequest({
    acceptLanguage: request.headers.get("accept-language"),
    cookieLocale: request.cookies.get(localeCookieName)?.value,
  });

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = getLocalizedPath(locale, pathname);

  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: [
    {
      source: "/((?!.*\\.|_next/static|_next/image).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
    {
      source: "/((?!.*\\.|_next/static|_next/image).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
