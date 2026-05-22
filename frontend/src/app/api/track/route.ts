import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const cms = process.env.CMS_API_URL?.replace(/\/$/, "");
  if (!cms) {
    return NextResponse.json({ ok: false }, { status: 204 });
  }
  try {
    const body = await request.json();
    await fetch(`${cms}/api/v1/track-view`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: body.path ?? "/",
        slug: body.slug ?? "",
      }),
    });
  } catch {
    /* ignore tracking errors */
  }
  return NextResponse.json({ ok: true });
}
