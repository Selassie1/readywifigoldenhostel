// app/api/admin/auth/check/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const SESSION_SECRET = process.env.SESSION_SECRET || "your-super-secret-session-key";
const secretKey = new TextEncoder().encode(SESSION_SECRET);

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const sessionToken = cookieStore.get("admin_session")?.value;

    if (!sessionToken) {
      return NextResponse.json({
        success: false,
        authenticated: false,
        error: "No session found",
      });
    }

    // Verify the JWT token
    try {
      await jwtVerify(sessionToken, secretKey);
      
      return NextResponse.json({
        success: true,
        authenticated: true,
        message: "Session valid",
      });
    } catch (jwtError) {
      return NextResponse.json({
        success: false,
        authenticated: false,
        error: "Invalid or expired session",
      });
    }
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      {
        success: false,
        authenticated: false,
        error: "Authentication check failed",
      },
      { status: 500 }
    );
  }
}
