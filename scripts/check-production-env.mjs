#!/usr/bin/env node
/** @deprecated Use frontend/scripts/check-production-env.mjs (Hostinger app root = frontend). */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const script = path.join(path.dirname(fileURLToPath(import.meta.url)), "../frontend/scripts/check-production-env.mjs");
const r = spawnSync(process.execPath, [script], { stdio: "inherit", env: process.env });
process.exit(r.status ?? 1);
