import { NextResponse } from "next/server";
import { getPool, nodeCmsEnabled } from "@/server/db";
import { contentRepository } from "@/server/repositories/content-repository";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/** Deploy check: Node + MySQL + CMS read */
export async function GET() {
  if (!nodeCmsEnabled()) {
    return NextResponse.json(
      { ok: false, error: "Node CMS disabled — set MYSQL_DATABASE and CWS_NODE_CMS=1" },
      { status: 503 },
    );
  }

  try {
    const pool = getPool();
    await pool.query("SELECT 1");
    const settings = await contentRepository().getSiteSettings();
    const menus = await contentRepository().getMenus();
    const primaryCount = Array.isArray(menus.primary) ? menus.primary.length : 0;

    return NextResponse.json({
      ok: true,
      mode: "live",
      database: process.env.MYSQL_DATABASE || process.env.DB_NAME,
      menusPrimary: primaryCount,
      sitePhone: settings.phone ?? "",
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: (e as Error).message },
      { status: 503 },
    );
  }
}
