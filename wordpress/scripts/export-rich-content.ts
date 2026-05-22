/**
 * Export sample content to wordpress/seed-data/*.json
 * Run from repo root: npx tsx wordpress/scripts/export-rich-content.ts
 */
import { writeFileSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import {
  ABOUT_PAGE_BODY,
  ABOUT_PAGE_SEO,
  SERVICES_PAGE_SEO,
  CONTACT_PAGE_SEO,
  SERVICE_LANDING_ENRICHMENTS,
  SAMPLE_BLOG_POSTS,
  SAMPLE_SITE_SEO,
} from "../../frontend/src/data/cws-sample-seo-content";
import { CWS_FULL_HOMEPAGE_SECTIONS } from "../../frontend/src/data/cws-homepage-full-sections";
import type { HomepageSection } from "../../frontend/src/lib/wordpress/types";

const __dirname = dirname(fileURLToPath(import.meta.url));
const seedDir = join(__dirname, "../seed-data");
const root = join(__dirname, "../..");

function buildHomepageSections(): HomepageSection[] {
  return CWS_FULL_HOMEPAGE_SECTIONS;
}

const servicesPageContent = `
<p>Creative Web Solutions is a full-service IT partner for businesses in Zirakpur, Chandigarh, Mohali, and across India. Explore our service landings below — each page is built for local search intent and clear conversion paths.</p>
<h2>How we organise delivery</h2>
<div class="seo-pathways">
<div class="seo-pathway-card">
<h4>Websites &amp; online stores</h4>
<p>Corporate sites, WordPress, Shopify, ecommerce, CMS, and ongoing maintenance.</p>
</div>
<div class="seo-pathway-card">
<h4>Marketing &amp; growth</h4>
<p>SEO, Google Ads, social media, graphic design, and UI/UX for campaigns that convert.</p>
</div>
<div class="seo-pathway-card">
<h4>Software &amp; apps</h4>
<p>Web applications, mobile apps, CRM/ERP, custom software, and industry-specific products.</p>
</div>
</div>
<h2>Service landings by intent</h2>
<p>Each card below links to a location-focused landing page with benefits, deliverables, FAQs, and long-form SEO copy — written for buyers searching <em>near me</em> in the Tricity and across India.</p>
<h2>Delivery principles</h2>
<ul>
<li>Written scope before development starts</li>
<li>Staging URLs for review on real devices</li>
<li>SEO-ready structure, speed, and accessibility baselines</li>
<li>Handover documentation for your marketing or IT team</li>
</ul>
<p>Use <strong>Ask price</strong> in the menu for a written estimate, or <a href="/contact">contact us</a> to speak with a technical lead.</p>
`;

const contactPageContent = `
<p>Share your project goals — we respond within one business day with practical next steps and a ballpark scope. For urgent enquiries, call or WhatsApp the number in the site header.</p>
<h2>What to include in your message</h2>
<ul>
<li>Whether you need a new build, redesign, or ongoing marketing</li>
<li>Target geography (local, national, or international)</li>
<li>Rough timeline and budget range if known</li>
<li>Any systems we must integrate (CRM, payments, inventory)</li>
</ul>
<h2>Response times</h2>
<p>Most enquiries receive a same-day acknowledgement and a next-step plan within one business day. Complex RFPs may need a short discovery call before numbers are shared.</p>
<h2>Visit us</h2>
<p>Office: Zirakpur (Chandigarh Tricity). Phone and WhatsApp are shown in the site header — managed in WordPress <strong>Site Settings</strong>.</p>
<p>Prefer structured options? Use <strong>Request pricing</strong> in the navigation — pick a package or service from the dropdown so we can quote faster.</p>
`;

const portfolioPageContent = `
<p>We ship websites, web applications, and marketing programs for SMEs and growing enterprises. Portfolio highlights are managed in WordPress — add case studies here when ready for publication.</p>
<h2>Typical project types</h2>
<ul>
<li>Corporate and service-business websites with local SEO landings</li>
<li>Ecommerce and catalogue sites with India-friendly checkout flows</li>
<li>Custom dashboards, CRM extensions, and mobile apps</li>
</ul>
<p><a href="/contact">Start a conversation</a> about a project similar to yours.</p>
`;

const coursesPageContent = `
<p>Our training programs focus on job-ready skills: PHP &amp; Laravel, React &amp; Node.js, Python, and full-stack tracks taught by working professionals.</p>
<h2>Who should enrol</h2>
<ul>
<li>Students and graduates seeking practical project experience</li>
<li>Working developers upskilling on modern frameworks</li>
<li>Teams needing structured onboarding on a stack we also use in client work</li>
</ul>
<p>Submit the enrollment form on this page or <a href="/contact">contact us</a> for batch schedules and fees.</p>
`;

writeFileSync(join(seedDir, "homepage-sections.json"), JSON.stringify(buildHomepageSections(), null, 2));
console.log("homepage-sections.json", buildHomepageSections().length, "sections");

writeFileSync(
  join(seedDir, "pages-content.json"),
  JSON.stringify(
    {
      home: { seo: SAMPLE_SITE_SEO },
      about: { seo: ABOUT_PAGE_SEO, content: ABOUT_PAGE_BODY.trim() },
      services: { seo: SERVICES_PAGE_SEO, content: servicesPageContent.trim(), template: "services" },
      contact: { seo: CONTACT_PAGE_SEO, content: contactPageContent.trim(), template: "contact" },
      portfolio: {
        seo: {
          title: "Portfolio | Creative Web Solutions",
          description: "Selected client websites and applications from Creative Web Solutions.",
          keywords: "web development portfolio Chandigarh, IT projects Punjab",
        },
        content: portfolioPageContent.trim(),
      },
      courses: {
        seo: {
          title: "IT Training Courses | Creative Web Solutions Zirakpur",
          description: "PHP, Laravel, React, Node.js, Python, and full-stack training in Zirakpur and Chandigarh.",
          keywords: "IT training Zirakpur, coding institute Chandigarh, full stack course Mohali",
        },
        content: coursesPageContent.trim(),
      },
      blog: {
        seo: {
          title: "Blog | Creative Web Solutions",
          description: "Articles on web development, SEO, and digital strategy for Indian businesses.",
          keywords: "web development blog, SEO tips Chandigarh",
        },
        content: "<p>Practical articles for business owners and marketing teams — managed as WordPress posts below.</p>",
      },
    },
    null,
    2
  )
);
console.log("pages-content.json");

const landings: Record<string, unknown> = {};
for (const [slug, data] of Object.entries(SERVICE_LANDING_ENRICHMENTS)) {
  landings[slug] = {
    pageDescription: data.pageDescription,
    pageKeywords: data.pageKeywords,
    seoBody: data.seoBody,
    extraFaq: data.extraFaq ?? [],
  };
}
writeFileSync(join(seedDir, "landing-seo-bodies.json"), JSON.stringify(landings, null, 2));
console.log("landing-seo-bodies.json", Object.keys(landings).length, "landings");

writeFileSync(join(seedDir, "blog-posts.json"), JSON.stringify(SAMPLE_BLOG_POSTS, null, 2));
console.log("blog-posts.json", SAMPLE_BLOG_POSTS.length, "posts");

const LOCATIONS =
  "Zirakpur, Chandigarh, Mohali, Panchkula, and businesses across Punjab and India searching for IT services near me";

function detailBody(title: string, focus: string): string {
  return `
<h2>${title} — scope and delivery</h2>
<p>Creative Web Solutions provides ${title.toLowerCase()} for organisations in ${LOCATIONS}. Our focus: ${focus}.</p>
<p>Projects include discovery, technical specification, iterative builds on staging, user acceptance testing, and documented handover. We align with your internal IT policies for hosting, data residency, and access control.</p>
<h3>Typical engagement</h3>
<ul>
<li>Kickoff workshop and written scope</li>
<li>Design or architecture sign-off</li>
<li>Sprint-based implementation with demo links</li>
<li>Production deployment and monitoring setup</li>
<li>Optional retainer for enhancements</li>
</ul>
<p>Use <strong>Ask price</strong> in the site menu for a written estimate, or <a href="/contact">contact us</a> to speak with a technical lead.</p>
`;
}

const servicesSeedPath = join(root, "frontend/src/data/service-details.seed.json");
const servicesSeed = JSON.parse(readFileSync(servicesSeedPath, "utf8")) as Record<
  string,
  { title: string; heroSubtitle?: string }
>;
const detailBodies: Record<string, string> = {};
for (const [slug, data] of Object.entries(servicesSeed)) {
  detailBodies[slug] = detailBody(data.title, data.heroSubtitle || "reliable engineering and clear communication");
}
writeFileSync(join(seedDir, "service-detail-bodies.json"), JSON.stringify(detailBodies, null, 2));
console.log("service-detail-bodies.json", Object.keys(detailBodies).length);
