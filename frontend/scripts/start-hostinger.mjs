#!/usr/bin/env node
/**
 * Production start for Hostinger Node.js — bind 0.0.0.0 on platform PORT.
 * Uses the local next CLI (not global `next` on PATH).
 */
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const appRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const nextCli = path.join(appRoot, "node_modules", "next", "dist", "bin", "next");

const port = String(process.env.PORT || "3000");
const host = process.env.HOST || "0.0.0.0";

console.log(`[cws-website] Starting Next.js on ${host}:${port}`);

const child = spawn(process.execPath, [nextCli, "start", "-H", host, "-p", port], {
  stdio: "inherit",
  env: process.env,
  cwd: appRoot,
});

child.on("exit", (code, signal) => {
  if (signal) {
    console.error(`[cws-website] next exited via ${signal}`);
    process.exit(1);
  }
  process.exit(code ?? 1);
});

child.on("error", (err) => {
  console.error("[cws-website] failed to launch next:", err.message);
  process.exit(1);
});
