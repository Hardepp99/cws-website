import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const cms = process.env.CMS_API_URL?.replace(/\/$/, "");
  if (!cms) {
    return NextResponse.json({ success: false, message: "CMS_API_URL not configured" }, { status: 500 });
  }

  const res = await fetch(`${cms}/api/v1/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: body.username,
      password: body.password,
    }),
  });

  let data: { token?: string; message?: string; success?: boolean; displayName?: string } = {};
  try {
    data = await res.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: `CMS API unreachable at ${cms}. Is WAMP Apache running?`,
      },
      { status: 502 },
    );
  }
  if (!res.ok || !data.token) {
    return NextResponse.json(
      { success: false, message: data.message || "Invalid username or password" },
      { status: 401 },
    );
  }

  (await cookies()).set("cws_admin_token", data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 86400,
  });

  return NextResponse.json({
    success: true,
    displayName: data.displayName,
  });
}
