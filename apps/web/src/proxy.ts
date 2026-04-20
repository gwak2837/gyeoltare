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

// https://clerk.com/blog/skip-nextjs-middleware-static-and-public-files
// https://nextjs.org/docs/app/guides/content-security-policy#adding-a-nonce-with-proxy
export const config = {
  matcher: [
    {
      source: "/((?!api|trpc|_next|_vercel|health(?:/|$)|.*\\..*).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
