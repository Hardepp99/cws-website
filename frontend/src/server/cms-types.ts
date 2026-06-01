import "server-only";
import type { NextRequest } from "next/server";

export type CmsDispatchContext = {
  method: string;
  path: string;
  searchParams: URLSearchParams;
  request?: NextRequest;
  body?: Record<string, unknown>;
  rawBody?: ArrayBuffer | string;
  contentType?: string;
  adminToken?: string;
  memberToken?: string;
};

export type CmsDispatchResult = {
  status: number;
  data?: unknown;
  /** Raw file response */
  file?: { path: string; mime: string };
  headers?: Record<string, string>;
};
