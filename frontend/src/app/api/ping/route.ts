import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Lightweight liveness — no database (use when debugging Hostinger 503). */
export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "cws-website",
    node: process.version,
    port: process.env.PORT ?? null,
  });
}
