#!/usr/bin/env node
/**
 * Production start for Hostinger Node.js — bind all interfaces on platform PORT.
 * hPanel Start command: npm run start
 */
import { spawn } from "node:child_process";

const port = String(process.env.PORT || "3000");
const host = process.env.HOST || "0.0.0.0";

const nextBin = process.platform === "win32" ? "next.cmd" : "next";
const child = spawn(nextBin, ["start", "-H", host, "-p", port], {
  stdio: "inherit",
  env: process.env,
  shell: process.platform === "win32",
});

child.on("exit", (code, signal) => {
  if (signal) {
    console.error(`[start] next exited via ${signal}`);
    process.exit(1);
  }
  process.exit(code ?? 1);
});

child.on("error", (err) => {
  console.error("[start] failed to launch next:", err.message);
  process.exit(1);
});
