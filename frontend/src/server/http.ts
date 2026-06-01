import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { getServerConfig } from "./config";

export type JsonRecord = Record<string, unknown>;

export function applyCors(request: NextRequest, response: NextResponse): NextResponse {
  const origin = request.headers.get("origin") || "";
  const { corsOrigins } = getServerConfig();
  if (origin && corsOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-CWS-Admin-Token, X-CWS-Member-Token",
  );
  return response;
}

export function jsonResponse(data: unknown, status = 200): NextResponse {
  return NextResponse.json(data, { status });
}

export async function readJsonBody(request: NextRequest): Promise<JsonRecord> {
  try {
    const data = await request.json();
    return data && typeof data === "object" && !Array.isArray(data) ? (data as JsonRecord) : {};
  } catch {
    return {};
  }
}

export function getAuthHeader(request: NextRequest): string {
  return (
    request.headers.get("authorization") ||
    request.headers.get("Authorization") ||
    ""
  );
}

export function getAdminToken(request: NextRequest): string {
  const bearer = getAuthHeader(request);
  const m = bearer.match(/^Bearer\s+(\S+)$/i);
  if (m) return m[1];
  return request.headers.get("x-cws-admin-token") || "";
}

export function getMemberToken(request: NextRequest): string {
  const bearer = getAuthHeader(request);
  const m = bearer.match(/^Bearer\s+(\S+)$/i);
  if (m) return m[1];
  return request.headers.get("x-cws-member-token") || "";
}

export function parseApiPath(pathname: string): string {
  const marker = "/api/v1";
  const i = pathname.indexOf(marker);
  const sub = i >= 0 ? pathname.slice(i + marker.length) : pathname;
  return sub || "/";
}
