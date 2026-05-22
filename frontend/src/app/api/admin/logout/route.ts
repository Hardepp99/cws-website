import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const token = cookies().get("cws_admin_token")?.value;
  const cms = process.env.CMS_API_URL?.replace(/\/$/, "");
  if (cms && token) {
    await fetch(`${cms}/api/v1/admin/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => null);
  }
  cookies().delete("cws_admin_token");
  return NextResponse.json({ success: true });
}
