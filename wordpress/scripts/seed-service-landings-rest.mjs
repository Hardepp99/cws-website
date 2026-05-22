/**
 * Seed service_landing posts via WordPress REST API
 * Usage: node wordpress/scripts/seed-service-landings-rest.mjs
 * Env: WP_URL, WP_USER, WP_APP_PASSWORD
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, "../../frontend/src/data/service-landings.json");
const landings = JSON.parse(fs.readFileSync(dataPath, "utf8"));

const wpUrl = process.env.WP_URL || "http://localhost/cws-cms";
const auth = Buffer.from(
  `${process.env.WP_USER || "admin"}:${process.env.WP_APP_PASSWORD || ""}`
).toString("base64");

async function seed() {
  for (const [slug, item] of Object.entries(landings)) {
    const body = {
      title: item.service,
      slug,
      status: "publish",
      content: item.intro,
      meta: {
        service_name: item.service,
        intro: item.intro,
        seo_title: item.pageTitle,
        seo_description: item.pageDescription,
      },
    };

    const res = await fetch(`${wpUrl}/wp-json/wp/v2/service_landing`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      console.log("Created:", slug);
    } else {
      const err = await res.text();
      console.warn("Skip/fail:", slug, res.status, err.slice(0, 120));
    }
  }
}

seed().catch(console.error);
