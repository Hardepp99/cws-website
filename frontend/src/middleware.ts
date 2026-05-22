import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }
  if (
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/api/admin") ||
    pathname.startsWith("/_next")
  ) {
    return NextResponse.next();
  }
  const token = request.cookies.get("cws_admin_token");
  if (!token?.value) {
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("from", pathname);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
