#!/usr/bin/env node
/** Writes public/cws-site-intro-bootstrap.js from src/lib/site-intro.ts builder output. */
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const frontendRoot = join(__dirname, "..");

// Load compiled constants via tsx-less approach: eval the TS export string from file
const siteIntroPath = join(frontendRoot, "src", "lib", "site-intro.ts");
const src = readFileSync(siteIntroPath, "utf8");
const keyMatch = src.match(/HOME_INTRO_SESSION_KEY\s*=\s*"([^"]+)"/);
const failsafeMatch = src.match(/SITE_INTRO_FAILSAFE_MS\s*=\s*([^;]+);/);
const key = keyMatch?.[1] ?? "cws_home_intro_shown";
const failsafe = failsafeMatch ? eval(failsafeMatch[1].trim()) : 4480;

const body = `(function(){var K=${JSON.stringify(key)},M=${failsafe},p=location.pathname||"/",h=p==="/"||p===""||p==="/index"||p==="/index.html",s=!h;try{if(sessionStorage.getItem(K)==="1")s=true}catch(e){}function d(){var e=document.documentElement,b=document.body,pl=document.getElementById("preloader");e.classList.remove("is-intro-pending");b.classList.add("site-ready");if(pl){pl.classList.add("loaded");pl.style.display="none";pl.style.pointerEvents="none"}}function m(){try{sessionStorage.setItem(K,"1")}catch(e){}}if(s){d();return}document.documentElement.classList.add("is-intro-pending");window.addEventListener("site-intro-ready",function(){m();d()},{once:true});setTimeout(function(){m();d()},M)})();`;

const out = join(frontendRoot, "public", "cws-site-intro-bootstrap.js");
const banner = `/**
 * Site intro bootstrap — runs before React hydration.
 * Auto-generated — do not edit by hand. Run: node frontend/scripts/sync-site-intro-bootstrap.mjs
 */\n`;
writeFileSync(out, banner + body + "\n", "utf8");
console.log("Wrote", out);
