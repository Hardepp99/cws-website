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

const homepageSections = [
  {
    acfFcLayout: "hero_slider",
    eyebrow: "Creative Web Solutions · Zirakpur, Chandigarh & Mohali",
    headline: "We build websites, mobile apps, and digital marketing that turn visitors into real enquiries.",
    subheadline: "",
    headlineParts: [],
    ctaPrimary: { label: "Get a quote", href: "#ask-price" },
    ctaSecondary: { label: "Call +91-7015969967", href: "tel:+917015969967" },
    slides: [
      { image: { url: "/assets/images/hero1.png" } },
      { image: { url: "/assets/images/hero2.png" } },
      { image: { url: "/assets/images/hero3.png" } },
    ],
    heroVisual: "svg",
    personImage: "/assets/images/hero2.png",
    personImageAlt: "Designer building websites and digital products",
    stats: [],
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
        text: "SEO ke baad Google pe ranking better hai. Team Zirakpur se, seedhi baat, time pe kaam.",
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
    acfFcLayout: "about",
    sectionTheme: "light",
    badge: "About us",
    title: "Technology partner for ambitious businesses",
    subtitle:
      "Creative Web Solutions combines product thinking, engineering discipline, and marketing expertise. From corporate websites to custom applications, we help teams in Zirakpur, Chandigarh, and Mohali launch faster and operate with confidence.",
    image: "/assets/images/about-office.jpg",
    imageAlt: "Creative Web Solutions office — modern workspace for web design and development",
    features: [
      { title: "Expert team", description: "15+ years delivering websites, apps, and campaigns" },
      { title: "Local support", description: "Fast replies and clear updates in English and Hindi" },
      { title: "Quality delivery", description: "Clean code, tested launches, and honest timelines" },
    ],
    ctaLabel: "Learn more about us",
    ctaHref: "/about",
  },
  {
    acfFcLayout: "services_grid",
    sectionTheme: "dark",
    badge: "Services",
    title: "What we do",
    subtitle: "From first wireframe to launch day — one team for design, build, and measurable growth across Punjab.",
    items: [
      { icon: "fas fa-paint-brush", title: "Web design", href: "/ui-ux-design-zirakpur", tone: "pink" },
      { icon: "fas fa-code", title: "Website development", href: "/website-development-zirakpur", tone: "blue" },
      { icon: "fas fa-mobile-alt", title: "Mobile apps", href: "/mobile-app-development-zirakpur", tone: "green" },
      { icon: "fas fa-bullhorn", title: "Digital marketing", href: "/digital-marketing-zirakpur", tone: "orange" },
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
    badge: "Clients",
    title: "Trusted by local businesses",
    subtitle: "Clear communication and delivery you can plan around.",
    testimonials: [
      { name: "Retail brand, Chandigarh", text: "Mobile site fast hai, forms finally use ho rahe hain. Updates bina drama ke.", role: "Ecommerce" },
      { name: "Clinic, Mohali", text: "SEO structure aur appointment flow — team ne khud follow-up kiya.", role: "Healthcare" },
      { name: "B2B supplier, Punjab", text: "Corporate website + Google Ads landing — enquiries track ho rahi hain.", role: "Manufacturing" },
    ],
  },
  {
    acfFcLayout: "portfolio",
    sectionTheme: "light",
    badge: "Local work",
    title: "Explore the line-up.",
    subtitle: "Real projects for businesses in Zirakpur, Chandigarh, Mohali & Punjab.",
    ctaLabel: "View all work",
    ctaHref: "/portfolio",
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
