import "server-only";
import type { Pool, RowDataPacket } from "mysql2/promise";
import { getPool } from "../db";
import { orderSql, searchWhere, sortColumn } from "../admin-list-query";
import {
  decodeHtmlEntities,
  decodeJson,
  decodeJsonArray,
  encodeJson,
  parseJsonValue,
  sanitizeSlug,
} from "../utils/json";
import { saveInboundForm } from "./crm-inbox";

type Row = RowDataPacket;

let repo: ContentRepository | null = null;

export function contentRepository(): ContentRepository {
  if (!repo) repo = new ContentRepository(getPool());
  return repo;
}

export class ContentRepository {
  private displayModeCache = new Map<string, boolean>();
  private faqsColumnCache = new Map<string, boolean>();

  constructor(private pool: Pool) {}

  async getSiteSettings(): Promise<Record<string, unknown>> {
    const [rows] = await this.pool.query<Row[]>("SELECT payload FROM site_settings WHERE id = 1");
    return decodeJson(rows[0]?.payload) ?? this.defaultSettings();
  }

  async saveSiteSettings(data: Record<string, unknown>): Promise<void> {
    const json = encodeJson(data);
    await this.pool.query(
      "INSERT INTO site_settings (id, payload) VALUES (1, ?) ON DUPLICATE KEY UPDATE payload = ?",
      [json, json],
    );
  }

  async getMenus(): Promise<Record<string, unknown[]>> {
    const map: Record<string, string> = {
      primary: "primary",
      footer: "footer",
      footer_services: "footerServices",
      footer_products: "footerProducts",
    };
    const out: Record<string, unknown[]> = {
      primary: [],
      footer: [],
      footerServices: [],
      footerProducts: [],
    };
    const [rows] = await this.pool.query<Row[]>("SELECT menu_key, payload FROM menus");
    for (const row of rows) {
      const key = map[String(row.menu_key)];
      if (key) out[key] = decodeJsonArray(row.payload);
    }
    return out;
  }

  async saveMenu(menuKey: string, items: unknown[]): Promise<void> {
    const json = encodeJson(items);
    await this.pool.query(
      "INSERT INTO menus (menu_key, payload) VALUES (?, ?) ON DUPLICATE KEY UPDATE payload = ?",
      [menuKey, json, json],
    );
  }

  async getPricingOptions(): Promise<Record<string, unknown>> {
    const [rows] = await this.pool.query<Row[]>("SELECT payload FROM pricing_options WHERE id = 1");
    const stored = decodeJson(rows[0]?.payload) ?? {};
    const rules = (stored.serviceGroupRules as unknown[]) ?? [];
    return {
      bundles: stored.bundles ?? [],
      budgetRanges: stored.budgetRanges ?? [],
      timelines: stored.timelines ?? [],
      serviceGroupRules: rules,
      serviceGroups: await this.buildPricingServiceGroups(Array.isArray(rules) ? rules : []),
    };
  }

  async savePricingOptions(data: Record<string, unknown>): Promise<void> {
    const copy = { ...data };
    delete copy.serviceGroups;
    const json = encodeJson(copy);
    await this.pool.query(
      "INSERT INTO pricing_options (id, payload) VALUES (1, ?) ON DUPLICATE KEY UPDATE payload = ?",
      [json, json],
    );
  }

  async getHomepage(): Promise<Record<string, unknown> | null> {
    let [rows] = await this.pool.query<Row[]>(
      "SELECT * FROM pages WHERE is_homepage = 1 AND status = 'published' LIMIT 1",
    );
    if (!rows[0]) {
      [rows] = await this.pool.query<Row[]>(
        "SELECT * FROM pages WHERE slug = 'home' AND status = 'published' LIMIT 1",
      );
    }
    return rows[0] ? await this.mapPage(rows[0], true) : null;
  }

  async getPageBySlug(slug: string): Promise<Record<string, unknown> | null> {
    const [rows] = await this.pool.query<Row[]>(
      "SELECT * FROM pages WHERE slug = ? AND status = 'published' LIMIT 1",
      [slug],
    );
    return rows[0] ? await this.mapPage(rows[0], Boolean(rows[0].is_homepage)) : null;
  }

  async getPageById(id: number): Promise<Row | null> {
    const [rows] = await this.pool.query<Row[]>("SELECT * FROM pages WHERE id = ? LIMIT 1", [id]);
    return rows[0] ?? null;
  }

  async getServiceLanding(slug: string): Promise<Record<string, unknown> | null> {
    const [rows] = await this.pool.query<Row[]>(
      "SELECT * FROM service_landings WHERE slug = ? AND status = 'published' LIMIT 1",
      [slug],
    );
    return rows[0] ? this.mapLanding(rows[0]) : null;
  }

  async getAllServiceLandings(): Promise<Record<string, unknown>[]> {
    const [rows] = await this.pool.query<Row[]>(
      "SELECT * FROM service_landings WHERE status = 'published' ORDER BY service_name ASC",
    );
    return rows.map((r) => this.mapLanding(r));
  }

  async getService(slug: string): Promise<Record<string, unknown> | null> {
    const [rows] = await this.pool.query<Row[]>(
      "SELECT * FROM services WHERE slug = ? AND status = 'published' LIMIT 1",
      [slug],
    );
    return rows[0] ? this.mapService(rows[0]) : null;
  }

  async getBlogPosts(): Promise<Record<string, unknown>[]> {
    const [rows] = await this.pool.query<Row[]>(
      "SELECT * FROM blog_posts WHERE status = 'published' ORDER BY published_date DESC, id DESC",
    );
    return rows.map((r) => this.mapBlogPost(r));
  }

  async getAllSlugs(): Promise<string[]> {
    const slugs = new Set<string>(["home"]);
    const [pages] = await this.pool.query<Row[]>(
      "SELECT slug FROM pages WHERE status = 'published' AND slug != 'home'",
    );
    pages.forEach((r) => slugs.add(String(r.slug)));
    const [landings] = await this.pool.query<Row[]>(
      "SELECT slug FROM service_landings WHERE status = 'published'",
    );
    landings.forEach((r) => slugs.add(String(r.slug)));
    const [services] = await this.pool.query<Row[]>(
      "SELECT slug FROM services WHERE status = 'published'",
    );
    services.forEach((r) => slugs.add(String(r.slug)));
    return [...slugs];
  }

  async saveFormSubmission(type: string, payload: Record<string, unknown>): Promise<void> {
    await saveInboundForm(type, payload);
  }

  async trackPageView(path: string, slug = ""): Promise<void> {
    const [tables] = await this.pool.query<Row[]>("SHOW TABLES LIKE 'page_views'");
    if (!tables.length) return;
    path = path.slice(0, 300);
    slug = slug.slice(0, 200);
    const day = new Date().toISOString().slice(0, 10);
    await this.pool.query(
      `INSERT INTO page_views (path, slug, viewed_on, views) VALUES (?, ?, ?, 1)
       ON DUPLICATE KEY UPDATE views = views + 1`,
      [path, slug, day],
    );
  }

  async portfolioTableExists(): Promise<boolean> {
    const [rows] = await this.pool.query<Row[]>("SHOW TABLES LIKE 'portfolio_items'");
    return rows.length > 0;
  }

  async getPortfolioItemBySlug(slug: string): Promise<Record<string, unknown> | null> {
    if (!(await this.portfolioTableExists()) || !slug) return null;
    const [rows] = await this.pool.query<Row[]>(
      'SELECT * FROM portfolio_items WHERE slug = ? AND status = "published" LIMIT 1',
      [slug],
    );
    return rows[0] ? this.mapPortfolioItem(rows[0], true) : null;
  }

  async getAllPortfolioPublished(): Promise<Record<string, unknown>[]> {
    if (!(await this.portfolioTableExists())) return [];
    const [rows] = await this.pool.query<Row[]>(
      'SELECT * FROM portfolio_items WHERE status = "published" ORDER BY sort_order ASC, id DESC',
    );
    return rows.map((r) => this.mapPortfolioItem(r));
  }

  async getPortfolioForHomepage(perCategoryLimit = 5): Promise<Record<string, unknown>[]> {
    if (!(await this.portfolioTableExists())) return [];
    perCategoryLimit = Math.max(1, Math.min(24, perCategoryLimit));
    const [rows] = await this.pool.query<Row[]>(
      'SELECT * FROM portfolio_items WHERE status = "published" AND show_on_homepage = 1 ORDER BY sort_order ASC, id DESC',
    );
    const counts: Record<string, number> = {};
    const result: Record<string, unknown>[] = [];
    for (const row of rows) {
      const cat = String(row.category ?? "").trim();
      if ((counts[cat] ?? 0) >= perCategoryLimit) continue;
      counts[cat] = (counts[cat] ?? 0) + 1;
      result.push(this.mapPortfolioItem(row));
    }
    return result;
  }

  async getGmbPublicPayload(): Promise<Record<string, unknown>> {
    const settings = await this.getSiteSettings();
    return this.formatGmbPublicPayload(settings);
  }

  async getAdminDashboardStats(): Promise<Record<string, unknown>> {
    const [[pages]] = await this.pool.query<Row[]>(
      "SELECT COUNT(*) AS c FROM pages WHERE is_homepage = 0",
    );
    const [[blog]] = await this.pool.query<Row[]>("SELECT COUNT(*) AS c FROM blog_posts");
    const [[landings]] = await this.pool.query<Row[]>("SELECT COUNT(*) AS c FROM service_landings");
    const [[services]] = await this.pool.query<Row[]>("SELECT COUNT(*) AS c FROM services");
    let portfolio = 0;
    if (await this.portfolioTableExists()) {
      const [[p]] = await this.pool.query<Row[]>("SELECT COUNT(*) AS c FROM portfolio_items");
      portfolio = Number(p?.c ?? 0);
    }
    const [[formsTotal]] = await this.pool.query<Row[]>("SELECT COUNT(*) AS c FROM form_submissions");
    const [[forms30]] = await this.pool.query<Row[]>(
      "SELECT COUNT(*) AS c FROM form_submissions WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)",
    );
    return {
      overview: { clicks: Number(forms30?.c ?? 0), impressions: 1, ctr: 0, position: 12.4, totalViews: 0 },
      counts: {
        pages: Number(pages?.c ?? 0),
        blog: Number(blog?.c ?? 0),
        landings: Number(landings?.c ?? 0),
        services: Number(services?.c ?? 0),
        portfolio,
        sections: 0,
        published: 0,
        drafts: 0,
      },
      formsTotal: Number(formsTotal?.c ?? 0),
      performance: [],
      topPages: [],
      seoIssues: [],
      recentForms: [],
      hasAnalytics: false,
    };
  }

  async listPagesAdmin(
    page: number,
    perPage: number,
    excludeHome = true,
    search = "",
    sort = "",
    order: "asc" | "desc" = "desc",
  ) {
    return this.adminList(
      "pages",
      "id, slug, title, template, is_homepage, status, updated_at",
      excludeHome ? "WHERE is_homepage = 0" : "WHERE 1=1",
      ["title", "slug", "template", "status", "content_html", "seo_title", "seo_description"],
      search,
      sort,
      ["title", "slug", "template", "status", "updated_at"],
      "updated_at",
      order,
      page,
      perPage,
    );
  }

  async listLandingsAdmin(
    page: number,
    perPage: number,
    search = "",
    sort = "",
    order: "asc" | "desc" = "asc",
  ) {
    return this.adminList(
      "service_landings",
      "id, slug, service_name, status, updated_at",
      "WHERE 1=1",
      ["service_name", "slug", "status", "intro", "page_title", "page_description", "seo_body_html"],
      search,
      sort,
      ["service_name", "slug", "status", "updated_at"],
      "service_name",
      order,
      page,
      perPage,
    );
  }

  async listBlogPostsAdmin(
    page: number,
    perPage: number,
    search = "",
    sort = "",
    order: "asc" | "desc" = "desc",
  ) {
    return this.adminList(
      "blog_posts",
      "id, slug, title, status, published_date, updated_at",
      "WHERE 1=1",
      ["title", "slug", "status", "excerpt", "content_html"],
      search,
      sort,
      ["title", "slug", "status", "published_date", "updated_at"],
      "updated_at",
      order,
      page,
      perPage,
    );
  }

  async listServicesAdmin(
    page: number,
    perPage: number,
    search = "",
    sort = "",
    order: "asc" | "desc" = "asc",
  ) {
    return this.adminList(
      "services",
      "id, slug, title, status, updated_at",
      "WHERE 1=1",
      ["title", "slug", "status", "hero_title", "hero_subtitle", "content_html", "price_badge"],
      search,
      sort,
      ["title", "slug", "status", "updated_at"],
      "title",
      order,
      page,
      perPage,
    );
  }

  async listPortfolioAdmin(
    page: number,
    perPage: number,
    search = "",
    sort = "",
    order: "asc" | "desc" = "desc",
  ) {
    if (!(await this.portfolioTableExists())) {
      return { items: [], total: 0, page, perPage };
    }
    return this.adminList(
      "portfolio_items",
      "id, title, client_name, location, category, image, show_on_homepage, sort_order, status, updated_at",
      "WHERE 1=1",
      ["title", "client_name", "location", "category", "excerpt", "status"],
      search,
      sort,
      ["title", "client_name", "location", "category", "sort_order", "status", "updated_at"],
      "sort_order",
      order,
      page,
      perPage,
    );
  }

  async getLandingById(id: number): Promise<Row | null> {
    const [rows] = await this.pool.query<Row[]>("SELECT * FROM service_landings WHERE id = ?", [id]);
    return rows[0] ?? null;
  }

  async getServiceById(id: number): Promise<Row | null> {
    const [rows] = await this.pool.query<Row[]>("SELECT * FROM services WHERE id = ?", [id]);
    return rows[0] ?? null;
  }

  async getBlogPostById(id: number): Promise<Row | null> {
    const [rows] = await this.pool.query<Row[]>("SELECT * FROM blog_posts WHERE id = ?", [id]);
    return rows[0] ?? null;
  }

  async getPortfolioItemById(id: number): Promise<Row | null> {
    if (!(await this.portfolioTableExists())) return null;
    const [rows] = await this.pool.query<Row[]>("SELECT * FROM portfolio_items WHERE id = ?", [id]);
    return rows[0] ?? null;
  }

  async savePage(id: number, data: Record<string, unknown>): Promise<void> {
    const row = await this.getPageById(id);
    if (!row) throw new Error("Page not found");
    let slug = String(row.slug);
    if (data.slug && !row.is_homepage) {
      slug = await this.uniqueSlug("pages", sanitizeSlug(String(data.slug)), id);
    }
    await this.pool.query(
      `UPDATE pages SET slug = ?, title = ?, content_html = ?, template = ?,
       seo_title = ?, seo_description = ?, seo_keywords = ?, status = ? WHERE id = ?`,
      [
        slug,
        data.title,
        data.content_html ?? "",
        data.template ?? "default",
        data.seo_title ?? "",
        data.seo_description ?? "",
        data.seo_keywords ?? "",
        data.status ?? "published",
        id,
      ],
    );
  }

  async saveLanding(id: number, data: Record<string, unknown>): Promise<void> {
    await this.pool.query(
      `UPDATE service_landings SET service_name = ?, page_title = ?, page_description = ?,
       page_keywords = ?, intro = ?, benefits = ?, deliverables = ?, faq = ?, related_slugs = ?,
       theme = ?, seo_body_html = ?, status = ? WHERE id = ?`,
      [
        data.service_name,
        data.page_title,
        data.page_description ?? "",
        data.page_keywords ?? "",
        data.intro ?? "",
        encodeJson(data.benefits ?? []),
        encodeJson(data.deliverables ?? []),
        encodeJson(data.faq ?? []),
        encodeJson(data.related_slugs ?? []),
        encodeJson(data.theme ?? []),
        data.seo_body_html ?? "",
        data.status ?? "published",
        id,
      ],
    );
  }

  async saveService(id: number, data: Record<string, unknown>): Promise<void> {
    const slug = await this.uniqueSlug(
      "services",
      sanitizeSlug(String(data.slug ?? data.title ?? "service")),
      id,
    );
    await this.pool.query(
      `UPDATE services SET slug = ?, title = ?, hero_title = ?, hero_subtitle = ?, price_badge = ?,
       content_html = ?, features = ?, cta_title = ?, cta_text = ?, seo = ?, status = ? WHERE id = ?`,
      [
        slug,
        data.title,
        data.hero_title ?? data.title,
        data.hero_subtitle ?? "",
        data.price_badge ?? "",
        data.content_html ?? "",
        encodeJson(data.features ?? []),
        data.cta_title ?? "",
        data.cta_text ?? "",
        encodeJson(data.seo ?? []),
        data.status ?? "published",
        id,
      ],
    );
  }

  async saveBlogPost(id: number, data: Record<string, unknown>): Promise<void> {
    await this.pool.query(
      `UPDATE blog_posts SET slug = ?, title = ?, excerpt = ?, content_html = ?, featured_image = ?,
       published_date = ?, seo = ?, status = ? WHERE id = ?`,
      [
        data.slug,
        data.title,
        data.excerpt ?? "",
        data.content_html ?? "",
        data.featured_image ?? "",
        data.published_date ?? new Date().toISOString().slice(0, 10),
        encodeJson(data.seo ?? {}),
        data.status ?? "published",
        id,
      ],
    );
  }

  async createPage(data: Record<string, unknown>): Promise<number> {
    const slug = await this.uniqueSlug("pages", sanitizeSlug(String(data.slug ?? data.title ?? "page")));
    const [result] = await this.pool.query(
      `INSERT INTO pages (slug, title, content_html, template, seo_title, seo_description, seo_keywords, status, is_homepage)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)`,
      [
        slug,
        data.title ?? "New page",
        data.content_html ?? "",
        data.template ?? "default",
        data.seo_title ?? "",
        data.seo_description ?? "",
        data.seo_keywords ?? "",
        data.status ?? "draft",
      ],
    );
    return Number((result as { insertId: number }).insertId);
  }

  async createBlogPost(data: Record<string, unknown>): Promise<number> {
    const slug = await this.uniqueSlug("blog_posts", sanitizeSlug(String(data.slug ?? data.title ?? "post")));
    const [result] = await this.pool.query(
      `INSERT INTO blog_posts (slug, title, excerpt, content_html, featured_image, published_date, seo, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        slug,
        data.title ?? "New post",
        data.excerpt ?? "",
        data.content_html ?? "",
        data.featured_image ?? "",
        data.published_date ?? new Date().toISOString().slice(0, 10),
        encodeJson(data.seo ?? {}),
        data.status ?? "draft",
      ],
    );
    return Number((result as { insertId: number }).insertId);
  }

  async createLanding(data: Record<string, unknown>): Promise<number> {
    const slug = await this.uniqueSlug(
      "service_landings",
      sanitizeSlug(String(data.slug ?? data.service_name ?? "service")),
    );
    const [result] = await this.pool.query(
      `INSERT INTO service_landings (slug, service_name, page_title, page_description, page_keywords, intro,
       benefits, deliverables, faq, related_slugs, theme, seo_body_html, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        slug,
        data.service_name ?? "New service",
        data.page_title ?? data.service_name ?? "",
        data.page_description ?? "",
        data.page_keywords ?? "",
        data.intro ?? "",
        encodeJson(data.benefits ?? []),
        encodeJson(data.deliverables ?? []),
        encodeJson(data.faq ?? []),
        encodeJson(data.related_slugs ?? []),
        encodeJson(data.theme ?? []),
        data.seo_body_html ?? "",
        data.status ?? "draft",
      ],
    );
    return Number((result as { insertId: number }).insertId);
  }

  async createService(data: Record<string, unknown>): Promise<number> {
    const slug = await this.uniqueSlug("services", sanitizeSlug(String(data.slug ?? data.title ?? "service")));
    const [result] = await this.pool.query(
      `INSERT INTO services (slug, title, hero_title, hero_subtitle, price_badge, content_html, features, cta_title, cta_text, seo, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        slug,
        data.title ?? "New service",
        data.hero_title ?? data.title ?? "",
        data.hero_subtitle ?? "",
        data.price_badge ?? "",
        data.content_html ?? "",
        encodeJson(data.features ?? []),
        data.cta_title ?? "",
        data.cta_text ?? "",
        encodeJson(data.seo ?? {}),
        data.status ?? "draft",
      ],
    );
    return Number((result as { insertId: number }).insertId);
  }

  async createPortfolioItem(data: Record<string, unknown>): Promise<number> {
    const slug = await this.uniqueSlug(
      "portfolio_items",
      sanitizeSlug(String(data.slug ?? data.client_name ?? data.title ?? "project")),
    );
    const [result] = await this.pool.query(
      `INSERT INTO portfolio_items (title, slug, client_name, location, category, image, href, excerpt, content, sort_order, show_on_homepage, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.title ?? data.client_name ?? "Project",
        slug,
        data.client_name ?? data.title ?? "",
        data.location ?? "",
        data.category ?? "",
        data.image ?? "",
        data.href ?? "",
        data.excerpt ?? "",
        data.content ?? "",
        data.sort_order ?? 0,
        data.show_on_homepage ? 1 : 0,
        data.status === "draft" ? "draft" : "published",
      ],
    );
    return Number((result as { insertId: number }).insertId);
  }

  async savePortfolioItem(id: number, data: Record<string, unknown>): Promise<void> {
    await this.pool.query(
      `UPDATE portfolio_items SET title = ?, client_name = ?, location = ?, category = ?,
       image = ?, href = ?, excerpt = ?, content = ?, sort_order = ?, show_on_homepage = ?, status = ? WHERE id = ?`,
      [
        data.title ?? "",
        data.client_name ?? "",
        data.location ?? "",
        data.category ?? "",
        data.image ?? "",
        data.href ?? "",
        data.excerpt ?? "",
        data.content ?? "",
        data.sort_order ?? 0,
        data.show_on_homepage ? 1 : 0,
        data.status === "draft" ? "draft" : "published",
        id,
      ],
    );
  }

  async deletePortfolioItem(id: number): Promise<void> {
    await this.pool.query("DELETE FROM portfolio_items WHERE id = ?", [id]);
  }

  async getHomepagePageId(): Promise<number> {
    const [rows] = await this.pool.query<Row[]>("SELECT id FROM pages WHERE is_homepage = 1 LIMIT 1");
    return rows[0] ? Number(rows[0].id) : 0;
  }

  // —— private helpers ——

  private defaultSettings(): Record<string, unknown> {
    return {
      phone: "",
      email: "",
      address: "",
      logoUrl: "/assets/images/cws-logo.svg",
      logoWhiteUrl: "/assets/images/cws-logo-light.svg",
      primaryColor: "#0057FF",
      secondaryColor: "#0088FF",
      footerText: "",
      facebook: "",
      linkedin: "",
      instagram: "",
      footerCompanyTitle: "Company",
      footerServicesTitle: "Services",
      footerProductsTitle: "Products & Training",
    };
  }

  private async buildPricingServiceGroups(rules: unknown[]): Promise<unknown[]> {
    const bucket: Record<string, { value: string; label: string }[]> = {};
    const add = (slug: string, label: string, prefix: string) => {
      const group = "Services";
      if (!bucket[group]) bucket[group] = [];
      bucket[group].push({ value: `${prefix}:${slug}`, label });
    };
    const [landings] = await this.pool.query<Row[]>(
      "SELECT slug, service_name FROM service_landings WHERE status = 'published' ORDER BY service_name ASC",
    );
    landings.forEach((r) => add(String(r.slug), String(r.service_name), "landing"));
    const [services] = await this.pool.query<Row[]>(
      "SELECT slug, title, hero_title FROM services WHERE status = 'published' ORDER BY title ASC",
    );
    services.forEach((r) => add(String(r.slug), String(r.hero_title || r.title), "service"));
    return Object.entries(bucket)
      .filter(([, opts]) => opts.length)
      .map(([label, options]) => ({
        label,
        options: options.sort((a, b) => a.label.localeCompare(b.label)),
      }));
  }

  private async getHomepageSections(pageId: number): Promise<unknown[]> {
    const [rows] = await this.pool.query<Row[]>(
      "SELECT layout, payload FROM homepage_sections WHERE page_id = ? ORDER BY sort_order ASC",
      [pageId],
    );
    return rows.map((row) => {
      const parsed = parseJsonValue(row.payload);
      const payload =
        parsed && typeof parsed === "object" && !Array.isArray(parsed)
          ? (parsed as Record<string, unknown>)
          : {};
      if (!payload.acfFcLayout) payload.acfFcLayout = row.layout === "seo_rich_content" ? "seo_rich" : row.layout;
      return payload;
    });
  }

  private async mapPage(page: Row, withSections: boolean): Promise<Record<string, unknown>> {
    const data: Record<string, unknown> = {
      slug: page.slug,
      title: decodeHtmlEntities(String(page.title)),
      content: String(page.content_html ?? ""),
      template: page.template || "default",
      displayMode: "classic",
      seo: {
        title: page.seo_title || page.title,
        description: page.seo_description ?? "",
        keywords: page.seo_keywords ?? "",
        canonical: page.seo_canonical ?? "",
        ogImage: page.seo_og_image ?? "",
        robots: page.seo_robots === "noindex" ? "noindex" : "index",
        focusKeyword: page.seo_focus_keyword ?? "",
      },
    };
    if (withSections) data.sections = await this.getHomepageSections(Number(page.id));
    return data;
  }

  private mapLanding(row: Row): Record<string, unknown> {
    const theme = decodeJson(row.theme) ?? {};
    return {
      slug: row.slug,
      displayMode: "classic",
      service: row.service_name,
      pageTitle: row.page_title,
      pageDescription: row.page_description ?? "",
      pageKeywords: row.page_keywords ?? "",
      intro: row.intro ?? "",
      benefits: decodeJsonArray(row.benefits),
      deliverables: decodeJsonArray(row.deliverables),
      faq: decodeJsonArray(row.faq),
      related: decodeJsonArray(row.related_slugs),
      seoBody: row.seo_body_html ?? "",
      theme: {
        start: "#1e3a8a",
        mid: "#2563eb",
        end: "#3b82f6",
        accent: "#93c5fd",
        icon: "fas fa-briefcase",
        badge: "",
        ...theme,
      },
    };
  }

  private mapService(row: Row): Record<string, unknown> {
    const seo = decodeJson(row.seo) ?? {};
    return {
      slug: row.slug,
      title: row.title,
      displayMode: "classic",
      heroTitle: row.hero_title || row.title,
      heroSubtitle: row.hero_subtitle ?? "",
      priceBadge: row.price_badge ?? "",
      content: row.content_html ?? "",
      features: decodeJsonArray(row.features),
      ctaTitle: row.cta_title ?? "",
      ctaText: row.cta_text ?? "",
      seo: { title: row.title, description: "", keywords: "", ...seo },
    };
  }

  private mapBlogPost(row: Row): Record<string, unknown> {
    const seo = decodeJson(row.seo) ?? {};
    return {
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt ?? "",
      date: row.published_date ?? "",
      image: row.featured_image || null,
      content: row.content_html ?? "",
      displayMode: "classic",
      categories: [],
      featured: Boolean(row.is_featured),
      seo: { title: row.title, description: row.excerpt ?? "", keywords: "", ...seo },
    };
  }

  private mapPortfolioItem(row: Row, includeContent = false): Record<string, unknown> {
    const slug = String(row.slug ?? "").trim();
    const external = String(row.href ?? "").trim();
    const mapped: Record<string, unknown> = {
      id: Number(row.id),
      slug,
      title: String(row.title),
      clientName: String(row.client_name ?? ""),
      location: String(row.location ?? ""),
      category: String(row.category ?? ""),
      image: String(row.image ?? ""),
      href: slug ? `/portfolio/${slug}` : external || "/portfolio",
      projectUrl: external,
      excerpt: String(row.excerpt ?? ""),
      showOnHomepage: Boolean(row.show_on_homepage),
    };
    if (includeContent) mapped.content = String(row.content ?? "");
    return mapped;
  }

  private formatGmbPublicPayload(settings: Record<string, unknown>): Record<string, unknown> {
    const reviews: unknown[] = [];
    let count = String(settings.gmbReviewCount ?? "");
    if (count && !count.includes("+")) count += "+";
    return {
      mapsUrl: settings.gmbMapsUrl ?? "",
      placeName: settings.gmbPlaceName ?? "",
      rating: Number(settings.gmbRating ?? 0),
      reviewCount: count,
      reviews,
      cachedAt: settings.gmbReviewsCachedAt ?? "",
      live: false,
    };
  }

  private async uniqueSlug(table: string, slug: string, excludeId?: number): Promise<string> {
    const allowed = ["pages", "blog_posts", "service_landings", "services", "portfolio_items"];
    if (!allowed.includes(table)) return slug;
    let candidate = slug;
    let n = 1;
    while (true) {
      let sql = `SELECT id FROM ${table} WHERE slug = ?`;
      const params: unknown[] = [candidate];
      if (excludeId) {
        sql += " AND id != ?";
        params.push(excludeId);
      }
      sql += " LIMIT 1";
      const [rows] = await this.pool.query<Row[]>(sql, params);
      if (!rows.length) return candidate;
      candidate = `${slug}-${n++}`;
    }
  }

  private async adminList(
    table: string,
    select: string,
    whereBase: string,
    searchCols: string[],
    search: string,
    sort: string,
    allowedSort: string[],
    defaultSort: string,
    order: "asc" | "desc",
    page: number,
    perPage: number,
  ) {
    const values: unknown[] = [];
    const where = whereBase + searchWhere(searchCols, search, values);
    const sortCol = sortColumn(sort, allowedSort, defaultSort);
    const [[countRow]] = await this.pool.query<Row[]>(
      `SELECT COUNT(*) AS c FROM ${table} ${where}`,
      values,
    );
    const total = Number(countRow?.c ?? 0);
    const offset = Math.max(0, (page - 1) * perPage);
    const [items] = await this.pool.query<Row[]>(
      `SELECT ${select} FROM ${table} ${where} ORDER BY ${sortCol} ${orderSql(order)} LIMIT ? OFFSET ?`,
      [...values, perPage, offset],
    );
    return { items, total, page, perPage };
  }
}
