import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { AUTH_ENABLED } from "@/lib/constants";

export function middleware(request: NextRequest) {
  if (!AUTH_ENABLED) {
    return NextResponse.next();
  }

  const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");
  const sessionToken = request.cookies.get("session_token")?.value;

  if (isDashboardRoute && !sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
