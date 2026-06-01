import { NextRequest, NextResponse } from "next/server";
import { contentRepository } from "@/server/repositories/content-repository";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await contentRepository().trackPageView(String(body.path ?? "/"), String(body.slug ?? ""));
  } catch {
    /* ignore tracking errors */
  }
  return NextResponse.json({ ok: true });
}
