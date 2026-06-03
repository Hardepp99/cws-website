#!/usr/bin/env node
/**
 * Apply migrations + plan2 live SQL to local MySQL (WAMP defaults).
 *
 *   node database/scripts/apply-local.mjs
 *   node database/scripts/apply-local.mjs --migrations-only
 *   node database/scripts/apply-local.mjs --live-only
 */
import { readFileSync, readdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..", "..");
const require = createRequire(join(root, "frontend", "package.json"));
const mysql = require("mysql2/promise");

const db = {
  host: process.env.MYSQL_HOST || "127.0.0.1",
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.CWS_DB_NAME || process.env.MYSQL_DATABASE || "cws_cms",
  multipleStatements: true,
};

const args = new Set(process.argv.slice(2));
const migrationsOnly = args.has("--migrations-only");
const liveOnly = args.has("--live-only");

async function runSqlFile(conn, filePath) {
  const sql = readFileSync(filePath, "utf8");
  console.log("→", filePath.replace(root, ""));
  try {
    await conn.query(sql);
  } catch (e) {
    const msg = String(e?.message || e);
    if (/Duplicate column|already exists|Duplicate key name/i.test(msg)) {
      console.log("  (skipped — already applied)");
      return;
    }
    throw e;
  }
}

async function main() {
  const conn = await mysql.createConnection(db);
  console.log(`Connected to ${db.database}@${db.host}`);

  if (!liveOnly) {
    const migDir = join(root, "database", "migrations");
    const files = readdirSync(migDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();
    for (const f of files) {
      await runSqlFile(conn, join(migDir, f));
    }
  }

  if (!migrationsOnly) {
    const liveDir = join(root, "database", "live");
    const liveFiles = [
      "01_schema_pending_migrations.sql",
      "02_fix_menu_db_keys.sql",
      "07_plan2_homepage_full_update.sql",
      "08_plan2_site_settings_promo.sql",
      "10_page_pro_columns.sql",
      "11_about_page_pro_content.sql",
      "12_services_detail_genuine_content.sql",
    ];
    for (const f of liveFiles) {
      await runSqlFile(conn, join(liveDir, f));
    }
  }

  await conn.end();
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
