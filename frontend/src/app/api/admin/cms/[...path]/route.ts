import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

async function proxy(request: NextRequest, pathParts: string[]) {
  const cms = process.env.CMS_API_URL?.replace(/\/$/, "");
  const token = cookies().get("cws_admin_token")?.value;
  if (!cms) {
    return NextResponse.json({ error: "CMS_API_URL not configured" }, { status: 500 });
  }
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const path = "/" + pathParts.join("/");
  const qs = request.nextUrl.search;
  const url = `${cms}/api/v1/admin${path}${qs}`;
  const contentType = request.headers.get("content-type") || "";
  const isMultipart = contentType.includes("multipart/form-data");

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "X-CWS-Admin-Token": token,
  };
  if (!isMultipart) {
    headers["Content-Type"] = contentType || "application/json";
  } else {
    headers["Content-Type"] = contentType;
  }

  const init: RequestInit = {
    method: request.method,
    headers,
    cache: "no-store",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = isMultipart ? await request.arrayBuffer() : await request.text();
  }

  const res = await fetch(url, init);
  const text = await res.text();
  const resType = res.headers.get("content-type") || "application/json";
  return new NextResponse(text, {
    status: res.status,
    headers: { "Content-Type": resType },
  });
}

export async function GET(request: NextRequest, ctx: { params: { path: string[] } }) {
  return proxy(request, ctx.params.path);
}

export async function PUT(request: NextRequest, ctx: { params: { path: string[] } }) {
  return proxy(request, ctx.params.path);
}

export async function POST(request: NextRequest, ctx: { params: { path: string[] } }) {
  return proxy(request, ctx.params.path);
}

export async function DELETE(request: NextRequest, ctx: { params: { path: string[] } }) {
  return proxy(request, ctx.params.path);
}
