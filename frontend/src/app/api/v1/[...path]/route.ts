import { NextRequest, NextResponse } from "next/server";
import { applyCors, getAdminToken, getMemberToken, readJsonBody } from "@/server/http";
import { nodeCmsEnabled } from "@/server/db";
import { dispatchCms, cmsResultToResponse } from "@/server/dispatch-cms";

export const runtime = "nodejs";

async function handle(request: NextRequest, pathParts: string[]) {
  if (!nodeCmsEnabled()) {
    return NextResponse.json(
      {
        error: "Node CMS not configured",
        hint: "Set MYSQL_DATABASE (and related env vars). See docs/NODE_CMS_MIGRATION.md",
      },
      { status: 503 },
    );
  }

  const path = "/" + pathParts.join("/");
  const contentType = request.headers.get("content-type") || "";
  let body: Record<string, unknown> | undefined;
  let rawBody: ArrayBuffer | undefined;

  if (request.method !== "GET" && request.method !== "HEAD") {
    if (contentType.includes("multipart/form-data")) {
      rawBody = await request.arrayBuffer();
    } else {
      body = await readJsonBody(request);
    }
  }

  const result = await dispatchCms({
    method: request.method,
    path,
    searchParams: request.nextUrl.searchParams,
    request,
    body,
    rawBody,
    contentType,
    adminToken: getAdminToken(request),
    memberToken: getMemberToken(request),
  });

  const response = await cmsResultToResponse(result);
  return applyCors(request, response as NextResponse);
}

type RouteCtx = { params: Promise<{ path: string[] }> };

export async function OPTIONS(request: NextRequest) {
  return applyCors(request, new NextResponse(null, { status: 204 }));
}

export async function GET(request: NextRequest, ctx: RouteCtx) {
  const { path } = await ctx.params;
  return handle(request, path);
}

export async function POST(request: NextRequest, ctx: RouteCtx) {
  const { path } = await ctx.params;
  return handle(request, path);
}

export async function PUT(request: NextRequest, ctx: RouteCtx) {
  const { path } = await ctx.params;
  return handle(request, path);
}

export async function PATCH(request: NextRequest, ctx: RouteCtx) {
  const { path } = await ctx.params;
  return handle(request, path);
}

export async function DELETE(request: NextRequest, ctx: RouteCtx) {
  const { path } = await ctx.params;
  return handle(request, path);
}
