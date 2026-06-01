import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { memberLogin } from "@/server/auth/member-auth";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = await memberLogin(String(body.email ?? ""), String(body.password ?? ""));
  if (!result) {
    return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });
  }

  (await cookies()).set("cws_member_token", result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 86400,
  });

  return NextResponse.json({
    success: true,
    member: result.member,
    displayName: result.displayName,
  });
}
