import * as _cookie from "$std/http/cookie.ts";

const SITE_COOKIE_NAME = "sess_id";

const COOKIE_BASE = {
  secure: true,
  path: "/",
  httpOnly: true,
  // 90 days
  //   maxAge: 7776000,
  sameSite: "Lax",
} as Required<
  Pick<_cookie.Cookie, "path" | "httpOnly" | "sameSite">
> //   Pick<_cookie.Cookie, "path" | "httpOnly" | "maxAge" | "sameSite">
;

function getCookieName(name: string, isHttps: boolean) {
  return "__" + (isHttps ? "Host-" : "") + name;
}

function isHttps(url: string) {
  return url.startsWith("https://");
}

export function setSessionCookie(
  req: Request,
  headers: Headers,
  sessionId: string,
  expireIn: number,
) {
  const cookie: _cookie.Cookie = {
    ...COOKIE_BASE,
    name: getCookieName(SITE_COOKIE_NAME, isHttps(req.url)),
    value: sessionId,
    secure: isHttps(req.url),
    maxAge: expireIn,
  };
  _cookie.setCookie(headers, cookie);
}

export function getSessionCookie(
  req: Request,
  cookieName = getCookieName(SITE_COOKIE_NAME, req.url.startsWith("https://")),
) {
  return _cookie.getCookies(req.headers)[cookieName];
}
