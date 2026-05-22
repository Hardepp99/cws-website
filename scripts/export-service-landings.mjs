import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const phpPath = path.join(__dirname, "../php/includes/service-seo-data.php");
const php = fs.readFileSync(phpPath, "utf8");

const themeMap = {
  "website-development-zirakpur": { start: "#1e3a8a", mid: "#2563eb", end: "#3b82f6", accent: "#93c5fd", icon: "fas fa-globe", badge: "Responsive Business Websites" },
  "digital-marketing-zirakpur": { start: "#f97316", mid: "#fb923c", end: "#1e3a8a", accent: "#fed7aa", icon: "fas fa-bullhorn", badge: "SEO, Ads and Lead Growth" },
  "ecommerce-website-zirakpur": { start: "#0f766e", mid: "#14b8a6", end: "#0f172a", accent: "#99f6e4", icon: "fas fa-cart-shopping", badge: "Sell Products Online" },
  "ui-ux-design-zirakpur": { start: "#14b8a6", mid: "#2dd4bf", end: "#1e3a8a", accent: "#ccfbf1", icon: "fas fa-palette", badge: "Modern Product Design" },
  "custom-software-development-zirakpur": { start: "#1e3a8a", mid: "#2563eb", end: "#3b82f6", accent: "#93c5fd", icon: "fas fa-laptop-code", badge: "Tailored Business Solutions" },
  "crm-development-zirakpur": { start: "#0f766e", mid: "#10b981", end: "#34d399", accent: "#d1fae5", icon: "fas fa-users-cog", badge: "Lead and Sales Management" },
  "erp-hrm-software-zirakpur": { start: "#1d4ed8", mid: "#3b82f6", end: "#0f766e", accent: "#bfdbfe", icon: "fas fa-cogs", badge: "Operations and HR Control" },
  "mobile-app-development-zirakpur": { start: "#059669", mid: "#10b981", end: "#34d399", accent: "#d1fae5", icon: "fas fa-mobile-alt", badge: "Android and iOS Apps" },
  "blockchain-development-zirakpur": { start: "#1e3a8a", mid: "#6366f1", end: "#8b5cf6", accent: "#ddd6fe", icon: "fas fa-cubes", badge: "Web3 Product Development" },
  "smart-contract-development-zirakpur": { start: "#4338ca", mid: "#6366f1", end: "#8b5cf6", accent: "#ddd6fe", icon: "fas fa-file-contract", badge: "Secure Contract Logic" },
  "graphic-designing-zirakpur": { start: "#ec4899", mid: "#f472b6", end: "#8b5cf6", accent: "#fbcfe8", icon: "fas fa-pen-nib", badge: "Creative Brand Assets" },
  "seo-services-zirakpur": { start: "#ea580c", mid: "#f59e0b", end: "#1d4ed8", accent: "#fde68a", icon: "fas fa-chart-line", badge: "Rank Better on Google" },
  "wordpress-website-zirakpur": { start: "#1d4ed8", mid: "#3b82f6", end: "#0f172a", accent: "#bfdbfe", icon: "fab fa-wordpress", badge: "Easy to Manage Websites" },
  "shopify-website-zirakpur": { start: "#047857", mid: "#10b981", end: "#065f46", accent: "#bbf7d0", icon: "fas fa-store", badge: "Conversion Focused Stores" },
  "cms-based-website-zirakpur": { start: "#1e40af", mid: "#3b82f6", end: "#14b8a6", accent: "#bfdbfe", icon: "fas fa-file-lines", badge: "Editable Business Websites" },
  "website-maintenance-zirakpur": { start: "#334155", mid: "#475569", end: "#1d4ed8", accent: "#cbd5e1", icon: "fas fa-screwdriver-wrench", badge: "Support and Ongoing Updates" },
  "ppc-services-zirakpur": { start: "#b91c1c", mid: "#ef4444", end: "#f59e0b", accent: "#fecaca", icon: "fas fa-bullseye", badge: "Google Ads Lead Campaigns" },
  "social-media-marketing-zirakpur": { start: "#7c3aed", mid: "#a855f7", end: "#ec4899", accent: "#e9d5ff", icon: "fas fa-hashtag", badge: "Social Reach and Engagement" },
};

function parsePhpArray(content) {
  const pages = {};
  const slugRegex = /'([a-z0-9-]+)'\s*=>\s*\[/g;
  let match;
  const positions = [];
  while ((match = slugRegex.exec(content)) !== null) {
    if (match[1].includes("zirakpur") || match[1].includes("website") || match[1].includes("marketing")) {
      positions.push({ slug: match[1], index: match.index });
    }
  }
  const topLevel = [];
  let m;
  const re = /^\s*'([a-z0-9-]+)'\s*=>\s*\[/gm;
  while ((m = re.exec(content)) !== null) {
    if (m[1].length > 5 && !["question", "answer"].includes(m[1])) topLevel.push(m[1]);
  }
  const slugs = [...new Set(topLevel)].filter((s) => s.includes("-zirakpur") || s.endsWith("-zirakpur"));
  const uniqueSlugs = [...new Set(
    content.match(/'([a-z]+-[a-z0-9-]+)'\s*=>\s*\[\s*\n\s*'slug'/g)?.map((x) => x.match(/'([^']+)'/)?.[1]) || []
  )];

  for (const slug of uniqueSlugs) {
    const blockRe = new RegExp(`'${slug}'\\s*=>\\s*\\[([\\s\\S]*?)\\n    \\],`, "m");
    const blockMatch = content.match(blockRe);
    if (!blockMatch) continue;
    const block = blockMatch[1];
    const get = (key) => {
      const r = new RegExp(`'${key}'\\s*=>\\s*'([^']*)'`);
      const rm = block.match(r);
      return rm ? rm[1] : "";
    };
    const arr = (key) => {
      const r = new RegExp(`'${key}'\\s*=>\\s*\\[([^\\]]*)\\]`, "s");
      const rm = block.match(r);
      if (!rm) return [];
      return [...rm[1].matchAll(/'([^']*)'/g)].map((x) => x[1]);
    };
    const faq = [];
    const faqMatches = [...block.matchAll(/\['question'\s*=>\s*'([^']*)',\s*'answer'\s*=>\s*'([^']*)'\]/g)];
    for (const fm of faqMatches) faq.push({ question: fm[1], answer: fm[2] });

    pages[slug] = {
      slug: get("slug") || slug,
      service: get("service"),
      pageTitle: get("pageTitle"),
      pageDescription: get("pageDescription"),
      pageKeywords: get("pageKeywords"),
      intro: get("intro"),
      benefits: arr("benefits"),
      deliverables: arr("deliverables"),
      faq,
      related: arr("related"),
      theme: themeMap[slug] || { start: "#1e3a8a", mid: "#2563eb", end: "#0f766e", accent: "#bfdbfe", icon: "fas fa-briefcase", badge: "Professional Service Solutions" },
    };
  }
  return pages;
}

const pages = parsePhpArray(php);
const outPath = path.join(__dirname, "../frontend/src/data/service-landings.json");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(pages, null, 2));
console.log("Exported", Object.keys(pages).length, "service landings to", outPath);
