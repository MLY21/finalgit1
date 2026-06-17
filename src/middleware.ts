import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET ?? "fallback-secret-change-in-production"
);

async function getTokenPayload(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { id: string; email: string; role: string };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  const payload = token ? await getTokenPayload(token) : null;
  const role = payload?.role;

  // Redirect logged-in users away from /login
  if (pathname === "/login") {
    if (role === "ADMIN") return NextResponse.redirect(new URL("/dashboard", request.url));
    if (role === "CLIENT") return NextResponse.redirect(new URL("/user", request.url));
    return NextResponse.next();
  }

  // Protect /admin and /dashboard routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) {
    if (!payload) return NextResponse.redirect(new URL("/login", request.url));
    if (role === "CLIENT") return NextResponse.redirect(new URL("/user", request.url));
    return NextResponse.next();
  }

  // Protect /user routes
  if (pathname.startsWith("/user")) {
    if (!payload) return NextResponse.redirect(new URL("/login", request.url));
    if (role === "ADMIN") return NextResponse.redirect(new URL("/dashboard", request.url));
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/user/:path*", "/login"],
};
