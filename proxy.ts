import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { DEFAULT_LANG, LANGUAGES } from "@/lib/i18n";

const validLangs = LANGUAGES.map((l) => l.code);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLang = validLangs.some(
    (lang) => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`
  );

  const response = NextResponse.next();

  if (pathnameHasLang) {
    const detectedLang = validLangs.find(
      (lang) => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`
    );
    if (detectedLang) {
      response.cookies.set("lang", detectedLang, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      });
    }
  } else {
    response.cookies.set("lang", DEFAULT_LANG, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next|_next/static|_next/image|favicon|og|apple-touch-icon|manifest|robots).*)",
  ],
};
