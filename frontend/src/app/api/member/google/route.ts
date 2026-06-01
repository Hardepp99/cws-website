import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { memberLoginWithGoogle } from "@/server/auth/member-auth";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = await memberLoginWithGoogle(String(body.credential ?? ""));
  if (!result) {
    return NextResponse.json({ success: false, message: "Google sign-in failed" }, { status: 401 });
  }

  (await cookies()).set("cws_member_token", result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 86400,
  });

  return NextResponse.json({ success: true, member: result.member });
}
