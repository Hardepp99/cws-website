/**
 * Reference defaults for WordPress seed scripts only — the Next.js app does not read this at runtime.
 * All live content comes from the WordPress database via GraphQL (see src/lib/wordpress/api.ts).
 */
import type { HomepageSection, MenuItem, SiteSettings } from "@/lib/wordpress/types";

export const defaultSiteSettings: SiteSettings = {
  phone: "+91-7015969967",
  email: "info@cwsindia.online",
  address: "#313, 3rd Floor, D & E Block\nVIP Road, Zirakpur\nPunjab 140603, India",
  logoUrl: "/assets/images/cws-logo.svg",
  logoWhiteUrl: "/assets/images/cws-logo.svg",
  primaryColor: "#0057FF",
  secondaryColor: "#0088FF",
  footerText:
    "We are a leading web development company in India, providing innovative digital solutions and professional IT training to businesses worldwide.",
  facebook: "https://www.facebook.com/profile.php?id=61565017048983",
  linkedin: "https://www.linkedin.com/company/creative-websolutions/",
  instagram: "https://www.instagram.com/creativeweb_solutions?igsh=ZHFvZTJlZmIyaHdx",
};

export const defaultMenus: { primary: MenuItem[]; footer: MenuItem[] } = {
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
      label: "Courses & Training",
      href: "/courses",
      children: [
        { label: "PHP & Laravel", href: "/courses#php", icon: "fab fa-php" },
        { label: "React & Node.js", href: "/courses#react", icon: "fab fa-react" },
        { label: "Full Stack", href: "/courses#fullstack", icon: "fas fa-layer-group" },
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
    { label: "Courses", href: "/courses" },
    { label: "Contact", href: "/contact" },
  ],
};

export const defaultHomepageSections: HomepageSection[] = [
  {
    acfFcLayout: "hero_slider",
    eyebrow: "Trusted IT partner · India",
    headline: "Digital solutions that help your business scale",
    headlineParts: [
      { text: "Digital", tone: "blue" },
      { text: "solutions", tone: "green" },
      { text: "that help your", tone: "white" },
      { text: "business", tone: "orange" },
      { text: "scale", tone: "slate" },
    ],
    subheadline:
      "We design and build websites, mobile apps, and marketing programs for startups and enterprises — with clear communication, on-time delivery, and long-term support.",
    ctaPrimary: { label: "Discuss your project", href: "/contact" },
    ctaSecondary: { label: "View services", href: "/services" },
    slides: [
      { image: { url: "/assets/images/hero1.png" } },
      { image: { url: "/assets/images/hero2.png" } },
      { image: { url: "/assets/images/hero3.png" } },
    ],
    stats: [
      { icon: "fas fa-project-diagram", count: 549, label: "Projects delivered" },
      { icon: "fas fa-users", count: 320, label: "Clients served" },
      { icon: "fas fa-award", count: 15, label: "Years in business" },
    ],
  },
  {
    acfFcLayout: "about",
    badge: "About us",
    title: "Technology partner for ambitious businesses",
    subtitle:
      "Creative Web Solutions combines product thinking, engineering discipline, and marketing expertise. From corporate websites to custom applications, we help teams launch faster and operate with confidence.",
    image: "/assets/images/hero2.png",
    features: [
      { title: "Expert Team", description: "15+ years of experience delivering scalable solutions" },
      { title: "Support", description: "Quick and reliable assistance whenever you need it" },
      { title: "Quality", description: "Clean, tested, and production-ready delivery" },
    ],
    ctaLabel: "Learn More About Us",
    ctaHref: "/about",
  },
  {
    acfFcLayout: "why_codify",
    badge: "Why work with us",
    title: "Built for reliability, built for growth",
    subtitle: "Six reasons teams across India choose us for web, mobile, and digital marketing.",
    cards: [
      { icon: "fas fa-lightbulb", title: "Innovative Solutions", description: "Cutting-edge technologies and creative thinking.", number: "01" },
      { icon: "fas fa-users-cog", title: "Expert Team", description: "50+ skilled professionals in web, mobile, and marketing.", number: "02" },
      { icon: "fas fa-clock", title: "On-Time Delivery", description: "Agile methodology ensures on-schedule delivery.", number: "03" },
      { icon: "fas fa-rupee-sign", title: "Cost-Effective", description: "Premium quality at competitive prices.", number: "04" },
      { icon: "fas fa-headset", title: "24/7 Support", description: "Round the clock assistance.", number: "05" },
      { icon: "fas fa-shield-alt", title: "100% Secure", description: "Industry-standard security practices.", number: "06" },
    ],
  },
  {
    acfFcLayout: "process",
    badge: "How we work",
    title: "A clear process from idea to launch",
    subtitle: "Structured delivery with milestones, reviews, and documentation at every stage.",
    steps: [
      { icon: "fas fa-comments", title: "Discovery & Consultation", description: "Understand your goals and requirements." },
      { icon: "fas fa-pencil-ruler", title: "Planning & Design", description: "Wireframes and UI design approval." },
      { icon: "fas fa-code", title: "Development", description: "Agile development with regular updates." },
      { icon: "fas fa-vial", title: "Testing & QA", description: "Rigorous testing across devices." },
      { icon: "fas fa-rocket", title: "Launch", description: "Deployment and go-live support." },
      { icon: "fas fa-life-ring", title: "Support", description: "Ongoing maintenance and optimization." },
    ],
  },
  {
    acfFcLayout: "services_grid",
    badge: "Services",
    title: "What we deliver",
    subtitle: "Strategy, design, development, and growth — under one accountable team.",
  },
  {
    acfFcLayout: "courses",
    badge: "Training",
    title: "Industry-ready IT courses",
    subtitle: "Practical programs in web and full-stack development, taught by working professionals.",
  },
  {
    acfFcLayout: "portfolio",
    badge: "Work",
    title: "Selected client projects",
    subtitle: "A sample of websites and applications we have shipped for businesses in India and abroad.",
  },
  {
    acfFcLayout: "blog_preview",
    badge: "Insights",
    title: "From our blog",
    subtitle: "Practical articles on web development, SEO, and digital strategy.",
  },
  {
    acfFcLayout: "testimonials",
    badge: "Clients",
    title: "What our clients say",
    subtitle: "Long-term relationships built on delivery, transparency, and results.",
  },
  {
    acfFcLayout: "cta",
    title: "Ready to plan your next project?",
    subtitle: "Tell us your goals — we will respond within one business day with a practical next step.",
    ctaLabel: "Book a consultation",
    ctaHref: "/contact",
  },
  {
    acfFcLayout: "contact_preview",
    badge: "Contact",
    title: "Speak with our team",
    subtitle: "Phone, email, or the contact form — whichever works best for you.",
  },
];
