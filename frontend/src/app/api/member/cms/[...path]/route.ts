import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { dispatchCms, cmsResultToResponse } from "@/server/dispatch-cms";
import { readJsonBody } from "@/server/http";

async function handle(request: NextRequest, pathParts: string[]) {
  const token = (await cookies()).get("cws_member_token")?.value;
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
    body,
    rawBody,
    contentType,
    memberToken: token,
  });
  return cmsResultToResponse(result);
}

type RouteCtx = { params: Promise<{ path: string[] }> };

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
