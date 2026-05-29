import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const cms = process.env.CMS_API_URL?.replace(/\/$/, "");
  if (!cms) {
    return NextResponse.json({ success: false, message: "CMS_API_URL not configured" }, { status: 500 });
  }

  const res = await fetch(`${cms}/api/v1/member/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: body.email, password: body.password }),
  });

  let data: { token?: string; message?: string; member?: { displayName?: string } } = {};
  try {
    data = await res.json();
  } catch {
    return NextResponse.json({ success: false, message: "CMS API unreachable" }, { status: 502 });
  }

  if (!res.ok || !data.token) {
    return NextResponse.json({ success: false, message: data.message || "Invalid email or password" }, { status: 401 });
  }

  (await cookies()).set("cws_member_token", data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 86400,
  });

  return NextResponse.json({
    success: true,
    member: data.member,
    displayName: data.member?.displayName,
  });
}
