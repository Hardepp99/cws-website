import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

async function proxy(request: NextRequest, pathParts: string[]) {
  const cms = process.env.CMS_API_URL?.replace(/\/$/, "");
  const token = (await cookies()).get("cws_member_token")?.value;
  if (!cms) {
    return NextResponse.json({ error: "CMS_API_URL not configured" }, { status: 500 });
  }

  const path = "/" + pathParts.join("/");
  const qs = request.nextUrl.search;
  const url = `${cms}/api/v1${path}${qs}`;

  const headers: Record<string, string> = {
    "Content-Type": request.headers.get("content-type") || "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
    headers["X-CWS-Member-Token"] = token;
  }

  const init: RequestInit = {
    method: request.method,
    headers,
    cache: "no-store",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.text();
  }

  const res = await fetch(url, init);
  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("content-type") || "application/json" },
  });
}

type RouteCtx = { params: Promise<{ path: string[] }> };

export async function GET(request: NextRequest, ctx: RouteCtx) {
  const { path } = await ctx.params;
  return proxy(request, path);
}

export async function POST(request: NextRequest, ctx: RouteCtx) {
  const { path } = await ctx.params;
  return proxy(request, path);
}

export async function PUT(request: NextRequest, ctx: RouteCtx) {
  const { path } = await ctx.params;
  return proxy(request, path);
}
