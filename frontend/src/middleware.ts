import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { HOME_INTRO_SESSION_KEY, isHomePath } from "@/lib/site-intro";

/** Pass intro skip flag to Server Components via request headers (replaces inline bootstrap script). */
function nextWithIntroHeader(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const introDone = request.cookies.get(HOME_INTRO_SESSION_KEY)?.value === "1";
  const skipIntro =
    pathname.startsWith("/api") || !isHomePath(pathname) || introDone;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-cws-skip-intro", skipIntro ? "1" : "0");

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return nextWithIntroHeader(request);
  }

  if (
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/api/admin") ||
    pathname.startsWith("/_next")
  ) {
    return nextWithIntroHeader(request);
  }

  const token = request.cookies.get("cws_admin_token");
  if (!token?.value) {
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("from", pathname);
    return login;
  }

  return nextWithIntroHeader(request);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|map)$).*)",
  ],
};
