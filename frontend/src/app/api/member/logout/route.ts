import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cms = process.env.CMS_API_URL?.replace(/\/$/, "");
  const token = (await cookies()).get("cws_member_token")?.value;
  if (cms && token) {
    await fetch(`${cms}/api/v1/member/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
  }
  (await cookies()).delete("cws_member_token");
  return NextResponse.json({ success: true });
}
