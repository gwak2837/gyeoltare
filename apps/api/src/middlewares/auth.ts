import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";

export const auth = createMiddleware<Env>(async (c, next) => {
  const accessToken = getCookie(c, CookieKey.ACCESS_TOKEN);
  const atPayload = accessToken ? await verifyJWT(accessToken, JWTType.ACCESS).catch(() => null) : undefined;
  const validATUserId = atPayload?.sub;

  if (validATUserId) {
    c.set("userId", Number(validATUserId));
    return await next();
  }

  const refreshToken = getCookie(c, CookieKey.REFRESH_TOKEN);

  if (!refreshToken) {
    if (atPayload === null) {
      applyAuthCookie(c, getAuthCookieClearConfigs());
    }
    return await next();
  }

  const deviceLabel = buildSessionDeviceLabel(getRequestUserAgent(c.req.raw.headers));
  const refreshResult = await refreshSession(refreshToken, deviceLabel);

  if (!refreshResult.ok) {
    applyAuthCookie(c, getAuthCookieClearConfigs());
    return await next();
  }

  applyAuthCookie(c, refreshResult.cookies);
  c.set("userId", refreshResult.userId);

  return await next();
});
