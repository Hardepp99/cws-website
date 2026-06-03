#!/usr/bin/env node
import mysql from "mysql2/promise";

const db = {
  host: process.env.MYSQL_HOST || "127.0.0.1",
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "cws_cms",
};

const siteSettings = {
  phone: "+91-7015969967",
  email: "info@cwsindia.online",
  address: "#313, 3rd Floor, D & E Block\nVIP Road, Zirakpur\nPunjab 140603, India",
  logoUrl: "/assets/images/cws-logo.svg",
  logoWhiteUrl: "/assets/images/cws-logo.svg",
  primaryColor: "#0057FF",
  secondaryColor: "#0088FF",
  footerText:
    "We are a leading web development company in India, providing innovative digital solutions to businesses worldwide.",
  facebook: "https://www.facebook.com/profile.php?id=61565017048983",
  linkedin: "https://www.linkedin.com/company/creative-websolutions/",
  instagram: "https://www.instagram.com/creativeweb_solutions?igsh=ZHFvZTJlZmIyaHdx",
  footerCompanyTitle: "Company",
  footerServicesTitle: "Services",
  footerProductsTitle: "Products",
};

const menus = {
  primary: [
    { label: "Home", href: "/" },
    {
      label: "About",
      href: "/about",
      children: [
        { label: "About Us", href: "/about" },
        { label: "Our Team", href: "/about#team" },
        { label: "Careers", href: "/about#careers" },
      ],
    },
    {
      label: "Services",
      href: "/services",
      children: [
        { label: "Website Development", href: "/website-development-zirakpur", icon: "fas fa-globe" },
        { label: "Web Application", href: "/web-application", icon: "fas fa-window-restore" },
        { label: "Mobile App Development", href: "/mobile-app-development-zirakpur", icon: "fas fa-mobile-alt" },
        { label: "Digital Marketing", href: "/digital-marketing-zirakpur", icon: "fas fa-bullhorn" },
        { label: "UI/UX Design", href: "/ui-ux-design-zirakpur", icon: "fas fa-paint-brush" },
        { label: "Blockchain Development", href: "/blockchain-development-zirakpur", icon: "fas fa-cubes" },
      ],
    },
    {
      label: "Pages",
      href: "#",
      children: [
        { label: "Portfolio", href: "/portfolio" },
        { label: "Blog", href: "/blog" },
      ],
    },
    { label: "Contact", href: "/contact" },
  ],
  footer: [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/contact" },
  ],
  footer_services: [],
  footer_products: [],
};

/** Agency homepage order — sync with src/data/cws-homepage-modern-sections.ts */
const homepageSections = [
  {
    acfFcLayout: "hero_slider",
    eyebrow: "Global Web · Mobile · Digital Marketing Agency",
    headline: "Turn visitors into paying customers",
    subheadline:
      "Creative Web Solutions designs, builds, and markets high-performing websites and apps for brands that sell worldwide — one team from first sketch to measurable growth.",
    headlineParts: [
      { text: "paying", tone: "green" },
      { text: "customers", tone: "blue" },
    ],
    ctaPrimary: { label: "Get free proposal", href: "#ask-price" },
    ctaSecondary: { label: "View our work", href: "/portfolio" },
    slides: [
      { image: { url: "/assets/images/hero1.png" } },
      { image: { url: "/assets/images/hero2.png" } },
      { image: { url: "/assets/images/hero3.png" } },
    ],
    heroVisual: "svg",
    personImage: "/assets/images/hero2.png",
    personImageAlt: "Designer building websites and digital products",
    stats: [
      { icon: "fas fa-project-diagram", count: 549, label: "Projects delivered", tone: "blue" },
      { icon: "fas fa-users", count: 320, label: "Clients worldwide", tone: "green" },
      { icon: "fas fa-award", count: 15, label: "Years in business", tone: "royal" },
    ],
    gmbRating: 4.9,
    gmbReviewCount: "120+",
    gmbReviews: [
      {
        author: "Amit K.",
        rating: 5,
        text: "Website ekdum solid hai — fast load, clean design. Leads WhatsApp pe aa rahi hain regularly.",
        ago: "3 weeks ago",
      },
      {
        author: "Priya Sharma",
        rating: 5,
        text: "SEO and paid campaigns aligned — we see which pages drive leads.",
        ago: "1 month ago",
      },
      {
        author: "Vikram S.",
        rating: 5,
        text: "Ecommerce + payment gateway setup smooth tha. Content delay hua par delivery professional thi.",
        ago: "2 months ago",
      },
    ],
    marqueeItems: [
      { letter: "W", title: "Website design", href: "/ui-ux-design-zirakpur" },
      { letter: "D", title: "Website development", href: "/website-development-zirakpur" },
      { letter: "M", title: "Mobile apps", href: "/mobile-app-development-zirakpur" },
      { letter: "S", title: "SEO services", href: "/seo-services-zirakpur" },
      { letter: "A", title: "Digital marketing", href: "/digital-marketing-zirakpur" },
    ],
  },
  {
    acfFcLayout: "trust_badges",
    sectionTheme: "light",
    badge: "Trusted by businesses",
    title: "Proof you can plan around",
    subtitle: "Local delivery, clear communication, and results you can measure.",
    items: [
      { icon: "fab fa-google", title: "4.9★ client rating", desc: "Rated for delivery, communication, and results", tone: "blue" },
      { icon: "fas fa-project-diagram", title: "549+ projects", desc: "Websites, apps, and campaigns shipped", tone: "green" },
      { icon: "fas fa-globe-asia", title: "10+ regions", desc: "India and international clients", tone: "purple" },
      { icon: "fas fa-headset", title: "Dedicated support", desc: "English & Hindi — fast replies", tone: "orange" },
    ],
  },
  {
    acfFcLayout: "services_grid",
    sectionTheme: "dark",
    badge: "Services",
    title: "What we deliver",
    subtitle: "Design, engineering, and growth under one roof — turn traffic into qualified enquiries anywhere you sell.",
    items: [
      { icon: "fas fa-paint-brush", title: "Web design", href: "/ui-ux-design-zirakpur", tone: "pink" },
      { icon: "fas fa-code", title: "Website development", href: "/website-development-zirakpur", tone: "blue" },
      { icon: "fas fa-mobile-alt", title: "Mobile apps", href: "/mobile-app-development-zirakpur", tone: "green" },
      { icon: "fas fa-bullhorn", title: "Digital marketing", href: "/digital-marketing-zirakpur", tone: "orange" },
    ],
  },
  {
    acfFcLayout: "portfolio",
    sectionTheme: "dark",
    badge: "Results",
    title: "Work that earns trust before the first call",
    subtitle: "Websites, apps, and campaigns for healthcare, retail, B2B, and startups worldwide.",
    ctaLabel: "See all case studies",
    ctaHref: "/portfolio",
  },
  {
    acfFcLayout: "why_codify",
    sectionTheme: "light",
    badge: "Why Creative Web Solutions",
    title: "Built to convert visitors into enquiries",
    subtitle: "One team for design, development, and marketing.",
    cards: [
      { icon: "fas fa-bullseye", title: "Strategy first", description: "User journeys and CTAs before pixels.", number: "01" },
      { icon: "fas fa-laptop-code", title: "Modern engineering", description: "React, Next.js, WordPress, Flutter.", number: "02" },
      { icon: "fas fa-bullhorn", title: "Marketing included", description: "SEO, ads, and landing pages aligned.", number: "03" },
    ],
  },
  {
    acfFcLayout: "process",
    sectionTheme: "light",
    badge: "Process",
    title: "How we work",
    subtitle: "Simple steps. No confusion.",
    steps: [
      { icon: "fas fa-comments", title: "Discovery call", description: "Goals, timeline, and budget — written summary after the call." },
      { icon: "fas fa-pencil-ruler", title: "Design sign-off", description: "Wireframes or UI you approve before we write production code." },
      { icon: "fas fa-code", title: "Build & staging", description: "You review on a real URL on phone and desktop." },
      { icon: "fas fa-rocket", title: "Launch & support", description: "Go-live, handover, and optional maintenance." },
    ],
  },
  {
    acfFcLayout: "testimonials",
    sectionTheme: "dark",
    badge: "Client stories",
    title: "Teams that stayed — and scaled",
    subtitle: "Retention starts with delivery.",
    testimonials: [
      { name: "Ecommerce director", text: "Store feels premium on mobile. Speed and checkout levelled up in one project.", role: "Retail" },
      { name: "Healthcare operations lead", text: "Booking and SEO work together — steady enquiries for our team.", role: "Healthcare" },
      { name: "B2B sales manager", text: "Site plus paid landing pages — we attribute leads to campaigns.", role: "Manufacturing" },
    ],
  },
  {
    acfFcLayout: "guarantees",
    sectionTheme: "light",
    badge: "Your investment, protected",
    title: "Commitments on every project",
    subtitle: "Standard on our engagements.",
    items: [
      { icon: "fas fa-file-contract", title: "Scope in writing", desc: "Deliverables and timeline documented.", tone: "blue" },
      { icon: "fas fa-eye", title: "Staging previews", desc: "Approve on a test link before launch.", tone: "green" },
      { icon: "fas fa-key", title: "You own assets", desc: "Code and admin access at go-live.", tone: "purple" },
    ],
  },
  {
    acfFcLayout: "industries",
    sectionTheme: "dark",
    badge: "Industries",
    title: "Sector experience",
    subtitle: "Messaging tailored to how you sell.",
    items: [
      { icon: "fas fa-heartbeat", title: "Healthcare", tone: "pink" },
      { icon: "fas fa-shopping-bag", title: "Retail", tone: "purple" },
      { icon: "fas fa-rocket", title: "Startups", tone: "blue" },
    ],
  },
  {
    acfFcLayout: "tech_stack",
    sectionTheme: "light",
    badge: "Technology",
    title: "Stacks we ship",
    subtitle: "Production-ready tools.",
    items: [
      { icon: "fab fa-react", title: "React", tone: "blue" },
      { icon: "fas fa-bolt", title: "Next.js", tone: "grey" },
      { icon: "fab fa-wordpress", title: "WordPress", tone: "blue" },
    ],
  },
  {
    acfFcLayout: "pricing_packages",
    sectionTheme: "light",
    badge: "Engagement models",
    title: "Flexible ways to work together",
    subtitle: "Fixed-scope launches, dedicated developers, or monthly retainers.",
    items: [
      { icon: "fas fa-file-contract", title: "Fixed-scope projects", desc: "Defined deliverables and milestone billing.", tone: "blue" },
      { icon: "fas fa-user-clock", title: "Dedicated developers", desc: "Embedded capacity for sprints and backlogs.", tone: "green" },
      { icon: "fas fa-calendar-check", title: "Monthly retainers", desc: "Ongoing design, dev, SEO, or support.", tone: "orange" },
    ],
  },
  {
    acfFcLayout: "faq",
    sectionTheme: "dark",
    badge: "FAQ",
    title: "Common questions",
    subtitle: "Straight answers before you book a call.",
    items: [
      { icon: "fas fa-rupee-sign", title: "How much does a website cost?", desc: "We give a written estimate after discovery — use Ask price for a ballpark.", tone: "green" },
      { icon: "fas fa-clock", title: "How long does delivery take?", desc: "Typical corporate sites: 3–6 weeks. Apps vary by scope.", tone: "blue" },
    ],
  },
  {
    acfFcLayout: "cta",
    sectionTheme: "dark",
    title: "Ready to grow with a team that stays?",
    subtitle: "Book a free consultation — reply within one business day with scope and estimate.",
    ctaLabel: "Get free proposal",
    ctaHref: "#ask-price",
    ctaPrimary: { label: "Get free proposal", href: "#ask-price" },
    ctaSecondary: { label: "Talk to our team", href: "/contact#contact-form" },
  },
];

async function seed() {
  const conn = await mysql.createConnection(db);
  try {
    await conn.beginTransaction();

    await conn.query(
      "INSERT INTO site_settings (id, payload) VALUES (1, ?) ON DUPLICATE KEY UPDATE payload = VALUES(payload)",
      [JSON.stringify(siteSettings)],
    );

    for (const [key, payload] of Object.entries(menus)) {
      await conn.query(
        "INSERT INTO menus (menu_key, payload) VALUES (?, ?) ON DUPLICATE KEY UPDATE payload = VALUES(payload)",
        [key, JSON.stringify(payload)],
      );
    }

    const [homeRows] = await conn.query(
      "SELECT id FROM pages WHERE is_homepage = 1 LIMIT 1",
    );
    let pageId = homeRows[0]?.id;
    if (!pageId) {
      const [slugRows] = await conn.query(
        "SELECT id FROM pages WHERE slug = 'home' LIMIT 1",
      );
      pageId = slugRows[0]?.id;
    }

    if (pageId) {
      await conn.query(
        `UPDATE pages
         SET slug='home', title='Home', template='default', is_homepage=1, status='published'
         WHERE id=?`,
        [pageId],
      );
    } else {
      const [ins] = await conn.query(
        `INSERT INTO pages
         (slug, title, content_html, template, seo_title, seo_description, seo_keywords, seo_canonical, seo_og_image, seo_robots, seo_focus_keyword, is_homepage, status)
         VALUES ('home', 'Home', '', 'default', 'Creative Web Solutions', '', '', '', '', 'index', '', 1, 'published')`,
      );
      pageId = ins.insertId;
    }

    await conn.query("UPDATE pages SET is_homepage = 0 WHERE id <> ?", [pageId]);
    await conn.query("DELETE FROM homepage_sections WHERE page_id = ?", [pageId]);

    let sort = 0;
    for (const section of homepageSections) {
      const layout = String(section.acfFcLayout || "section");
      await conn.query(
        `INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
         VALUES (?, ?, ?, 'published', ?, ?)`,
        [pageId, sort++, layout, layout, JSON.stringify(section)],
      );
    }

    await conn.commit();
    console.log("Seed complete for local DB:", db.database);
    console.log("Homepage sections:", homepageSections.length);
    console.log("Primary menu items:", menus.primary.length);
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    await conn.end();
  }
}

seed().catch((err) => {
  console.error("Seed failed:", err.message || err);
  process.exit(1);
});
