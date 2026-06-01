import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminLogin } from "@/server/auth/admin-auth";

export async function POST(request: NextRequest) {
  const body = await request.json();
  try {
    const result = await adminLogin(String(body.username ?? ""), String(body.password ?? ""));
    if (!result) {
      return NextResponse.json(
        { success: false, message: "Invalid username or password" },
        { status: 401 },
      );
    }

    (await cookies()).set("cws_admin_token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 86400,
    });

    return NextResponse.json({
      success: true,
      displayName: result.displayName,
    });
  } catch (e) {
    return NextResponse.json(
      { success: false, message: (e as Error).message || "Login failed" },
      { status: 500 },
    );
  }
}
