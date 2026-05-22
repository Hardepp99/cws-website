/**
 * @deprecated Not used by the Next.js app at runtime. Content must live in WordPress.
 * Keep for reference or future import scripts only.
 */
import { defaultHomepageSections } from "./site-defaults";
import type {
  BlogPost,
  FaqItem,
  HomepageSection,
  ServiceDetail,
  ServiceLanding,
  SeoMeta,
  WpPage,
} from "@/lib/wordpress/types";

const LOCATIONS =
  "Zirakpur, Chandigarh, Mohali, Panchkula, and businesses across Punjab and India searching for IT services near me";

export const SAMPLE_SITE_SEO: SeoMeta = {
  title:
    "Web Development Company in Chandigarh | Website Developer Zirakpur | Creative Web Solutions",
  description:
    "Creative Web Solutions — website development, mobile apps, ecommerce, digital marketing, SEO, and IT training in Zirakpur, Chandigarh, and Mohali. Request pricing, timelines, and a practical project plan.",
  keywords:
    "web development company Chandigarh, website developer Zirakpur, digital marketing agency Mohali, mobile app development Punjab, ecommerce website India, IT training Chandigarh, best web design company near me",
  canonical: "https://www.cwsindia.online/",
};

/** Long-form homepage blocks (insert after About in fallback homepage). */
export const HOMEPAGE_SEO_SECTIONS: HomepageSection[] = [
  {
    acfFcLayout: "seo_rich",
    badge: "The real problem",
    title: "Your website is busy. Your pipeline is not.",
    content: `
<p>Many businesses in ${LOCATIONS} invest in a new website, run ads for a few months, and still see weak inquiry quality. The site looks acceptable, traffic arrives, but visitors leave without calling, form fills stay low, and sales teams blame "market conditions."</p>
<p><strong>That is rarely a traffic-only problem.</strong> It is usually a combination of unclear positioning, slow pages, weak mobile experience, forms that feel risky, and content that does not match what people actually search for.</p>
<h3>What we see on underperforming sites</h3>
<ul>
<li>Homepage messaging talks about the company, not the buyer's outcome</li>
<li>Service pages are thin — too few words for Google to trust the topic</li>
<li>Core Web Vitals and image weight hurt mobile rankings in local search</li>
<li>No structured internal links between services, locations, and proof sections</li>
<li>Tracking is missing — you cannot tell which page or keyword produces revenue</li>
</ul>
<p>When those gaps are fixed together — not with a one-off redesign — conversion and organic visibility usually move in the same direction.</p>
`,
  },
  {
    acfFcLayout: "seo_rich",
    badge: "Three ways we help",
    title: "Pick the path that matches your stage",
    content: `
<div class="seo-pathways">
<div class="seo-pathway-card">
<h4>Launch &amp; redesign</h4>
<p>New websites, WordPress and headless builds, ecommerce stores, and maintenance for teams that need a credible digital front door.</p>
<p><a href="/website-development-zirakpur">Website development</a> · <a href="/ecommerce-website-zirakpur">Ecommerce</a> · <a href="/wordpress-website-zirakpur">WordPress</a></p>
</div>
<div class="seo-pathway-card">
<h4>Products &amp; automation</h4>
<p>Web applications, CRM/ERP modules, mobile apps, and integrations when spreadsheets and manual follow-ups are slowing growth.</p>
<p><a href="/web-application">Web applications</a> · <a href="/mobile-app-development-zirakpur">Mobile apps</a> · <a href="/crm-development-zirakpur">CRM development</a></p>
</div>
<div class="seo-pathway-card">
<h4>Growth &amp; visibility</h4>
<p>SEO, paid campaigns, social content, and landing pages aligned to search intent — so marketing spend has a page worth sending traffic to.</p>
<p><a href="/digital-marketing-zirakpur">Digital marketing</a> · <a href="/seo-services-zirakpur">SEO services</a> · <a href="/ppc-services-zirakpur">PPC</a></p>
</div>
</div>
<p class="mt-3">Not sure which bucket fits? <a href="/contact">Request a short discovery call</a> or use <strong>Ask price</strong> in the menu for a written estimate.</p>
`,
  },
  {
    acfFcLayout: "seo_rich",
    badge: "Local search",
    title: "Built for how people search in Tricity and beyond",
    content: `
<p>Search behaviour in our region is intensely local: "website developer in Chandigarh," "digital marketing agency near me," "ecommerce website company Mohali," and dozens of service + city combinations. Your site should answer those queries with dedicated pages — not one generic Services paragraph.</p>
<p>We plan <strong>location-aware service landings</strong>, FAQ blocks, metadata, and internal links so each offer can rank on its own intent while reinforcing your main brand site. That is the same discipline we apply to national and international clients who need country- or industry-specific landing pages.</p>
<p>Every engagement includes baseline technical SEO: crawlable headings, canonical URLs, sitemap and robots configuration, schema where appropriate, and performance budgets so mobile users in India on 4G still get a fast first paint.</p>
`,
  },
];

export const HOMEPAGE_HERO_COPY = {
  eyebrow: "Web · Apps · Marketing · Training · India",
  headline: "Your digital presence should earn trust before the first call",
  headlineParts: [
    { text: "Your", tone: "white" as const },
    { text: "digital", tone: "blue" as const },
    { text: "presence", tone: "royal" as const },
    { text: "should earn", tone: "white" as const },
    { text: "trust", tone: "green" as const },
    { text: "before the first call", tone: "orange" as const },
  ],
  subheadline:
    "We design and ship websites, web apps, mobile products, and marketing programs for businesses in Zirakpur, Chandigarh, Mohali, and across India — with clear scope, measurable milestones, and maintainable code your team can own.",
};

export const ABOUT_PAGE_SEO: SeoMeta = {
  title: "About Creative Web Solutions | Web Development & IT Training Company India",
  description:
    "Meet Creative Web Solutions — 15+ years delivering websites, applications, digital marketing, and professional IT courses from Zirakpur. Engineering-led delivery, transparent communication, long-term support.",
  keywords:
    "about Creative Web Solutions, web development company India, IT company Zirakpur, software team Chandigarh, digital agency Punjab",
};

export const ABOUT_PAGE_BODY = `
<p>Creative Web Solutions is a technology partner for organisations that need more than a brochure website. We combine user-centred design, full-stack engineering, and growth marketing so your digital stack works as one system — not a collection of disconnected vendors.</p>
<h2>What we believe</h2>
<p>Buyers decide in seconds. If your site is slow, vague, or hard to use on mobile, you pay for traffic that never becomes a conversation. We optimise for clarity first: who you help, what changes after engagement, and the single next step you want a visitor to take.</p>
<p>Our delivery model is milestone-based. You see wireframes, staging links, and test plans before production cutover. Documentation and handover matter — especially when you have an in-house team who will maintain content or extend features later.</p>
<h2>Capabilities under one roof</h2>
<ul>
<li><strong>Web:</strong> corporate sites, landing pages, WordPress, Shopify, headless front ends</li>
<li><strong>Products:</strong> dashboards, SaaS modules, CRM/ERP extensions, API integrations</li>
<li><strong>Mobile:</strong> Android, iOS, and cross-platform apps tied to your backend</li>
<li><strong>Growth:</strong> SEO, Google Ads, social campaigns, analytics, conversion tuning</li>
<li><strong>Training:</strong> job-oriented courses in PHP, Laravel, React, Node.js, Python, and full-stack tracks</li>
</ul>
<h2>Who we work with</h2>
<p>Manufacturers, retailers, clinics, schools, startups, and service firms across Punjab and other Indian states — plus international clients who need offshore execution with overlap on IST time zones. If you are evaluating agencies, compare our process: discovery depth, written scope, realistic timelines, and post-launch support SLAs.</p>
<h2>How we work</h2>
<ol>
<li><strong>Discovery:</strong> goals, audience, competitors, integrations, and success metrics</li>
<li><strong>Scope:</strong> written deliverables, timeline, and approval checkpoints</li>
<li><strong>Design &amp; build:</strong> staging links, responsive QA, and performance checks</li>
<li><strong>Launch:</strong> DNS, SSL, analytics, Search Console, and handover docs</li>
<li><strong>Growth:</strong> optional SEO, ads, and maintenance retainers</li>
</ol>
<h2>Why clients stay with us</h2>
<ul>
<li>Single accountable team instead of fragmented freelancers</li>
<li>Transparent pricing conversations — use <strong>Ask price</strong> for package-led quotes</li>
<li>Code and content you can maintain internally after training</li>
<li>Support SLAs for fixes, backups, and security patches post-launch</li>
</ul>
<h2>Training &amp; talent</h2>
<p>Beyond client delivery we run job-oriented IT programs: PHP &amp; Laravel, React &amp; Node.js, Python, and full-stack tracks from our Zirakpur base — so graduates and teams learn the same stacks we ship in production.</p>
<h2>Office &amp; coverage</h2>
<p>We serve Zirakpur, Chandigarh, Mohali, Panchkula, and clients across Punjab and India, plus remote engagements with IST-friendly overlap.</p>
<p><a href="/services">Explore services</a> · <a href="/courses">View courses</a> · <a href="/contact">Start a project conversation</a></p>
`;

export const SERVICES_PAGE_SEO: SeoMeta = {
  title: "IT Services in India | Web, Apps, Marketing & Software | Creative Web Solutions",
  description:
    "Full-service IT partner: website development, ecommerce, mobile apps, UI/UX, SEO, PPC, custom software, CRM/ERP, blockchain, and professional training. Serving Zirakpur, Chandigarh, Mohali, and India-wide clients.",
  keywords:
    "IT services India, web development services, mobile app company, digital marketing agency, custom software development, IT training institute",
};

export const CONTACT_PAGE_SEO: SeoMeta = {
  title: "Contact Creative Web Solutions | Web Development Quote Zirakpur Chandigarh",
  description:
    "Contact Creative Web Solutions for website, app, and marketing projects. Office in Zirakpur. Phone +91-7015969967. Email info@cwsindia.online. Ask for pricing or a discovery call.",
  keywords:
    "contact web development company, website quote Chandigarh, IT company phone Zirakpur, digital agency contact Mohali",
};

type LandingEnrichment = {
  intro?: string;
  pageDescription?: string;
  pageKeywords?: string;
  seoBody?: string;
  extraFaq?: FaqItem[];
};

function landingBody(
  service: string,
  focus: string,
  audience: string,
  outcomes: string[],
): string {
  const list = outcomes.map((o) => `<li>${o}</li>`).join("");
  return `
<h2>Professional ${service} for ${audience}</h2>
<p>Creative Web Solutions delivers ${service.toLowerCase()} with a focus on ${focus}. We work with ${LOCATIONS} — and with distributed teams that need reliable communication, written scope, and production discipline.</p>
<h3>Outcomes clients expect</h3>
<ul>${list}</ul>
<p>We start with a short discovery: current site or product, competitors you respect, keywords that matter, integrations (CRM, payments, inventory), and who will maintain content after launch. That keeps estimates honest and prevents "surprise scope" mid-project.</p>
<h3>Technical and SEO standards</h3>
<p>Semantic HTML, accessible forms, mobile-first layouts, compressed media, caching, and monitoring hooks are included by default — not sold as optional extras. For marketing sites we map service + location pages, FAQ schema where useful, and internal links so authority flows to money pages.</p>
<h3>Engagement options</h3>
<p>Fixed-scope projects, phased rollouts (design → build → launch → growth), and retainers for maintenance or ongoing SEO/PPC. Use <strong>Ask price</strong> on our site for a written ballpark, or <a href="/contact">contact us</a> for a call with a technical lead.</p>
`;
}

/** Per-slug enrichment — original copy, SEO-heavy, no external brands or client names. */
export const SERVICE_LANDING_ENRICHMENTS: Record<string, LandingEnrichment> = {
  "website-development-zirakpur": {
    pageDescription:
      "Website development in Zirakpur and Chandigarh: responsive business sites, fast Core Web Vitals, SEO-ready architecture, lead forms, and CMS training. Serving Mohali, Panchkula, and India-wide clients.",
    pageKeywords:
      "website development Zirakpur, website development Chandigarh, website developer near me, business website company Mohali, corporate website Punjab, web design agency Tricity",
    seoBody: landingBody(
      "Website Development",
      "lead generation and local search visibility",
      "SMEs, manufacturers, clinics, and professional services",
      [
        "Clear service pages that match how buyers search in your city",
        "Mobile layouts that work on mid-range Android devices",
        "Contact and WhatsApp-friendly inquiry flows",
        "On-page SEO foundations and XML sitemap setup",
        "Handover documentation for your marketing team",
      ],
    ),
    extraFaq: [
      {
        question: "How long does a business website take to launch?",
        answer:
          "Typical corporate sites run 3–6 weeks depending on page count, content readiness, and approval speed. We share a milestone calendar before work starts.",
      },
      {
        question: "Do you provide content writing?",
        answer:
          "We structure pages for SEO and can draft technical outlines; you may supply final industry copy or we can recommend partners for long-form writing.",
      },
    ],
  },
  "digital-marketing-zirakpur": {
    pageDescription:
      "Digital marketing agency in Zirakpur: SEO, Google Ads, social campaigns, landing pages, and monthly reporting for Chandigarh, Mohali, and regional lead generation.",
    pageKeywords:
      "digital marketing Zirakpur, digital marketing agency Chandigarh, SEO company Mohali, Google Ads Punjab, online marketing near me",
    seoBody: landingBody(
      "Digital Marketing",
      "measurable leads and search rankings",
      "local retailers, B2B suppliers, educators, and service brands",
      [
        "Keyword maps aligned to real search intent",
        "Landing pages that match ad and organic promises",
        "Conversion tracking and call/form attribution",
        "Monthly dashboards with actions, not vanity metrics",
        "Coordination with your website team for on-page fixes",
      ],
    ),
    extraFaq: [
      {
        question: "Can you market only in Zirakpur or also Chandigarh?",
        answer:
          "We structure campaigns and location pages for any geography you serve — city, district, or national targeting.",
      },
    ],
  },
  "ecommerce-website-zirakpur": {
    pageDescription:
      "Ecommerce website development in Zirakpur: catalogues, cart, checkout, payment gateways, shipping rules, and SEO for product categories. Chandigarh and Mohali retailers welcome.",
    pageKeywords:
      "ecommerce website Zirakpur, online store development Chandigarh, Shopify developer Mohali, WooCommerce Punjab, ecommerce SEO India",
    seoBody: landingBody(
      "Ecommerce Development",
      "online sales and operational efficiency",
      "retailers, wholesalers, and D2C brands",
      [
        "Product and category templates built for SEO",
        "Payment and COD workflows common in India",
        "Admin training for catalogue updates",
        "Order notification and basic inventory hooks",
        "Performance tuning for image-heavy catalogues",
      ],
    ),
  },
  "mobile-app-development-zirakpur": {
    pageDescription:
      "Mobile app development in Zirakpur: Android, iOS, and cross-platform apps with APIs, push notifications, and admin panels. Serving Chandigarh, Mohali, and product startups.",
    pageKeywords:
      "mobile app development Zirakpur, app developer Chandigarh, Android iOS company Mohali, cross platform app Punjab",
    seoBody: landingBody(
      "Mobile App Development",
      "field teams, customers, and subscription products",
      "logistics, healthcare, education, and SaaS founders",
      [
        "Native or cross-platform choices explained in plain language",
        "Secure authentication and role-based access",
        "Offline-friendly flows where connectivity is weak",
        "App store submission support",
        "Backend APIs documented for future vendors",
      ],
    ),
  },
  "seo-services-zirakpur": {
    pageDescription:
      "SEO services in Zirakpur: technical audits, content planning, local SEO, link earning guidance, and monthly ranking reports for Chandigarh and Mohali businesses.",
    pageKeywords:
      "SEO services Zirakpur, SEO company Chandigarh, local SEO Mohali, search engine optimisation Punjab, website ranking India",
    seoBody: landingBody(
      "SEO Services",
      "sustainable organic traffic",
      "businesses tired of paying only for ads",
      [
        "Technical crawl fixes and indexation hygiene",
        "Content briefs tied to keyword difficulty",
        "Google Business Profile alignment",
        "Internal linking and cannibalisation cleanup",
        "Transparent reporting on rankings and clicks",
      ],
    ),
  },
  "wordpress-website-zirakpur": {
    pageDescription:
      "WordPress website development in Zirakpur: custom themes, plugin vetting, speed optimisation, security hardening, and editor training for Chandigarh teams.",
    pageKeywords:
      "WordPress development Zirakpur, WordPress company Chandigarh, WordPress SEO Mohali, business WordPress site Punjab",
    seoBody: landingBody(
      "WordPress Development",
      "editor-friendly sites without plugin chaos",
      "marketing teams who update content weekly",
      [
        "Lean theme architecture",
        "Staging before production updates",
        "Backup and update policy",
        "Role-based admin access",
        "Migration from legacy builders when needed",
      ],
    ),
  },
  "custom-software-development-zirakpur": {
    pageDescription:
      "Custom software development in Zirakpur: workflow automation, dashboards, integrations, and scalable backends for Chandigarh and Mohali enterprises.",
    pageKeywords:
      "custom software Zirakpur, software company Chandigarh, business automation Mohali, bespoke ERP Punjab",
    seoBody: landingBody(
      "Custom Software",
      "replacing spreadsheets and duplicate entry",
      "operations, finance, and customer service leaders",
      [
        "Requirements workshops with decision makers",
        "Phased delivery with usable interim releases",
        "API-first design for future modules",
        "Audit logs and permissions",
        "Deployment on cloud or on-prem per policy",
      ],
    ),
  },
  "ui-ux-design-zirakpur": {
    pageDescription:
      "UI/UX design in Zirakpur: user research, wireframes, design systems, and prototypes for web and mobile products in Chandigarh and Mohali.",
    pageKeywords:
      "UI UX design Zirakpur, UX agency Chandigarh, product design Mohali, website UI designer Punjab",
    seoBody: landingBody(
      "UI/UX Design",
      "clarity, trust, and conversion on every screen",
      "product owners and marketing leads launching new experiences",
      [
        "User flows mapped before visual design",
        "Accessible colour and typography choices",
        "Component libraries for faster dev handoff",
        "Mobile-first layouts tested on real devices",
        "Iteration from analytics and user feedback",
      ],
    ),
  },
  "crm-development-zirakpur": {
    pageDescription:
      "CRM development in Zirakpur: lead pipelines, follow-up automation, sales dashboards, and integrations for Chandigarh B2B teams.",
    pageKeywords:
      "CRM development Zirakpur, custom CRM Chandigarh, sales CRM Mohali, lead management software Punjab",
    seoBody: landingBody(
      "CRM Development",
      "fewer dropped leads and clearer sales visibility",
      "sales managers and inside sales teams",
      [
        "Pipeline stages aligned to your real process",
        "Email and WhatsApp touchpoint logging",
        "Role-based views for reps and managers",
        "Reports on conversion and response time",
        "Integration with website forms and ads",
      ],
    ),
  },
  "erp-hrm-software-zirakpur": {
    pageDescription:
      "ERP and HRM software in Zirakpur: payroll, attendance, inventory, and operations modules for growing companies in Chandigarh and Punjab.",
    pageKeywords:
      "ERP software Zirakpur, HRM software Chandigarh, payroll system Mohali, business ERP Punjab",
    seoBody: landingBody(
      "ERP & HRM Software",
      "single source of truth for operations and people",
      "HR, finance, and operations directors",
      [
        "Modular rollout — start with highest pain module",
        "Attendance and leave policies configurable",
        "Inventory and purchase linked to finance",
        "Exportable reports for auditors",
        "Training for admin users",
      ],
    ),
  },
  "blockchain-development-zirakpur": {
    pageDescription:
      "Blockchain development in Zirakpur: dApps, wallets, token logic, and smart contract architecture with security review for Indian startups.",
    pageKeywords:
      "blockchain development Zirakpur, blockchain company Chandigarh, Web3 developer Mohali, dApp development India",
    seoBody: landingBody(
      "Blockchain Development",
      "auditable on-chain logic and maintainable off-chain services",
      "founders building tokenised products or Web3 utilities",
      [
        "Architecture review before coding",
        "Testnet deployment and monitoring",
        "Wallet and transaction UX guidance",
        "Documentation for auditors and partners",
        "No unrealistic promises — clear risk disclosure",
      ],
    ),
  },
  "smart-contract-development-zirakpur": {
    pageDescription:
      "Smart contract development in Zirakpur: Solidity and audit-ready contracts for DeFi, NFT, and utility token projects.",
    pageKeywords:
      "smart contract development Zirakpur, Solidity developer Chandigarh, token contract Mohali, smart contract audit India",
    seoBody: landingBody(
      "Smart Contract Development",
      "secure, test-covered contract logic",
      "Web3 product teams needing production-grade code",
      [
        "Unit and integration tests on testnets",
        "Upgrade patterns explained where applicable",
        "Gas-aware design choices",
        "Deployment runbooks",
        "Coordination with external auditors when required",
      ],
    ),
  },
  "graphic-designing-zirakpur": {
    pageDescription:
      "Graphic design in Zirakpur: brand collateral, social creatives, brochures, and campaign assets for Chandigarh and Mohali businesses.",
    pageKeywords:
      "graphic design Zirakpur, branding agency Chandigarh, social media creatives Mohali, print design Punjab",
    seoBody: landingBody(
      "Graphic Design",
      "consistent visual identity across print and digital",
      "marketing teams needing fast-turn campaign assets",
      [
        "Brand-aligned templates for social",
        "Print-ready PDFs with bleed and margins",
        "Source files for future edits",
        "Revision rounds defined in scope",
        "Coordination with web team for landing pages",
      ],
    ),
  },
  "shopify-website-zirakpur": {
    pageDescription:
      "Shopify website development in Zirakpur: theme setup, product catalogues, apps, and conversion tuning for D2C brands in Chandigarh.",
    pageKeywords:
      "Shopify developer Zirakpur, Shopify store Chandigarh, ecommerce Shopify Mohali, online store setup Punjab",
    seoBody: landingBody(
      "Shopify Development",
      "fast store launch with scalable merchandising",
      "D2C and retail brands moving online",
      [
        "Theme selection or custom sections",
        "Payment and shipping for India",
        "Collection and filter UX",
        "Speed and image optimisation",
        "Staff training for daily updates",
      ],
    ),
  },
  "cms-based-website-zirakpur": {
    pageDescription:
      "CMS-based websites in Zirakpur: editor-friendly content systems, structured pages, and SEO for teams in Chandigarh and Mohali.",
    pageKeywords:
      "CMS website Zirakpur, content management Chandigarh, business CMS Mohali, editable website Punjab",
    seoBody: landingBody(
      "CMS Website Development",
      "marketing teams updating content without developers",
      "publishers, schools, and service directories",
      [
        "Structured content types",
        "Preview before publish",
        "Media library organisation",
        "Role-based editor access",
        "Migration from static HTML when needed",
      ],
    ),
  },
  "website-maintenance-zirakpur": {
    pageDescription:
      "Website maintenance in Zirakpur: security updates, backups, uptime monitoring, and content support for Chandigarh business sites.",
    pageKeywords:
      "website maintenance Zirakpur, website support Chandigarh, WordPress maintenance Mohali, site care plan Punjab",
    seoBody: landingBody(
      "Website Maintenance",
      "uptime, security patches, and predictable monthly care",
      "businesses without in-house DevOps",
      [
        "Scheduled backups and restore tests",
        "Plugin and core update policy",
        "Malware scan and hardening",
        "Small content and banner updates",
        "Monthly health report",
      ],
    ),
  },
  "ppc-services-zirakpur": {
    pageDescription:
      "PPC services in Zirakpur: Google Ads, search and display campaigns, landing page alignment, and ROI reporting for Chandigarh leads.",
    pageKeywords:
      "PPC services Zirakpur, Google Ads Chandigarh, paid search Mohali, adwords agency Punjab",
    seoBody: landingBody(
      "PPC Services",
      "paid traffic that lands on pages built to convert",
      "businesses with clear offer and geography",
      [
        "Keyword and negative keyword structure",
        "Conversion tracking on forms and calls",
        "Ad copy tests tied to landing headlines",
        "Budget pacing and seasonality",
        "Monthly optimisation notes",
      ],
    ),
  },
  "social-media-marketing-zirakpur": {
    pageDescription:
      "Social media marketing in Zirakpur: content calendars, creatives, community management, and paid social for Chandigarh brands.",
    pageKeywords:
      "social media marketing Zirakpur, SMM agency Chandigarh, Instagram marketing Mohali, Facebook ads Punjab",
    seoBody: landingBody(
      "Social Media Marketing",
      "consistent brand presence and measurable engagement",
      "retail, education, and local service brands",
      [
        "Platform-specific content plans",
        "Creative production or templates",
        "Community response guidelines",
        "Paid boost strategy where relevant",
        "Monthly performance summary",
      ],
    ),
  },
};

export const SAMPLE_BLOG_POSTS: BlogPost[] = [
  {
    slug: "web-development-trends-2025",
    title: "Web Development Trends 2025: What Indian SMBs Should Prioritise",
    excerpt:
      "Performance, headless CMS, and conversion-focused design — practical trends for Chandigarh and Punjab businesses planning a site refresh.",
    date: "2025-01-15",
    categories: ["Web Development"],
    featured: true,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
    content: `
<p>Small and mid-size businesses in Punjab no longer compete only on price — buyers compare websites on mobile speed, clarity of offer, and trust signals before they call. In 2025, three technical choices matter most for that first impression.</p>
<h2>Performance is part of branding</h2>
<p>Heavy page builders and unoptimised images still dominate many local sites. Moving to lean templates, modern image formats, and caching routinely improves both rankings and form submissions — especially on 4G connections.</p>
<h2>Structured content beats one long Services page</h2>
<p>Separate landings for website development, ecommerce, and marketing in each city you serve give Google clear relevance signals. Internal linking between those pages strengthens your main domain without keyword stuffing.</p>
<h2>Headless when you need speed and flexibility</h2>
<p>Marketing teams that publish weekly benefit from decoupled front ends. You keep a fast public site while editors work in a familiar CMS. The upfront cost is higher, but change cycles are cheaper over two to three years.</p>
<p>Planning a rebuild? <a href="/contact">Talk to our team</a> about scope and timeline.</p>
`,
    seo: {
      title: "Web Development Trends 2025 | Creative Web Solutions Blog",
      description:
        "Practical web development trends for Indian SMBs: performance, SEO structure, and headless options explained for business owners.",
      keywords: "web development trends 2025, website redesign India, headless CMS SMB",
    },
  },
  {
    slug: "seo-tips-local-business",
    title: "Local SEO Tips for Zirakpur, Chandigarh, and Mohali Businesses",
    excerpt:
      "How to improve Google visibility without spammy tactics — Google Business Profile, location pages, and on-page basics.",
    date: "2025-02-01",
    categories: ["SEO"],
    featured: true,
    image: "https://images.unsplash.com/photo-1432888622747-4eb9a8f2d523?w=800&q=80",
    content: `
<p>Local search is how most service businesses in Tricity acquire leads. You do not need thousands of backlinks on day one — you need consistency between what you claim online and what your site proves.</p>
<h2>Align your Google Business Profile with your website</h2>
<p>Categories, service areas, hours, and phone number should match your contact page exactly. Add photos of real work and update posts monthly so the profile looks active.</p>
<h2>Build location + service pages</h2>
<p>One page for "digital marketing in Mohali" and another for "website development in Zirakpur" beats stuffing every city name into a single paragraph. Each page should answer FAQs buyers actually ask.</p>
<h2>Fix technical blockers first</h2>
<p>Broken mobile layout, slow LCP, and missing meta descriptions waste ad spend and organic clicks alike. Run a technical audit before scaling content or PPC.</p>
<p>Need help executing this? See our <a href="/seo-services-zirakpur">SEO services</a> or request a quote via <a href="/contact">contact</a>.</p>
`,
    seo: {
      title: "Local SEO Tips Zirakpur Chandigarh | Creative Web Solutions",
      description:
        "Local SEO checklist for Punjab businesses: GBP optimisation, location landing pages, and technical fixes before scaling ads.",
      keywords: "local SEO Zirakpur, SEO Chandigarh, Google Business Profile Mohali",
    },
  },
  {
    slug: "choose-web-development-partner",
    title: "How to Choose a Web Development Partner in Punjab",
    excerpt:
      "Questions to ask before signing — scope, ownership, staging access, and post-launch support.",
    date: "2025-03-10",
    categories: ["Web Development", "Business"],
    featured: false,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    content: `
<p>Choosing a vendor is less about the lowest quote and more about risk: who owns the code, how changes are approved, and what happens when you need urgent fixes after launch.</p>
<h2>Demand a written scope</h2>
<p>Page list, integrations, content responsibility, timeline, and payment milestones should be documented. Verbal promises do not survive staff turnover on either side.</p>
<h2>Insist on staging and version control</h2>
<p>You should review work on a staging URL before production. Source code in a repository you can access (or escrow) prevents lock-in.</p>
<h2>Clarify SEO and content ownership</h2>
<p>Some agencies deliver design only; others include metadata, schema, and analytics. Know who writes long-form service copy and who maintains it after go-live.</p>
<p>Creative Web Solutions uses milestone delivery with training handover. <a href="/about">Read about our process</a>.</p>
`,
    seo: {
      title: "Choose Web Development Partner Punjab | Creative Web Solutions",
      description:
        "Guide for selecting a web development company in Punjab: scope, staging, code ownership, SEO, and support questions to ask.",
      keywords: "web development company Punjab, hire website developer Chandigarh",
    },
  },
];

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

const SERVICE_DETAIL_BODIES: Record<string, string> = {
  "web-application": detailBody(
    "Web application development",
    "scalable dashboards, SaaS modules, and API-first backends",
  ),
  "logo-design": detailBody(
    "Logo and brand identity design",
    "memorable marks that work in digital and print",
  ),
  "website-redesign": detailBody(
    "Website redesign",
    "modern UX, faster Core Web Vitals, and stronger conversion paths",
  ),
  "desktop-application": detailBody(
    "Desktop application development",
    "offline-capable tools for internal workflows",
  ),
  "school-management-system": detailBody(
    "School management software",
    "admissions, fees, attendance, and parent communication in one system",
  ),
};

export function enrichServiceDetail(detail: ServiceDetail): ServiceDetail {
  const content = SERVICE_DETAIL_BODIES[detail.slug] ?? detailBody(detail.title, "reliable engineering and clear communication");
  const keywords = `${detail.title.toLowerCase()}, ${detail.title.toLowerCase()} Chandigarh, ${detail.title.toLowerCase()} Zirakpur, IT services Punjab`;
  return {
    ...detail,
    content: detail.content ?? content,
    seo: {
      ...detail.seo,
      keywords: detail.seo.keywords ?? keywords,
      description:
        detail.seo.description ||
        `${detail.title} by Creative Web Solutions — ${detail.heroSubtitle}`,
    },
  };
}

/** Apply enrichment to any landing slug; generic fallback for unlisted slugs. */
export function enrichServiceLanding(landing: ServiceLanding): ServiceLanding {
  const extra = SERVICE_LANDING_ENRICHMENTS[landing.slug];
  const genericBody = landingBody(
    landing.service,
    "reliable delivery and maintainable architecture",
    "businesses in Punjab and across India",
    [
      "Written scope and timeline before build starts",
      "Staging environment for review",
      "SEO-aware page structure",
      "Training for your staff where needed",
      "Post-launch support options",
    ],
  );

  return {
    ...landing,
    intro: extra?.intro ?? landing.intro,
    pageDescription: extra?.pageDescription ?? landing.pageDescription,
    pageKeywords: extra?.pageKeywords ?? landing.pageKeywords,
    seoBody: extra?.seoBody ?? genericBody,
    faq: [...landing.faq, ...(extra?.extraFaq ?? [])],
  };
}

export function buildSampleHomepageSections(base: HomepageSection[]): HomepageSection[] {
  const hero = base.find((s) => s.acfFcLayout === "hero_slider");
  const rest = base.filter((s) => s.acfFcLayout !== "hero_slider");
  const aboutIdx = rest.findIndex((s) => s.acfFcLayout === "about");
  const before = aboutIdx >= 0 ? rest.slice(0, aboutIdx + 1) : rest;
  const after = aboutIdx >= 0 ? rest.slice(aboutIdx + 1) : [];

  const heroSection = hero
    ? {
        ...hero,
        ...HOMEPAGE_HERO_COPY,
      }
    : null;

  return [...(heroSection ? [heroSection] : []), ...before, ...HOMEPAGE_SEO_SECTIONS, ...after];
}

export function buildFallbackHomepage(): WpPage {
  return {
    slug: "home",
    title: "Creative Web Solutions",
    seo: SAMPLE_SITE_SEO,
    sections: buildSampleHomepageSections(defaultHomepageSections),
  };
}
