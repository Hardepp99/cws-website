import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { memberRegister } from "@/server/auth/member-auth";

export async function POST(request: NextRequest) {
  const body = await request.json();
  try {
    const data = await memberRegister(
      String(body.email ?? ""),
      String(body.password ?? ""),
      String(body.displayName ?? body.name ?? ""),
    );
    if (!data.token) {
      return NextResponse.json({ success: false, message: "Registration failed" }, { status: 400 });
    }

    (await cookies()).set("cws_member_token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 86400,
    });

    return NextResponse.json({ success: true, member: data.member });
  } catch (e) {
    return NextResponse.json({ success: false, message: (e as Error).message }, { status: 400 });
  }
}
