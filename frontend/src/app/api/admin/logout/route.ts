import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminRevokeToken } from "@/server/auth/admin-auth";

export async function POST() {
  const token = (await cookies()).get("cws_admin_token")?.value;
  if (token) await adminRevokeToken(token);
  (await cookies()).delete("cws_admin_token");
  return NextResponse.json({ success: true });
}
