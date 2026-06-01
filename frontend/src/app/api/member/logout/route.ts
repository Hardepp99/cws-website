import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { memberRevokeToken } from "@/server/auth/member-auth";

export async function POST() {
  const token = (await cookies()).get("cws_member_token")?.value;
  if (token) await memberRevokeToken(token);
  (await cookies()).delete("cws_member_token");
  return NextResponse.json({ success: true });
}
