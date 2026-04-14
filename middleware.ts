// middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_SECRET = process.env.SESSION_SECRET || "your-super-secret-session-key";
const secretKey = new TextEncoder().encode(SESSION_SECRET);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");
  const isApiAdminRoute = pathname.startsWith("/api/admin") && !pathname.startsWith("/api/admin/auth");

  if (isAdminRoute || isApiAdminRoute) {
    const adminSession = request.cookies.get("admin_session")?.value;

    if (!adminSession) {
      if (isAdminRoute) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      } else {
        return NextResponse.json(
          { success: false, error: "Unauthorized access" },
          { status: 401 }
        );
      }
    }

    try {
      // Verify JWT signature using jose
      await jwtVerify(adminSession, secretKey);
    } catch (error) {
      // Invalid or expired token
      if (isAdminRoute) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      } else {
        return NextResponse.json(
          { success: false, error: "Invalid or expired session" },
          { status: 401 }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
