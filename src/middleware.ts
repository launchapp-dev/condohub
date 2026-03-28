import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const protectedMatchers = [
  "/dashboard",
  "/visitors",
  "/announcements",
  "/maintenance",
  "/amenities",
  "/finances",
  "/documents",
  "/community",
  "/settings",
];

export async function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

  const pathname = request.nextUrl.pathname;
  const localeMatch = pathname.match(/^\/(en|es|pt|fr|ar|zh|ja|ko)(\/|$)/);
  const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;
  const pathWithoutLocale = localeMatch
    ? pathname.replace(/^\/(en|es|pt|fr|ar|zh|ja|ko)/, "") || "/"
    : pathname;

  const isProtected = protectedMatchers.some((m) =>
    pathWithoutLocale.startsWith(m)
  );

  if (isProtected) {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      const loginUrl = new URL(`/${locale}/login`, request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
  runtime: "nodejs",
};
