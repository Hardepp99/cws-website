import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const cms = process.env.CMS_API_URL?.replace(/\/$/, "");
  if (!cms) {
    return NextResponse.json({ success: false, message: "CMS_API_URL not configured" }, { status: 500 });
  }

  const res = await fetch(`${cms}/api/v1/member/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.token) {
    return NextResponse.json(
      { success: false, message: data.message || data.error || "Registration failed" },
      { status: res.status >= 400 ? res.status : 400 },
    );
  }

  (await cookies()).set("cws_member_token", data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 86400,
  });

  return NextResponse.json({ success: true, member: data.member });
}
