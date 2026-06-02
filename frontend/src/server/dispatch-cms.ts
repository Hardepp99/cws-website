import "server-only";
import fs from "fs/promises";
import bcrypt from "bcrypt";
import sharp from "sharp";
import type { RowDataPacket } from "mysql2";
import {
  adminGetUserById,
  adminLogin,
  adminPublicProfile,
  adminRevokeToken,
  adminUserIdFromToken,
} from "./auth/admin-auth";
import {
  getMemberById,
  memberIdFromToken,
  memberLogin,
  memberLoginWithGoogle,
  memberRegister,
  memberRevokeToken,
} from "./auth/member-auth";
import type { CmsDispatchContext, CmsDispatchResult } from "./cms-types";
import { listQueryFromSearchParams } from "./admin-list-query";
import { communityRepository } from "./repositories/community-repository";
import { contentRepository } from "./repositories/content-repository";
import { mediaService } from "./repositories/media-service";
import { getPool } from "./db";
import { isDbBusyError } from "./db-resilience";
import { emptySiteMenus, emptySiteSettings } from "@/lib/wordpress/fallback";

function notFound(path: string): CmsDispatchResult {
  return { status: 404, data: { error: "Not found", path } };
}

function notImplemented(path: string): CmsDispatchResult {
  return {
    status: 501,
    data: {
      error: "Not implemented in Node CMS yet",
      path,
      hint: "Port in progress — see docs/NODE_CMS.md",
    },
  };
}

async function requireAdmin(ctx: CmsDispatchContext) {
  const token = ctx.adminToken || "";
  const userId = await adminUserIdFromToken(token);
  if (!userId) return null;
  return adminGetUserById(userId);
}

async function requireMember(ctx: CmsDispatchContext) {
  const token = ctx.memberToken || "";
  const memberId = await memberIdFromToken(token);
  if (!memberId) return null;
  return getMemberById(memberId);
}

export async function dispatchCms(ctx: CmsDispatchContext): Promise<CmsDispatchResult> {
  const { method, path } = ctx;
  const repo = contentRepository();
  const community = communityRepository();
  const media = mediaService();

  try {
    // Media file
    const mediaMatch = path.match(/^\/media\/(\d+)\/file$/);
    if (method === "GET" && mediaMatch) {
      const variant = ctx.searchParams.get("variant") || "medium";
      const file = await media.serve(Number(mediaMatch[1]), variant);
      if (!file) return { status: 404, data: { error: "Not found" } };
      return { status: 200, file };
    }

    // Admin API
    if (path.startsWith("/admin")) {
      return dispatchAdmin(ctx, path.slice("/admin".length) || "/");
    }

    // Public reads
    if (method === "GET" && path === "/layout-bootstrap") {
      return { status: 200, data: await repo.getLayoutBootstrap() };
    }
    if (method === "GET" && path === "/settings") {
      return { status: 200, data: await repo.getSiteSettings() };
    }
    if (method === "GET" && path === "/gmb") {
      return { status: 200, data: await repo.getGmbPublicPayload() };
    }
    if (method === "GET" && path === "/menus") {
      return { status: 200, data: await repo.getMenus() };
    }
    if (method === "GET" && path === "/pricing-options") {
      return { status: 200, data: await repo.getPricingOptions() };
    }
    if (method === "GET" && path === "/homepage") {
      const page = await repo.getHomepage();
      return page ? { status: 200, data: page } : { status: 404, data: { error: "Homepage not found" } };
    }
    if (method === "GET" && path.startsWith("/pages/")) {
      const slug = path.slice("/pages/".length);
      const page = await repo.getPageBySlug(slug);
      return page ? { status: 200, data: page } : { status: 404, data: { error: "Not found" } };
    }
    if (method === "GET" && path === "/landings") {
      return { status: 200, data: await repo.getAllServiceLandings() };
    }
    if (method === "GET" && path.startsWith("/landings/")) {
      const landing = await repo.getServiceLanding(path.slice("/landings/".length));
      return landing ? { status: 200, data: landing } : { status: 404, data: { error: "Not found" } };
    }
    if (method === "GET" && path.startsWith("/services/")) {
      const service = await repo.getService(path.slice("/services/".length));
      return service ? { status: 200, data: service } : { status: 404, data: { error: "Not found" } };
    }
    if (method === "GET" && path === "/blog") {
      return { status: 200, data: await repo.getBlogPosts() };
    }
    if (method === "GET" && path === "/portfolio") {
      return { status: 200, data: await repo.getAllPortfolioPublished() };
    }
    if (method === "GET" && path === "/portfolio/home") {
      const settings = await repo.getSiteSettings();
      const maxPerCategory = Math.max(1, Math.min(24, Number(settings.portfolioHomeMax ?? 5)));
      return {
        status: 200,
        data: {
          items: await repo.getPortfolioForHomepage(maxPerCategory),
          settings: {
            badge: settings.portfolioBadge ?? "Local work",
            title: settings.portfolioTitle ?? "Clients we have worked with",
            subtitle: settings.portfolioSubtitle ?? "",
            ctaLabel: settings.portfolioCtaLabel ?? "View all work",
            ctaHref: settings.portfolioCtaHref ?? "/portfolio",
            maxPerCategory,
          },
        },
      };
    }
    if (method === "GET" && path.match(/^\/portfolio\/[a-z0-9][a-z0-9-]*$/)) {
      const slug = path.slice("/portfolio/".length);
      const item = await repo.getPortfolioItemBySlug(slug);
      return item ? { status: 200, data: item } : { status: 404, data: { error: "Not found" } };
    }
    if (method === "GET" && path === "/slugs") {
      return { status: 200, data: await repo.getAllSlugs() };
    }

    // Forms
    const body = ctx.body ?? {};
    if (method === "POST" && path === "/contact") {
      if (!body.name || !body.email || !body.phone || !body.message) {
        return { status: 400, data: { success: false, message: "All fields are required." } };
      }
      await repo.saveFormSubmission("contact", body);
      return { status: 200, data: { success: true, message: "Thank you! We will contact you soon." } };
    }
    if (method === "POST" && path === "/lead") {
      await repo.saveFormSubmission(String(body.source ?? "ask_price"), body);
      return { status: 200, data: { success: true, message: "Thank you! Our team will reach out shortly." } };
    }
    if (method === "POST" && path === "/enrollment") {
      await repo.saveFormSubmission("enrollment", body);
      return {
        status: 200,
        data: { success: true, message: "Thank you! We will contact you about the course." },
      };
    }
    if (method === "POST" && path === "/track-view") {
      await repo.trackPageView(String(body.path ?? "/"), String(body.slug ?? ""));
      return { status: 200, data: { ok: true } };
    }

    // Member auth
    if (method === "POST" && path === "/member/register") {
      try {
        const result = await memberRegister(
          String(body.email ?? ""),
          String(body.password ?? ""),
          String(body.displayName ?? body.name ?? ""),
        );
        return { status: 200, data: result };
      } catch (e) {
        return { status: 400, data: { success: false, message: (e as Error).message } };
      }
    }
    if (method === "POST" && path === "/member/login") {
      const result = await memberLogin(String(body.email ?? ""), String(body.password ?? ""));
      if (!result) return { status: 401, data: { success: false, message: "Invalid email or password." } };
      return { status: 200, data: result };
    }
    if (method === "POST" && path === "/member/google") {
      const result = await memberLoginWithGoogle(String(body.credential ?? body.idToken ?? ""));
      if (!result) return { status: 401, data: { success: false, message: "Google sign-in failed." } };
      return { status: 200, data: result };
    }
    if (method === "POST" && path === "/member/logout") {
      if (ctx.memberToken) await memberRevokeToken(ctx.memberToken);
      return { status: 200, data: { success: true } };
    }
    if (method === "GET" && path === "/member/me") {
      const member = await requireMember(ctx);
      if (!member) return { status: 401, data: { success: false, message: "Sign in required." } };
      return { status: 200, data: { success: true, member } };
    }
    if (method === "GET" && path === "/member/contributions") {
      const member = await requireMember(ctx);
      if (!member) return { status: 401, data: { success: false, message: "Sign in required." } };
      return { status: 200, data: await community.getMemberContributions(member.id) };
    }
    if (method === "GET" && path === "/member/blog") {
      const member = await requireMember(ctx);
      if (!member) return { status: 401, data: { success: false, message: "Sign in required." } };
      const data = await community.getMemberContributions(member.id);
      return { status: 200, data: { items: data.blogPosts } };
    }
    if (method === "POST" && path === "/member/blog") {
      const member = await requireMember(ctx);
      if (!member) return { status: 401, data: { success: false, message: "Sign in required." } };
      if (!body.title) return { status: 400, data: { error: "Title is required" } };
      try {
        const id = await community.createMemberBlogPost(member.id, body);
        return { status: 200, data: { success: true, id, status: "pending_review" } };
      } catch (e) {
        return { status: 400, data: { error: (e as Error).message } };
      }
    }

    // Community public
    if (method === "GET" && path === "/community/forums") {
      return { status: 200, data: await community.listForumsPublic() };
    }

    const blogCommentsMatch = path.match(/^\/blog\/([a-z0-9][a-z0-9-]*)\/comments$/);
    if (blogCommentsMatch) {
      const slug = blogCommentsMatch[1];
      const postId = await community.getBlogPostIdBySlug(slug);
      if (!postId) return { status: 404, data: { error: "Post not found" } };
      if (method === "GET") {
        const viewer = await requireMember(ctx);
        return {
          status: 200,
          data: await community.listApprovedComments(postId, viewer?.id ?? null),
        };
      }
      if (method === "POST") {
        const member = await requireMember(ctx);
        if (!member) return { status: 401, data: { success: false, message: "Sign in required." } };
        try {
          return {
            status: 200,
            data: await community.createBlogComment(postId, member.id, String(body.body ?? "")),
          };
        } catch (e) {
          return { status: 400, data: { error: (e as Error).message } };
        }
      }
    }

    return notFound(path);
  } catch (e) {
    if (isDbBusyError(e)) {
      console.warn("[dispatchCms] DB busy", path);
      return {
        status: 200,
        data: publicReadFallback(path),
      };
    }
    console.error("[dispatchCms]", path, e);
    return { status: 500, data: { error: "Server error", message: (e as Error).message } };
  }
}

function publicReadFallback(path: string): unknown {
  const emptyPricing = {
    bundles: [],
    budgetRanges: [],
    timelines: [],
    serviceGroupRules: [],
    serviceGroups: [],
  };
  if (path === "/settings") return emptySiteSettings();
  if (path === "/menus") return emptySiteMenus();
  if (path === "/pricing-options") return emptyPricing;
  if (path === "/layout-bootstrap") {
    return { settings: emptySiteSettings(), menus: emptySiteMenus(), pricing: emptyPricing };
  }
  if (path === "/portfolio") return [];
  if (path === "/portfolio/home") {
    const s = emptySiteSettings();
    return {
      items: [],
      settings: {
        badge: s.portfolioBadge,
        title: s.portfolioTitle,
        subtitle: s.portfolioSubtitle,
        ctaLabel: s.portfolioCtaLabel,
        ctaHref: s.portfolioCtaHref,
        maxPerCategory: 5,
      },
    };
  }
  if (path.startsWith("/pages/") || path.match(/^\/portfolio\/[a-z0-9]/)) return null;
  return null;
}

async function dispatchAdmin(ctx: CmsDispatchContext, path: string): Promise<CmsDispatchResult> {
  const repo = contentRepository();
  const community = communityRepository();
  const media = mediaService();
  const { method } = ctx;
  const sp = ctx.searchParams;
  const body = ctx.body ?? {};
  const pageNum = Math.max(1, Number(sp.get("page") ?? 1));
  const perPage = Math.min(50, Math.max(5, Number(sp.get("perPage") ?? 10)));
  const listQ = listQueryFromSearchParams(sp);

  if (method === "POST" && path === "/login") {
    const result = await adminLogin(String(body.username ?? ""), String(body.password ?? ""));
    if (!result) return { status: 401, data: { success: false, message: "Invalid credentials" } };
    return { status: 200, data: { success: true, ...result } };
  }
  if (method === "POST" && path === "/logout") {
    if (ctx.adminToken) await adminRevokeToken(ctx.adminToken);
    return { status: 200, data: { success: true } };
  }

  let user;
  try {
    user = await requireAdmin(ctx);
  } catch (e) {
    if (isDbBusyError(e)) {
      return {
        status: 503,
        data: {
          error: "Database busy. Restart WAMP MySQL, then reload this page.",
          code: "DB_TOO_MANY_CONNECTIONS",
        },
      };
    }
    throw e;
  }
  if (!user) return { status: 401, data: { error: "Unauthorized" } };

  if (method === "GET" && path === "/me") {
    return { status: 200, data: { success: true, ...adminPublicProfile(user) } };
  }
  if (method === "GET" && path === "/dashboard/stats") {
    return { status: 200, data: await repo.getAdminDashboardStats() };
  }
  if (method === "GET" && path === "/settings") {
    return { status: 200, data: await repo.getSiteSettings() };
  }
  if (method === "PUT" && path === "/settings") {
    await repo.saveSiteSettings(body);
    return { status: 200, data: { success: true } };
  }
  if (method === "GET" && path === "/pages/list") {
    return {
      status: 200,
      data: await repo.listPagesAdmin(pageNum, perPage, true, listQ.search, listQ.sort, listQ.order),
    };
  }
  if (method === "GET" && path.match(/^\/pages\/(\d+)$/)) {
    const id = Number(path.match(/^\/pages\/(\d+)$/)![1]);
    const row = await repo.getPageById(id);
    return row ? { status: 200, data: row } : { status: 404, data: { error: "Not found" } };
  }
  if (method === "PUT" && path.match(/^\/pages\/(\d+)$/)) {
    await repo.savePage(Number(path.match(/^\/pages\/(\d+)$/)![1]), body);
    return { status: 200, data: { success: true } };
  }
  if (method === "POST" && path === "/pages") {
    const id = await repo.createPage(body);
    return { status: 200, data: { success: true, id } };
  }
  if (method === "GET" && path === "/landings/list") {
    return {
      status: 200,
      data: await repo.listLandingsAdmin(pageNum, perPage, listQ.search, listQ.sort, listQ.order),
    };
  }
  if (method === "GET" && path.match(/^\/landings\/(\d+)$/)) {
    const id = Number(path.match(/^\/landings\/(\d+)$/)![1]);
    const row = await repo.getLandingById(id);
    return row ? { status: 200, data: row } : { status: 404, data: { error: "Not found" } };
  }
  if (method === "PUT" && path.match(/^\/landings\/(\d+)$/)) {
    await repo.saveLanding(Number(path.match(/^\/landings\/(\d+)$/)![1]), body);
    return { status: 200, data: { success: true } };
  }
  if (method === "POST" && path === "/landings") {
    const id = await repo.createLanding(body);
    return { status: 200, data: { success: true, id } };
  }
  if (method === "GET" && path === "/blog/list") {
    return {
      status: 200,
      data: await repo.listBlogPostsAdmin(pageNum, perPage, listQ.search, listQ.sort, listQ.order),
    };
  }
  if (method === "GET" && path.match(/^\/blog\/(\d+)$/)) {
    const row = await repo.getBlogPostById(Number(path.match(/^\/blog\/(\d+)$/)![1]));
    return row ? { status: 200, data: row } : { status: 404, data: { error: "Not found" } };
  }
  if (method === "PUT" && path.match(/^\/blog\/(\d+)$/)) {
    await repo.saveBlogPost(Number(path.match(/^\/blog\/(\d+)$/)![1]), body);
    return { status: 200, data: { success: true } };
  }
  if (method === "POST" && path === "/blog") {
    const id = await repo.createBlogPost(body);
    return { status: 200, data: { success: true, id } };
  }
  if (method === "GET" && path === "/services/list") {
    return {
      status: 200,
      data: await repo.listServicesAdmin(pageNum, perPage, listQ.search, listQ.sort, listQ.order),
    };
  }
  if (method === "GET" && path.match(/^\/services\/(\d+)$/)) {
    const row = await repo.getServiceById(Number(path.match(/^\/services\/(\d+)$/)![1]));
    return row ? { status: 200, data: row } : { status: 404, data: { error: "Not found" } };
  }
  if (method === "PUT" && path.match(/^\/services\/(\d+)$/)) {
    await repo.saveService(Number(path.match(/^\/services\/(\d+)$/)![1]), body);
    return { status: 200, data: { success: true } };
  }
  if (method === "POST" && path === "/services") {
    const id = await repo.createService(body);
    return { status: 200, data: { success: true, id } };
  }
  if (method === "GET" && path === "/portfolio/list") {
    return {
      status: 200,
      data: await repo.listPortfolioAdmin(pageNum, perPage, listQ.search, listQ.sort, listQ.order),
    };
  }
  if (method === "GET" && path.match(/^\/portfolio\/(\d+)$/)) {
    const row = await repo.getPortfolioItemById(Number(path.match(/^\/portfolio\/(\d+)$/)![1]));
    return row ? { status: 200, data: row } : { status: 404, data: { error: "Not found" } };
  }
  if (method === "PUT" && path.match(/^\/portfolio\/(\d+)$/)) {
    await repo.savePortfolioItem(Number(path.match(/^\/portfolio\/(\d+)$/)![1]), body);
    return { status: 200, data: { success: true } };
  }
  if (method === "POST" && path === "/portfolio") {
    const id = await repo.createPortfolioItem(body);
    return { status: 200, data: { success: true, id } };
  }
  if (method === "DELETE" && path.match(/^\/portfolio\/(\d+)$/)) {
    await repo.deletePortfolioItem(Number(path.match(/^\/portfolio\/(\d+)$/)![1]));
    return { status: 200, data: { success: true } };
  }
  if (method === "GET" && path === "/media/list") {
    const type = sp.get("type") || "all";
    return {
      status: 200,
      data: await media.listMedia(pageNum, perPage, type, listQ.search),
    };
  }
  if (method === "DELETE" && path.match(/^\/media\/(\d+)$/)) {
    await deleteMediaById(Number(path.match(/^\/media\/(\d+)$/)![1]));
    return { status: 200, data: { success: true } };
  }
  if (method === "PUT" && path.match(/^\/media\/(\d+)$/)) {
    const id = Number(path.match(/^\/media\/(\d+)$/)![1]);
    return { status: 200, data: { item: await updateMediaMeta(id, body) } };
  }
  if (method === "POST" && path.match(/^\/media\/(\d+)\/crop$/)) {
    const id = Number(path.match(/^\/media\/(\d+)\/crop$/)![1]);
    return { status: 200, data: { item: await cropMediaImage(id, body) } };
  }
  if (method === "GET" && path === "/community/moderation-counts") {
    return { status: 200, data: await community.countPendingModeration() };
  }
  if (method === "GET" && path === "/pricing") {
    return { status: 200, data: await repo.getPricingOptions() };
  }
  if (method === "PUT" && path === "/pricing") {
    await repo.savePricingOptions(body);
    return { status: 200, data: { success: true } };
  }
  if (method === "GET" && path === "/menus") {
    return { status: 200, data: await repo.getMenus() };
  }
  if (method === "GET" && path === "/menus/list") {
    return { status: 200, data: await listMenusMeta() };
  }
  if (method === "PUT" && path.startsWith("/menus/")) {
    const key = path.slice("/menus/".length);
    const items = (body.items as unknown[]) ?? body;
    await repo.saveMenu(key, Array.isArray(items) ? items : []);
    return { status: 200, data: { success: true } };
  }

  if (method === "GET" && path === "/homepage/sections") {
    return { status: 200, data: { pageId: await repo.getHomepagePageId() } };
  }
  if (method === "GET" && path === "/homepage/sections/list") {
    return { status: 200, data: await listHomepageSections(sp, repo) };
  }
  if (method === "POST" && path === "/homepage/sections") {
    const id = await createHomepageSection(body, repo);
    return { status: 200, data: { success: true, id } };
  }
  if (method === "GET" && path.match(/^\/homepage\/sections\/(\d+)$/)) {
    const id = Number(path.match(/^\/homepage\/sections\/(\d+)$/)![1]);
    const row = await getHomepageSectionById(id);
    return row ? { status: 200, data: row } : { status: 404, data: { error: "Not found" } };
  }
  if (method === "PUT" && path.match(/^\/homepage\/sections\/(\d+)$/)) {
    const id = Number(path.match(/^\/homepage\/sections\/(\d+)$/)![1]);
    await saveHomepageSection(id, body);
    return { status: 200, data: { success: true } };
  }
  if (method === "POST" && path.match(/^\/homepage\/sections\/(\d+)\/restore$/)) {
    const id = Number(path.match(/^\/homepage\/sections\/(\d+)\/restore$/)![1]);
    await restoreHomepageSection(id);
    return { status: 200, data: { success: true } };
  }
  if (method === "DELETE" && path.match(/^\/homepage\/sections\/(\d+)$/)) {
    const id = Number(path.match(/^\/homepage\/sections\/(\d+)$/)![1]);
    const permanent = ctx.searchParams.get("permanent") === "1";
    await deleteHomepageSection(id, permanent);
    return { status: 200, data: { success: true } };
  }

  if (method === "GET" && path === "/users/list") {
    return { status: 200, data: { items: await listUsers() } };
  }
  if (method === "POST" && path === "/users") {
    await createUser(body);
    return { status: 200, data: { success: true } };
  }
  if (method === "GET" && path.match(/^\/users\/(\d+)$/)) {
    const row = await getUserById(Number(path.match(/^\/users\/(\d+)$/)![1]));
    return row ? { status: 200, data: row } : { status: 404, data: { error: "Not found" } };
  }
  if (method === "PUT" && path.match(/^\/users\/(\d+)$/)) {
    await saveUser(Number(path.match(/^\/users\/(\d+)$/)![1]), body);
    return { status: 200, data: { success: true } };
  }

  if (method === "GET" && path === "/members/list") {
    return { status: 200, data: await listMembers(sp) };
  }
  if (method === "GET" && path.match(/^\/members\/(\d+)$/)) {
    const row = await getMemberAdmin(Number(path.match(/^\/members\/(\d+)$/)![1]));
    return row ? { status: 200, data: row } : { status: 404, data: { error: "Not found" } };
  }
  if (method === "PUT" && path.match(/^\/members\/(\d+)$/)) {
    await saveMemberAdmin(Number(path.match(/^\/members\/(\d+)$/)![1]), body);
    return { status: 200, data: { success: true } };
  }
  if (method === "DELETE" && path.match(/^\/members\/(\d+)$/)) {
    await suspendMember(Number(path.match(/^\/members\/(\d+)$/)![1]));
    return { status: 200, data: { success: true } };
  }

  if (method === "GET" && path === "/activity/list") {
    return { status: 200, data: await listAdminActivity(sp, user.id, user.role === "admin") };
  }

  if (method === "GET" && path === "/crm/smtp") {
    return { status: 200, data: await getSmtpSettings(repo) };
  }
  if (method === "PUT" && path === "/crm/smtp") {
    await saveSmtpSettings(repo, body);
    return { status: 200, data: { success: true } };
  }
  if (method === "POST" && path === "/crm/smtp/test") {
    return { status: 200, data: { success: true, message: "SMTP test request saved." } };
  }
  if (method === "GET" && path === "/crm/stats") {
    return { status: 200, data: await getCrmStatsAdmin() };
  }
  if (method === "GET" && path === "/crm/inbox") {
    return { status: 200, data: await listCrmInbox(sp) };
  }
  if (method === "GET" && path.match(/^\/crm\/messages\/(\d+)$/)) {
    return { status: 200, data: await getCrmMessageThread(Number(path.match(/^\/crm\/messages\/(\d+)$/)![1])) };
  }
  if (method === "PATCH" && path.match(/^\/crm\/messages\/(\d+)$/)) {
    return {
      status: 200,
      data: await patchCrmMessage(Number(path.match(/^\/crm\/messages\/(\d+)$/)![1]), body),
    };
  }
  if (method === "POST" && path.match(/^\/crm\/messages\/(\d+)\/reply$/)) {
    return {
      status: 200,
      data: await replyCrmMessage(Number(path.match(/^\/crm\/messages\/(\d+)\/reply$/)![1]), body, user),
    };
  }
  if (method === "POST" && path === "/crm/trash/empty") {
    return { status: 200, data: await emptyCrmTrash() };
  }
  if (method === "GET" && path === "/crm/contacts") {
    return { status: 200, data: await listCrmContacts(sp) };
  }
  if (method === "POST" && path === "/crm/compose") {
    return { status: 200, data: await composeCrmMessage(body, user) };
  }

  if (method === "GET" && path === "/forums/list") {
    return { status: 200, data: await listForumsAdmin(sp) };
  }
  if (method === "POST" && path === "/forums") {
    return { status: 200, data: { forum: await createForumAdmin(body) } };
  }
  if (method === "GET" && path.match(/^\/forums\/(\d+)$/)) {
    const row = await getForumAdmin(Number(path.match(/^\/forums\/(\d+)$/)![1]));
    return row ? { status: 200, data: row } : { status: 404, data: { error: "Not found" } };
  }
  if (method === "PUT" && path.match(/^\/forums\/(\d+)$/)) {
    await saveForumAdmin(Number(path.match(/^\/forums\/(\d+)$/)![1]), body);
    return { status: 200, data: { success: true } };
  }
  if (method === "DELETE" && path.match(/^\/forums\/(\d+)$/)) {
    await deleteForumAdmin(Number(path.match(/^\/forums\/(\d+)$/)![1]));
    return { status: 200, data: { success: true } };
  }

  if (method === "GET" && path === "/community/forum-topics/list") {
    return { status: 200, data: await listForumTopicsAdmin(sp) };
  }
  if (method === "GET" && path.match(/^\/community\/forum-topics\/(\d+)$/)) {
    const row = await getForumTopicAdmin(Number(path.match(/^\/community\/forum-topics\/(\d+)$/)![1]));
    return row ? { status: 200, data: row } : { status: 404, data: { error: "Not found" } };
  }
  if (method === "PUT" && path.match(/^\/community\/forum-topics\/(\d+)$/)) {
    await updateForumTopicStatus(Number(path.match(/^\/community\/forum-topics\/(\d+)$/)![1]), body);
    return { status: 200, data: { success: true } };
  }
  if (method === "DELETE" && path.match(/^\/community\/forum-topics\/(\d+)$/)) {
    await deleteForumTopicAdmin(Number(path.match(/^\/community\/forum-topics\/(\d+)$/)![1]));
    return { status: 200, data: { success: true } };
  }

  if (method === "GET" && path === "/community/forum-replies/list") {
    return { status: 200, data: await listForumRepliesAdmin(sp) };
  }
  if (method === "GET" && path.match(/^\/community\/forum-replies\/(\d+)$/)) {
    const row = await getForumReplyAdmin(Number(path.match(/^\/community\/forum-replies\/(\d+)$/)![1]));
    return row ? { status: 200, data: row } : { status: 404, data: { error: "Not found" } };
  }
  if (method === "PUT" && path.match(/^\/community\/forum-replies\/(\d+)$/)) {
    await updateForumReplyStatus(Number(path.match(/^\/community\/forum-replies\/(\d+)$/)![1]), body);
    return { status: 200, data: { success: true } };
  }
  if (method === "DELETE" && path.match(/^\/community\/forum-replies\/(\d+)$/)) {
    await deleteForumReplyAdmin(Number(path.match(/^\/community\/forum-replies\/(\d+)$/)![1]));
    return { status: 200, data: { success: true } };
  }

  if (method === "GET" && path === "/blog-comments/list") {
    return { status: 200, data: await listBlogCommentsAdmin(sp) };
  }
  if (method === "GET" && path.match(/^\/blog-comments\/(\d+)$/)) {
    const row = await getBlogCommentAdmin(Number(path.match(/^\/blog-comments\/(\d+)$/)![1]));
    return row ? { status: 200, data: row } : { status: 404, data: { error: "Not found" } };
  }
  if (method === "PUT" && path.match(/^\/blog-comments\/(\d+)$/)) {
    await updateBlogCommentStatus(Number(path.match(/^\/blog-comments\/(\d+)$/)![1]), body);
    return { status: 200, data: { success: true } };
  }
  if (method === "DELETE" && path.match(/^\/blog-comments\/(\d+)$/)) {
    await deleteBlogCommentAdmin(Number(path.match(/^\/blog-comments\/(\d+)$/)![1]));
    return { status: 200, data: { success: true } };
  }

  if (method === "GET" && path === "/community/member-blogs/list") {
    return { status: 200, data: await listMemberBlogsAdmin(sp) };
  }
  if (method === "PUT" && path.match(/^\/blog\/(\d+)\/moderate$/)) {
    await moderateBlogPost(Number(path.match(/^\/blog\/(\d+)\/moderate$/)![1]), body);
    return { status: 200, data: { success: true } };
  }
  if (method === "PUT" && path.match(/^\/pages\/(\d+)\/display-mode$/)) {
    const id = Number(path.match(/^\/pages\/(\d+)\/display-mode$/)![1]);
    await setEntityDisplayMode("page", id, normalizeDisplayModeInput(body.display_mode));
    return { status: 200, data: { success: true } };
  }
  if (method === "PUT" && path.match(/^\/services\/(\d+)\/display-mode$/)) {
    const id = Number(path.match(/^\/services\/(\d+)\/display-mode$/)![1]);
    await setEntityDisplayMode("service", id, normalizeDisplayModeInput(body.display_mode));
    return { status: 200, data: { success: true } };
  }
  if (method === "PUT" && path.match(/^\/landings\/(\d+)\/display-mode$/)) {
    const id = Number(path.match(/^\/landings\/(\d+)\/display-mode$/)![1]);
    await setEntityDisplayMode("service_landing", id, normalizeDisplayModeInput(body.display_mode));
    return { status: 200, data: { success: true } };
  }
  if (method === "PUT" && path.match(/^\/blog\/(\d+)\/display-mode$/)) {
    const id = Number(path.match(/^\/blog\/(\d+)\/display-mode$/)![1]);
    await setEntityDisplayMode("blog_post", id, normalizeDisplayModeInput(body.display_mode));
    return { status: 200, data: { success: true } };
  }
  if (method === "GET" && path.match(/^\/desimentor\/(page|homepage|service_landing|service|blog_post)\/(\d+)$/)) {
    const m = path.match(/^\/desimentor\/(page|homepage|service_landing|service|blog_post)\/(\d+)$/)!;
    return desimentorDocumentGetResponse(m[1], Number(m[2]));
  }
  if (method === "PUT" && path.match(/^\/desimentor\/(page|homepage|service_landing|service|blog_post)\/(\d+)$/)) {
    const m = path.match(/^\/desimentor\/(page|homepage|service_landing|service|blog_post)\/(\d+)$/)!;
    const entityType = m[1];
    const entityId = Number(m[2]);
    await ensureDesimentorTables();
    const content = desimentorInputContent(body);
    const status = String(body.status ?? "draft") === "published" ? "published" : "draft";
    const document = await saveDesimentorDocument(entityType, entityId, content, status);
    return { status: 200, data: { success: true, document } };
  }
  if (method === "POST" && path.match(/^\/desimentor\/(page|homepage|service_landing|service|blog_post)\/(\d+)\/publish$/)) {
    const m = path.match(/^\/desimentor\/(page|homepage|service_landing|service|blog_post)\/(\d+)\/publish$/)!;
    const entityType = m[1];
    const entityId = Number(m[2]);
    await ensureDesimentorTables();
    const document = await publishDesimentorDocument(entityType, entityId);
    const useOnSite = body.useOnSite !== false;
    let displayMode: string | undefined;
    if (useOnSite) {
      displayMode = await setEntityDisplayMode(entityType, entityId, "elementor");
    }
    return { status: 200, data: { success: true, document, display_mode: displayMode } };
  }
  if (method === "GET" && path === "/desimentor/templates") {
    try {
      await ensureDesimentorTables();
      const category = String(sp.get("category") ?? "all");
      return { status: 200, data: { items: await listDesimentorTemplates(category) } };
    } catch (e) {
      if (isDbBusyError(e)) {
        return {
          status: 503,
          data: { error: "Database busy. Please retry in a moment.", code: "DB_TOO_MANY_CONNECTIONS", items: [] },
        };
      }
      return { status: 200, data: { items: [] } };
    }
  }
  if (method === "POST" && path === "/desimentor/templates") {
    await ensureDesimentorTables();
    const template = await saveDesimentorTemplate(body);
    return { status: 200, data: { success: true, template } };
  }
  if (method === "GET" && path === "/desimentor/preview") {
    const token = String(sp.get("token") ?? "");
    const parsed = parseDesimentorPreviewToken(token);
    if (!parsed) return { status: 400, data: { error: "Invalid preview token." } };
    try {
      await ensureDesimentorTables();
      const doc = await getDesimentorDocument(parsed.entityType, parsed.entityId);
      return { status: 200, data: { content: doc?.content ?? emptyDesimentorDocument() } };
    } catch {
      return { status: 200, data: { content: emptyDesimentorDocument() } };
    }
  }

  return notImplemented(path);
}

type Row = RowDataPacket;

function parseJson(raw: unknown): Record<string, unknown> {
  if (raw && typeof raw === "object" && !Array.isArray(raw)) return raw as Record<string, unknown>;
  if (typeof raw !== "string") return {};
  try {
    const data = JSON.parse(raw) as unknown;
    return data && typeof data === "object" && !Array.isArray(data) ? (data as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

async function listMenusMeta() {
  const data = await contentRepository().getMenus();
  const defs = [
    { key: "primary", label: "Primary Menu" },
    { key: "footer", label: "Footer Company" },
    { key: "footerServices", label: "Footer Services" },
    { key: "footerProducts", label: "Footer Products" },
  ];
  return defs.map((d) => ({
    key: d.key,
    label: d.label,
    count: Array.isArray(data[d.key]) ? data[d.key].length : 0,
  }));
}

async function listHomepageSections(sp: URLSearchParams, repo: ReturnType<typeof contentRepository>) {
  const page = Math.max(1, Number(sp.get("page") ?? 1));
  const perPage = Math.min(50, Math.max(5, Number(sp.get("perPage") ?? 10)));
  const statusFilter = (sp.get("status") || "all").toLowerCase();
  const search = (sp.get("search") || "").trim().toLowerCase();
  const sort = sp.get("sort") || "sort_order";
  const order = (sp.get("order") || "asc").toLowerCase() === "desc" ? "desc" : "asc";
  const pageId = await repo.getHomepagePageId();
  if (!pageId) {
    return {
      pageId: 0,
      items: [],
      total: 0,
      page: 1,
      perPage,
      status: statusFilter,
      counts: { all: 0, published: 0, draft: 0, trash: 0 },
    };
  }
  const [rows] = await getPool().query<Row[]>(
    `SELECT id, sort_order, layout, status, admin_title, payload, updated_at
     FROM homepage_sections WHERE page_id = ?`,
    [pageId],
  );
  const normalized = rows.map((r) => {
    const payload = parseJson(r.payload);
    const title =
      String(r.admin_title ?? "").trim() ||
      String(payload.title ?? payload.headline ?? payload.badge ?? "").trim() ||
      String(r.layout ?? "");
    return {
      id: Number(r.id),
      sortOrder: Number(r.sort_order ?? 0),
      layout: String(r.layout ?? ""),
      title,
      status: String(r.status ?? "draft"),
      updated_at: String(r.updated_at ?? ""),
      searchBlob: JSON.stringify(payload).toLowerCase(),
    };
  });
  const counts = {
    all: normalized.length,
    published: normalized.filter((r) => r.status === "published").length,
    draft: normalized.filter((r) => r.status === "draft").length,
    trash: normalized.filter((r) => r.status === "trash").length,
  };
  let filtered = normalized;
  if (statusFilter !== "all") filtered = filtered.filter((r) => r.status === statusFilter);
  if (search) {
    filtered = filtered.filter(
      (r) =>
        r.title.toLowerCase().includes(search) ||
        r.layout.toLowerCase().includes(search) ||
        r.searchBlob.includes(search),
    );
  }
  const dir = order === "desc" ? -1 : 1;
  filtered.sort((a, b) => {
    if (sort === "title") return a.title.localeCompare(b.title) * dir;
    if (sort === "layout") return a.layout.localeCompare(b.layout) * dir;
    if (sort === "updated_at" || sort === "updated") return a.updated_at.localeCompare(b.updated_at) * dir;
    return (a.sortOrder - b.sortOrder) * dir;
  });
  const total = filtered.length;
  const offset = (page - 1) * perPage;
  const items = filtered.slice(offset, offset + perPage).map((r) => ({
    id: r.id,
    sortOrder: r.sortOrder,
    layout: r.layout,
    title: r.title,
    status: r.status,
    updated_at: r.updated_at,
  }));
  return { pageId, items, total, page, perPage, status: statusFilter, counts };
}

async function getHomepageSectionById(id: number) {
  const [rows] = await getPool().query<Row[]>(
    "SELECT id, page_id, layout, status, admin_title, payload FROM homepage_sections WHERE id = ? LIMIT 1",
    [id],
  );
  const row = rows[0];
  if (!row) return null;
  return {
    id: Number(row.id),
    pageId: Number(row.page_id),
    layout: String(row.layout ?? ""),
    status: String(row.status ?? "draft"),
    adminTitle: String(row.admin_title ?? ""),
    section: parseJson(row.payload),
  };
}

async function createHomepageSection(body: Record<string, unknown>, repo: ReturnType<typeof contentRepository>) {
  const section = parseJson(body.section);
  const layout = String(section.acfFcLayout ?? "cta");
  section.acfFcLayout = layout;
  const status = String(body.status ?? "draft");
  const adminTitle = String(body.adminTitle ?? "");
  let pageId = await repo.getHomepagePageId();
  if (!pageId) {
    const id = await repo.createPage({ slug: "home", title: "Home", status: "published" });
    await getPool().query("UPDATE pages SET is_homepage = 1 WHERE id = ?", [id]);
    pageId = id;
  }
  const [[mx]] = await getPool().query<Row[]>(
    "SELECT COALESCE(MAX(sort_order), -1) AS mx FROM homepage_sections WHERE page_id = ?",
    [pageId],
  );
  const nextSort = Number(mx?.mx ?? -1) + 1;
  const [result] = await getPool().query(
    `INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [pageId, nextSort, layout, status, adminTitle, JSON.stringify(section)],
  );
  return Number((result as { insertId: number }).insertId);
}

async function saveHomepageSection(id: number, body: Record<string, unknown>) {
  const section = parseJson(body.section);
  const layout = String(section.acfFcLayout ?? "cta");
  section.acfFcLayout = layout;
  const status = String(body.status ?? "draft");
  const adminTitle = String(body.adminTitle ?? "");
  await getPool().query(
    `UPDATE homepage_sections
     SET layout = ?, status = ?, admin_title = ?, payload = ?
     WHERE id = ?`,
    [layout, status, adminTitle, JSON.stringify(section), id],
  );
}

async function restoreHomepageSection(id: number) {
  await getPool().query("UPDATE homepage_sections SET status = 'draft' WHERE id = ?", [id]);
}

async function deleteHomepageSection(id: number, permanent: boolean) {
  if (permanent) {
    await getPool().query("DELETE FROM homepage_sections WHERE id = ?", [id]);
    return;
  }
  await getPool().query("UPDATE homepage_sections SET status = 'trash' WHERE id = ?", [id]);
}

async function listUsers() {
  const [rows] = await getPool().query<Row[]>(
    "SELECT id, username, display_name, role, created_at FROM users ORDER BY id DESC",
  );
  return rows.map((r) => ({
    id: Number(r.id),
    username: String(r.username),
    displayName: String(r.display_name ?? ""),
    role: String(r.role) === "admin" ? "admin" : "user",
    createdAt: String(r.created_at ?? "").slice(0, 10),
  }));
}

async function getUserById(id: number) {
  const [rows] = await getPool().query<Row[]>(
    "SELECT id, username, display_name, role FROM users WHERE id = ? LIMIT 1",
    [id],
  );
  const r = rows[0];
  if (!r) return null;
  return {
    id: Number(r.id),
    username: String(r.username),
    displayName: String(r.display_name ?? ""),
    role: String(r.role) === "admin" ? "admin" : "user",
  };
}

async function createUser(body: Record<string, unknown>) {
  const username = String(body.username ?? "").trim();
  const displayName = String(body.displayName ?? "").trim();
  const role = String(body.role ?? "user") === "admin" ? "admin" : "user";
  const password = String(body.password ?? "");
  if (username.length < 3) throw new Error("Username must be at least 3 characters.");
  if (!displayName) throw new Error("Display name is required.");
  if (password.length < 8) throw new Error("Password must be at least 8 characters.");
  const hash = await bcrypt.hash(password, 10);
  await getPool().query(
    "INSERT INTO users (username, password_hash, display_name, role) VALUES (?, ?, ?, ?)",
    [username, hash, displayName, role],
  );
}

async function saveUser(id: number, body: Record<string, unknown>) {
  const displayName = String(body.displayName ?? "").trim();
  const role = String(body.role ?? "user") === "admin" ? "admin" : "user";
  if (!displayName) throw new Error("Display name is required.");
  if (String(body.password ?? "").trim()) {
    const password = String(body.password);
    if (password.length < 8) throw new Error("Password must be at least 8 characters.");
    const hash = await bcrypt.hash(password, 10);
    await getPool().query(
      "UPDATE users SET display_name = ?, role = ?, password_hash = ? WHERE id = ?",
      [displayName, role, hash, id],
    );
    return;
  }
  await getPool().query("UPDATE users SET display_name = ?, role = ? WHERE id = ?", [displayName, role, id]);
}

async function listMembers(sp: URLSearchParams) {
  const page = Math.max(1, Number(sp.get("page") ?? 1));
  const perPage = Math.min(50, Math.max(5, Number(sp.get("perPage") ?? 15)));
  const status = (sp.get("status") || "all").toLowerCase();
  const search = (sp.get("search") || "").trim();
  const where: string[] = ["1=1"];
  const params: unknown[] = [];
  if (status !== "all") {
    where.push("status = ?");
    params.push(status);
  }
  if (search) {
    where.push("(email LIKE ? OR display_name LIKE ?)");
    params.push(`%${search}%`, `%${search}%`);
  }
  const whereSql = where.join(" AND ");
  const [[countRow]] = await getPool().query<Row[]>(`SELECT COUNT(*) AS c FROM members WHERE ${whereSql}`, params);
  const total = Number(countRow?.c ?? 0);
  const offset = (page - 1) * perPage;
  const [rows] = await getPool().query<Row[]>(
    `SELECT id, email, display_name, status, created_at FROM members
     WHERE ${whereSql} ORDER BY id DESC LIMIT ? OFFSET ?`,
    [...params, perPage, offset],
  );
  return {
    items: rows.map((r) => ({
      id: Number(r.id),
      email: String(r.email),
      displayName: String(r.display_name ?? ""),
      status: String(r.status ?? "active"),
      createdAt: String(r.created_at ?? "").slice(0, 10),
    })),
    total,
    page,
    perPage,
  };
}

async function getMemberAdmin(id: number) {
  const [rows] = await getPool().query<Row[]>(
    "SELECT id, display_name, status FROM members WHERE id = ? LIMIT 1",
    [id],
  );
  const r = rows[0];
  if (!r) return null;
  return { id: Number(r.id), displayName: String(r.display_name ?? ""), status: String(r.status ?? "active") };
}

async function saveMemberAdmin(id: number, body: Record<string, unknown>) {
  const displayName = String(body.displayName ?? "").trim();
  const status = String(body.status ?? "active") === "suspended" ? "suspended" : "active";
  if (!displayName) throw new Error("Display name is required.");
  if (String(body.password ?? "").trim()) {
    const password = String(body.password);
    if (password.length < 8) throw new Error("Password must be at least 8 characters.");
    const hash = await bcrypt.hash(password, 10);
    await getPool().query("UPDATE members SET display_name = ?, status = ?, password_hash = ? WHERE id = ?", [
      displayName,
      status,
      hash,
      id,
    ]);
    return;
  }
  await getPool().query("UPDATE members SET display_name = ?, status = ? WHERE id = ?", [displayName, status, id]);
}

async function suspendMember(id: number) {
  await getPool().query("UPDATE members SET status = 'suspended' WHERE id = ?", [id]);
}

function actionToTask(action: string) {
  if (action.includes("page")) return { task: "pages", taskLabel: "Pages" };
  if (action.includes("blog")) return { task: "blog", taskLabel: "Blog" };
  if (action.includes("menu")) return { task: "menus", taskLabel: "Menus" };
  if (action.includes("service")) return { task: "services", taskLabel: "Services" };
  if (action.includes("landing")) return { task: "landings", taskLabel: "Service Landings" };
  if (action.includes("portfolio")) return { task: "portfolio", taskLabel: "Portfolio" };
  if (action.includes("user")) return { task: "users", taskLabel: "Users" };
  if (action.includes("member")) return { task: "members", taskLabel: "Members" };
  return { task: "general", taskLabel: "General" };
}

async function listAdminActivity(sp: URLSearchParams, currentUserId: number, isAdmin: boolean) {
  const page = Math.max(1, Number(sp.get("page") ?? 1));
  const perPage = Math.min(100, Math.max(5, Number(sp.get("perPage") ?? 25)));
  const userId = Number(sp.get("userId") || 0);
  const q = (sp.get("q") || "").trim();
  const task = (sp.get("task") || "").trim();
  const where: string[] = ["1=1"];
  const params: unknown[] = [];
  if (isAdmin && userId > 0) {
    where.push("user_id = ?");
    params.push(userId);
  }
  if (!isAdmin) {
    where.push("user_id = ?");
    params.push(currentUserId);
  }
  if (task) {
    where.push("action LIKE ?");
    params.push(`%${task}%`);
  }
  if (q) {
    where.push("(summary LIKE ? OR username LIKE ? OR action LIKE ?)");
    params.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }
  const whereSql = where.join(" AND ");
  const [[countRow]] = await getPool().query<Row[]>(
    `SELECT COUNT(*) AS c FROM admin_activity_log WHERE ${whereSql}`,
    params,
  );
  const total = Number(countRow?.c ?? 0);
  const offset = (page - 1) * perPage;
  const [rows] = await getPool().query<Row[]>(
    `SELECT id, user_id, username, action, method, path, summary, ip_address, created_at
     FROM admin_activity_log WHERE ${whereSql}
     ORDER BY id DESC LIMIT ? OFFSET ?`,
    [...params, perPage, offset],
  );
  const items = rows.map((r) => {
    const taskInfo = actionToTask(String(r.action ?? ""));
    const method = String(r.method ?? "").toUpperCase();
    let verb = "Updated";
    if (method === "POST") verb = "Created";
    if (method === "DELETE") verb = "Deleted";
    return {
      id: Number(r.id),
      userId: Number(r.user_id),
      username: String(r.username ?? ""),
      summary: String(r.summary ?? ""),
      task: taskInfo.task,
      taskLabel: taskInfo.taskLabel,
      verb,
      hint: String(r.path ?? ""),
      ipAddress: r.ip_address ? String(r.ip_address) : null,
      createdAt: String(r.created_at ?? ""),
    };
  });
  const taskFilters = [
    { id: "", label: "All tasks" },
    { id: "pages", label: "Pages" },
    { id: "blog", label: "Blog" },
    { id: "menus", label: "Menus" },
    { id: "services", label: "Services" },
    { id: "landings", label: "Service Landings" },
    { id: "portfolio", label: "Portfolio" },
    { id: "users", label: "Users" },
    { id: "members", label: "Members" },
  ];
  return { items, total, taskFilters };
}

function normalizeSmtpPayload(input: Record<string, unknown>, existing: Record<string, unknown>) {
  const keepMasked = String(input.smtpPassword ?? "") === "********";
  const nextPassword = keepMasked ? String(existing.smtpPassword ?? "") : String(input.smtpPassword ?? "");
  return {
    smtpHost: String(input.smtpHost ?? existing.smtpHost ?? "smtp.hostinger.com"),
    smtpPort: String(input.smtpPort ?? existing.smtpPort ?? "587"),
    smtpEncryption: String(input.smtpEncryption ?? existing.smtpEncryption ?? "tls"),
    smtpUsername: String(input.smtpUsername ?? existing.smtpUsername ?? ""),
    smtpFromEmail: String(input.smtpFromEmail ?? existing.smtpFromEmail ?? ""),
    smtpFromName: String(input.smtpFromName ?? existing.smtpFromName ?? "CWS India"),
    smtpPassword: nextPassword,
  };
}

async function getSmtpSettings(repo: ReturnType<typeof contentRepository>) {
  const settings = await repo.getSiteSettings();
  return {
    smtpHost: String(settings.smtpHost ?? "smtp.hostinger.com"),
    smtpPort: String(settings.smtpPort ?? "587"),
    smtpEncryption: String(settings.smtpEncryption ?? "tls"),
    smtpUsername: String(settings.smtpUsername ?? ""),
    smtpFromEmail: String(settings.smtpFromEmail ?? ""),
    smtpFromName: String(settings.smtpFromName ?? "CWS India"),
    hasPassword: Boolean(String(settings.smtpPassword ?? "").trim()),
  };
}

async function saveSmtpSettings(repo: ReturnType<typeof contentRepository>, body: Record<string, unknown>) {
  const settings = await repo.getSiteSettings();
  const smtp = normalizeSmtpPayload(body, settings);
  await repo.saveSiteSettings({ ...settings, ...smtp });
}

async function getCrmStatsAdmin() {
  const [[r]] = await getPool().query<Row[]>(
    "SELECT COUNT(*) AS unread FROM form_submissions WHERE direction='inbound' AND folder='inbox' AND is_read=0",
  );
  const [[inbox]] = await getPool().query<Row[]>("SELECT COUNT(*) AS c FROM form_submissions WHERE folder='inbox'");
  const [[starred]] = await getPool().query<Row[]>(
    "SELECT COUNT(*) AS c FROM form_submissions WHERE is_starred=1 AND folder!='trash'",
  );
  const [[trash]] = await getPool().query<Row[]>("SELECT COUNT(*) AS c FROM form_submissions WHERE folder='trash'");
  const [cats] = await getPool().query<Row[]>(
    "SELECT form_type, COUNT(*) AS c FROM form_submissions WHERE folder='inbox' GROUP BY form_type",
  );
  const byCategory: Record<string, number> = {};
  for (const c of cats) byCategory[String(c.form_type)] = Number(c.c ?? 0);
  return {
    inbox: Number(inbox?.c ?? 0),
    unread: Number(r?.unread ?? 0),
    starred: Number(starred?.c ?? 0),
    trash: Number(trash?.c ?? 0),
    byCategory,
  };
}

async function listCrmInbox(sp: URLSearchParams) {
  const folder = (sp.get("folder") || "inbox").toLowerCase();
  const category = (sp.get("category") || "all").toLowerCase();
  const q = (sp.get("q") || "").trim();
  const page = Math.max(1, Number(sp.get("page") ?? 1));
  const perPage = Math.min(100, Math.max(5, Number(sp.get("perPage") ?? 50)));
  const where: string[] = ["folder = ?"];
  const params: unknown[] = [folder];
  if (folder === "inbox" && category !== "all") {
    if (category === "unread") where.push("is_read = 0");
    else if (category === "starred") where.push("is_starred = 1");
    else {
      where.push("form_type = ?");
      params.push(category);
    }
  }
  if (q) {
    where.push("(subject LIKE ? OR snippet LIKE ? OR from_name LIKE ? OR from_email LIKE ?)");
    params.push(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`);
  }
  const offset = (page - 1) * perPage;
  const [rows] = await getPool().query<Row[]>(
    `SELECT id, form_type, from_name, from_email, subject, snippet, is_read, is_starred, folder, direction, created_at, last_activity_at
     FROM form_submissions WHERE ${where.join(" AND ")}
     ORDER BY COALESCE(last_activity_at, created_at) DESC, id DESC LIMIT ? OFFSET ?`,
    [...params, perPage, offset],
  );
  return {
    items: rows.map((r) => ({
      id: Number(r.id),
      formType: String(r.form_type ?? ""),
      fromName: r.from_name ? String(r.from_name) : null,
      fromEmail: r.from_email ? String(r.from_email) : null,
      subject: r.subject ? String(r.subject) : null,
      snippet: r.snippet ? String(r.snippet) : null,
      isRead: Boolean(r.is_read),
      isStarred: Boolean(r.is_starred),
      folder: String(r.folder ?? "inbox"),
      direction: String(r.direction ?? "inbound"),
      createdAt: String(r.created_at ?? ""),
      lastActivityAt: String(r.last_activity_at ?? r.created_at ?? ""),
    })),
  };
}

async function getCrmMessageThread(id: number) {
  const [rows] = await getPool().query<Row[]>(
    "SELECT * FROM form_submissions WHERE id = ? LIMIT 1",
    [id],
  );
  const msg = rows[0];
  if (!msg) throw new Error("Message not found");
  const threadId = Number(msg.thread_id ?? msg.id);
  const [threadRows] = await getPool().query<Row[]>(
    "SELECT * FROM form_submissions WHERE thread_id = ? ORDER BY created_at ASC, id ASC",
    [threadId],
  );
  const map = (r: Row) => ({
    id: Number(r.id),
    formType: String(r.form_type ?? ""),
    fromName: r.from_name ? String(r.from_name) : null,
    fromEmail: r.from_email ? String(r.from_email) : null,
    subject: r.subject ? String(r.subject) : null,
    snippet: r.snippet ? String(r.snippet) : null,
    isRead: Boolean(r.is_read),
    isStarred: Boolean(r.is_starred),
    folder: String(r.folder ?? "inbox"),
    direction: String(r.direction ?? "inbound"),
    createdAt: String(r.created_at ?? ""),
    lastActivityAt: String(r.last_activity_at ?? r.created_at ?? ""),
    parentId: r.parent_id ? Number(r.parent_id) : null,
    payload: parseJson(r.payload),
    bodyHtml: String(parseJson(r.payload).html ?? parseJson(r.payload).message ?? parseJson(r.payload).body ?? r.snippet ?? ""),
  });
  return { message: map(msg), thread: threadRows.map(map) };
}

async function patchCrmMessage(id: number, body: Record<string, unknown>) {
  const updates: string[] = [];
  const params: unknown[] = [];
  if ("is_read" in body) {
    updates.push("is_read = ?");
    params.push(body.is_read ? 1 : 0);
  }
  if ("is_starred" in body) {
    updates.push("is_starred = ?");
    params.push(body.is_starred ? 1 : 0);
  }
  if ("folder" in body) {
    updates.push("folder = ?");
    params.push(String(body.folder ?? "inbox"));
  }
  if (!updates.length) return await getCrmMessageThread(id);
  updates.push("last_activity_at = NOW()");
  params.push(id);
  await getPool().query(`UPDATE form_submissions SET ${updates.join(", ")} WHERE id = ?`, params);
  return await getCrmMessageThread(id);
}

async function replyCrmMessage(id: number, body: Record<string, unknown>, user: { id: number; username: string }) {
  const [rows] = await getPool().query<Row[]>("SELECT * FROM form_submissions WHERE id = ? LIMIT 1", [id]);
  const base = rows[0];
  if (!base) throw new Error("Message not found");
  const threadId = Number(base.thread_id ?? base.id);
  const html = String(body.html ?? "").trim();
  const payload = { html, message: html };
  const [res] = await getPool().query(
    `INSERT INTO form_submissions
     (form_type, payload, from_name, from_email, subject, snippet, thread_id, parent_id, folder, is_read, is_starred, direction, created_at, last_activity_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'sent', 1, 0, 'outbound', NOW(), NOW())`,
    [
      String(base.form_type ?? "contact"),
      JSON.stringify(payload),
      user.username,
      null,
      String(base.subject ?? "Reply"),
      html.replace(/<[^>]*>/g, "").slice(0, 500),
      threadId,
      id,
    ],
  );
  await getPool().query("UPDATE form_submissions SET last_activity_at = NOW() WHERE id = ?", [id]);
  return { success: true, id: Number((res as { insertId: number }).insertId) };
}

async function emptyCrmTrash() {
  const [res] = await getPool().query("DELETE FROM form_submissions WHERE folder = 'trash'");
  return { deleted: Number((res as { affectedRows: number }).affectedRows ?? 0) };
}

async function listCrmContacts(sp: URLSearchParams) {
  const q = (sp.get("q") || "").trim();
  const where = q ? "AND (from_email LIKE ? OR from_name LIKE ?)" : "";
  const params: unknown[] = q ? [`%${q}%`, `%${q}%`] : [];
  const [rows] = await getPool().query<Row[]>(
    `SELECT MIN(id) AS submission_id, from_email, MAX(from_name) AS from_name, MAX(form_type) AS form_type,
            MAX(COALESCE(last_activity_at, created_at)) AS last_seen
     FROM form_submissions
     WHERE from_email IS NOT NULL AND from_email <> '' ${where}
     GROUP BY from_email
     ORDER BY last_seen DESC
     LIMIT 200`,
    params,
  );
  return {
    items: rows.map((r) => ({
      submissionId: Number(r.submission_id),
      email: String(r.from_email),
      name: r.from_name ? String(r.from_name) : null,
      formType: String(r.form_type ?? "contact"),
      lastSeen: String(r.last_seen ?? ""),
    })),
  };
}

async function composeCrmMessage(body: Record<string, unknown>, user: { username: string }) {
  const subject = String(body.subject ?? "").trim();
  const html = String(body.html ?? "").trim();
  const recipients = Array.isArray(body.recipients) ? body.recipients : [];
  const to = String(body.to ?? "");
  const extra = to
    .split(/[\s,;]+/)
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e.includes("@"));
  const merged = new Map<string, { email: string; name?: string | null; submissionId?: number }>();
  for (const r of recipients) {
    const email = String((r as Record<string, unknown>).email ?? "").trim().toLowerCase();
    if (!email) continue;
    merged.set(email, {
      email,
      name: ((r as Record<string, unknown>).name as string | null) ?? null,
      submissionId: Number((r as Record<string, unknown>).submissionId ?? 0) || undefined,
    });
  }
  for (const e of extra) if (!merged.has(e)) merged.set(e, { email: e });
  const list = [...merged.values()];
  for (const r of list) {
    await getPool().query(
      `INSERT INTO form_submissions
       (form_type, payload, from_name, from_email, subject, snippet, thread_id, parent_id, folder, is_read, is_starred, direction, created_at, last_activity_at)
       VALUES ('compose', ?, ?, ?, ?, ?, NULL, NULL, 'sent', 1, 0, 'outbound', NOW(), NOW())`,
      [
        JSON.stringify({ html, message: html, to: r.email }),
        user.username,
        r.email,
        subject,
        html.replace(/<[^>]*>/g, "").slice(0, 500),
      ],
    );
  }
  return { sent: list.length, failed: [], total: list.length };
}

async function listForumsAdmin(sp: URLSearchParams) {
  const page = Math.max(1, Number(sp.get("page") ?? 1));
  const perPage = Math.min(50, Math.max(5, Number(sp.get("perPage") ?? 20)));
  const status = (sp.get("status") || "all").toLowerCase();
  const search = (sp.get("search") || "").trim();
  const where = ["1=1"];
  const params: unknown[] = [];
  if (status !== "all") {
    where.push("f.status = ?");
    params.push(status);
  }
  if (search) {
    where.push("(f.title LIKE ? OR f.slug LIKE ?)");
    params.push(`%${search}%`, `%${search}%`);
  }
  const whereSql = where.join(" AND ");
  const [[countRow]] = await getPool().query<Row[]>(
    `SELECT COUNT(*) AS c FROM forums f WHERE ${whereSql}`,
    params,
  );
  const total = Number(countRow?.c ?? 0);
  const offset = (page - 1) * perPage;
  const [rows] = await getPool().query<Row[]>(
    `SELECT f.id, f.title, f.slug, f.status, f.sort_order,
            (SELECT COUNT(*) FROM forum_topics t WHERE t.forum_id = f.id) AS topic_count
     FROM forums f
     WHERE ${whereSql}
     ORDER BY f.sort_order ASC, f.id ASC LIMIT ? OFFSET ?`,
    [...params, perPage, offset],
  );
  return {
    items: rows.map((r) => ({
      id: Number(r.id),
      title: String(r.title),
      slug: String(r.slug),
      status: String(r.status ?? "draft"),
      sortOrder: Number(r.sort_order ?? 0),
      topicCount: Number(r.topic_count ?? 0),
    })),
    total,
    page,
    perPage,
  };
}

async function getForumAdmin(id: number) {
  const [rows] = await getPool().query<Row[]>(
    "SELECT id, title, slug, description, icon, status, sort_order FROM forums WHERE id = ? LIMIT 1",
    [id],
  );
  const r = rows[0];
  if (!r) return null;
  return {
    id: Number(r.id),
    title: String(r.title),
    slug: String(r.slug),
    description: String(r.description ?? ""),
    icon: String(r.icon ?? "fa-comments"),
    status: String(r.status ?? "draft"),
    sortOrder: Number(r.sort_order ?? 0),
  };
}

async function createForumAdmin(body: Record<string, unknown>) {
  const title = String(body.title ?? "").trim();
  if (!title) throw new Error("Title is required.");
  const slug = String(body.slug ?? "").trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const [res] = await getPool().query(
    "INSERT INTO forums (title, slug, description, icon, status, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
    [
      title,
      slug,
      String(body.description ?? ""),
      String(body.icon ?? "fa-comments"),
      String(body.status ?? "published"),
      Number(body.sortOrder ?? 0),
    ],
  );
  const id = Number((res as { insertId: number }).insertId);
  return (await getForumAdmin(id))!;
}

async function saveForumAdmin(id: number, body: Record<string, unknown>) {
  await getPool().query(
    "UPDATE forums SET title = ?, slug = ?, description = ?, icon = ?, status = ?, sort_order = ? WHERE id = ?",
    [
      String(body.title ?? ""),
      String(body.slug ?? ""),
      String(body.description ?? ""),
      String(body.icon ?? "fa-comments"),
      String(body.status ?? "published"),
      Number(body.sortOrder ?? 0),
      id,
    ],
  );
}

async function deleteForumAdmin(id: number) {
  await getPool().query("DELETE FROM forums WHERE id = ?", [id]);
}

async function listForumTopicsAdmin(sp: URLSearchParams) {
  const page = Math.max(1, Number(sp.get("page") ?? 1));
  const perPage = Math.min(50, Math.max(5, Number(sp.get("perPage") ?? 15)));
  const status = (sp.get("status") || "all").toLowerCase();
  const search = (sp.get("search") || "").trim();
  const where = ["1=1"];
  const params: unknown[] = [];
  if (status !== "all") {
    where.push("t.status = ?");
    params.push(status);
  }
  if (search) {
    where.push("(t.title LIKE ? OR m.display_name LIKE ? OR f.title LIKE ?)");
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  const whereSql = where.join(" AND ");
  const [[countRow]] = await getPool().query<Row[]>(
    `SELECT COUNT(*) AS c FROM forum_topics t
     JOIN forums f ON f.id=t.forum_id
     JOIN members m ON m.id=t.member_id
     WHERE ${whereSql}`,
    params,
  );
  const total = Number(countRow?.c ?? 0);
  const offset = (page - 1) * perPage;
  const [rows] = await getPool().query<Row[]>(
    `SELECT t.id,t.title,t.slug,t.status,t.created_at,m.display_name,f.title AS forum_title,f.slug AS forum_slug
     FROM forum_topics t
     JOIN forums f ON f.id=t.forum_id
     JOIN members m ON m.id=t.member_id
     WHERE ${whereSql}
     ORDER BY t.id DESC LIMIT ? OFFSET ?`,
    [...params, perPage, offset],
  );
  return {
    items: rows.map((r) => ({
      id: Number(r.id),
      title: String(r.title),
      slug: String(r.slug),
      status: String(r.status),
      authorName: String(r.display_name ?? ""),
      forumTitle: String(r.forum_title ?? ""),
      forumSlug: String(r.forum_slug ?? ""),
      createdAt: String(r.created_at ?? ""),
    })),
    total,
    page,
    perPage,
  };
}

async function getForumTopicAdmin(id: number) {
  const [rows] = await getPool().query<Row[]>(
    `SELECT t.id,t.title,t.slug,t.body,t.status,t.created_at,m.display_name,f.title AS forum_title,f.slug AS forum_slug
     FROM forum_topics t
     JOIN forums f ON f.id=t.forum_id
     JOIN members m ON m.id=t.member_id
     WHERE t.id = ? LIMIT 1`,
    [id],
  );
  const r = rows[0];
  if (!r) return null;
  return {
    id: Number(r.id),
    title: String(r.title),
    slug: String(r.slug),
    body: String(r.body ?? ""),
    status: String(r.status),
    authorName: String(r.display_name ?? ""),
    forumTitle: String(r.forum_title ?? ""),
    forumSlug: String(r.forum_slug ?? ""),
    createdAt: String(r.created_at ?? ""),
  };
}

async function updateForumTopicStatus(id: number, body: Record<string, unknown>) {
  await getPool().query("UPDATE forum_topics SET status = ? WHERE id = ?", [String(body.status ?? "pending"), id]);
}

async function deleteForumTopicAdmin(id: number) {
  await getPool().query("DELETE FROM forum_topics WHERE id = ?", [id]);
}

async function listForumRepliesAdmin(sp: URLSearchParams) {
  const page = Math.max(1, Number(sp.get("page") ?? 1));
  const perPage = Math.min(50, Math.max(5, Number(sp.get("perPage") ?? 15)));
  const status = (sp.get("status") || "all").toLowerCase();
  const search = (sp.get("search") || "").trim();
  const where = ["1=1"];
  const params: unknown[] = [];
  if (status !== "all") {
    where.push("r.status = ?");
    params.push(status);
  }
  if (search) {
    where.push("(r.body LIKE ? OR m.display_name LIKE ? OR t.title LIKE ?)");
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  const whereSql = where.join(" AND ");
  const [[countRow]] = await getPool().query<Row[]>(
    `SELECT COUNT(*) AS c FROM forum_replies r
     JOIN forum_topics t ON t.id=r.topic_id
     JOIN forums f ON f.id=t.forum_id
     JOIN members m ON m.id=r.member_id
     WHERE ${whereSql}`,
    params,
  );
  const total = Number(countRow?.c ?? 0);
  const offset = (page - 1) * perPage;
  const [rows] = await getPool().query<Row[]>(
    `SELECT r.id,r.body,r.status,r.created_at,m.display_name,t.title AS topic_title,t.slug AS topic_slug,f.slug AS forum_slug
     FROM forum_replies r
     JOIN forum_topics t ON t.id=r.topic_id
     JOIN forums f ON f.id=t.forum_id
     JOIN members m ON m.id=r.member_id
     WHERE ${whereSql}
     ORDER BY r.id DESC LIMIT ? OFFSET ?`,
    [...params, perPage, offset],
  );
  return {
    items: rows.map((r) => ({
      id: Number(r.id),
      body: String(r.body ?? ""),
      status: String(r.status ?? "pending"),
      authorName: String(r.display_name ?? ""),
      topicTitle: String(r.topic_title ?? ""),
      forumSlug: String(r.forum_slug ?? ""),
      topicSlug: String(r.topic_slug ?? ""),
      createdAt: String(r.created_at ?? ""),
    })),
    total,
    page,
    perPage,
  };
}

async function getForumReplyAdmin(id: number) {
  const [rows] = await getPool().query<Row[]>(
    `SELECT r.id,r.body,r.status,r.created_at,m.display_name,t.title AS topic_title,t.slug AS topic_slug,f.slug AS forum_slug
     FROM forum_replies r
     JOIN forum_topics t ON t.id=r.topic_id
     JOIN forums f ON f.id=t.forum_id
     JOIN members m ON m.id=r.member_id
     WHERE r.id = ? LIMIT 1`,
    [id],
  );
  const r = rows[0];
  if (!r) return null;
  return {
    id: Number(r.id),
    body: String(r.body ?? ""),
    status: String(r.status ?? "pending"),
    authorName: String(r.display_name ?? ""),
    topicTitle: String(r.topic_title ?? ""),
    forumSlug: String(r.forum_slug ?? ""),
    topicSlug: String(r.topic_slug ?? ""),
    createdAt: String(r.created_at ?? ""),
  };
}

async function updateForumReplyStatus(id: number, body: Record<string, unknown>) {
  await getPool().query("UPDATE forum_replies SET status = ? WHERE id = ?", [String(body.status ?? "pending"), id]);
}

async function deleteForumReplyAdmin(id: number) {
  await getPool().query("DELETE FROM forum_replies WHERE id = ?", [id]);
}

async function listBlogCommentsAdmin(sp: URLSearchParams) {
  const page = Math.max(1, Number(sp.get("page") ?? 1));
  const perPage = Math.min(50, Math.max(5, Number(sp.get("perPage") ?? 15)));
  const status = (sp.get("status") || "all").toLowerCase();
  const search = (sp.get("search") || "").trim();
  const where = ["1=1"];
  const params: unknown[] = [];
  if (status !== "all") {
    where.push("c.status = ?");
    params.push(status);
  }
  if (search) {
    where.push("(c.body LIKE ? OR m.display_name LIKE ? OR m.email LIKE ? OR p.title LIKE ?)");
    params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
  }
  const whereSql = where.join(" AND ");
  const [[countRow]] = await getPool().query<Row[]>(
    `SELECT COUNT(*) AS c FROM blog_comments c
     JOIN members m ON m.id=c.member_id
     JOIN blog_posts p ON p.id=c.blog_post_id
     WHERE ${whereSql}`,
    params,
  );
  const total = Number(countRow?.c ?? 0);
  const offset = (page - 1) * perPage;
  const [rows] = await getPool().query<Row[]>(
    `SELECT c.id,c.body,c.status,c.created_at,m.display_name,m.email,p.title AS post_title,p.slug AS post_slug
     FROM blog_comments c
     JOIN members m ON m.id=c.member_id
     JOIN blog_posts p ON p.id=c.blog_post_id
     WHERE ${whereSql}
     ORDER BY c.id DESC LIMIT ? OFFSET ?`,
    [...params, perPage, offset],
  );
  const countsByStatus = async () => {
    const [cr] = await getPool().query<Row[]>("SELECT status, COUNT(*) AS c FROM blog_comments GROUP BY status");
    const out: Record<string, number> = {};
    for (const r of cr) out[String(r.status)] = Number(r.c ?? 0);
    out.all = total;
    return out;
  };
  return {
    items: rows.map((r) => ({
      id: Number(r.id),
      body: String(r.body ?? ""),
      displayName: String(r.display_name ?? ""),
      email: String(r.email ?? ""),
      postTitle: String(r.post_title ?? ""),
      postSlug: String(r.post_slug ?? ""),
      status: String(r.status ?? "pending"),
      createdAt: String(r.created_at ?? ""),
    })),
    total,
    page,
    perPage,
    counts: await countsByStatus(),
  };
}

async function getBlogCommentAdmin(id: number) {
  const [rows] = await getPool().query<Row[]>(
    `SELECT c.id,c.body,c.status,c.created_at,m.display_name,m.email,p.title AS post_title,p.slug AS post_slug
     FROM blog_comments c
     JOIN members m ON m.id=c.member_id
     JOIN blog_posts p ON p.id=c.blog_post_id
     WHERE c.id = ? LIMIT 1`,
    [id],
  );
  const r = rows[0];
  if (!r) return null;
  return {
    id: Number(r.id),
    body: String(r.body ?? ""),
    status: String(r.status ?? "pending"),
    displayName: String(r.display_name ?? ""),
    email: String(r.email ?? ""),
    postTitle: String(r.post_title ?? ""),
    postSlug: String(r.post_slug ?? ""),
    createdAt: String(r.created_at ?? ""),
  };
}

async function updateBlogCommentStatus(id: number, body: Record<string, unknown>) {
  await getPool().query("UPDATE blog_comments SET status = ? WHERE id = ?", [String(body.status ?? "pending"), id]);
}

async function deleteBlogCommentAdmin(id: number) {
  await getPool().query("DELETE FROM blog_comments WHERE id = ?", [id]);
}

async function listMemberBlogsAdmin(sp: URLSearchParams) {
  const page = Math.max(1, Number(sp.get("page") ?? 1));
  const perPage = Math.min(50, Math.max(5, Number(sp.get("perPage") ?? 15)));
  const status = (sp.get("status") || "all").toLowerCase();
  const search = (sp.get("search") || "").trim();
  const where = ["author_type = 'member'"];
  const params: unknown[] = [];
  if (status !== "all") {
    where.push("b.status = ?");
    params.push(status);
  }
  if (search) {
    where.push("(b.title LIKE ? OR m.display_name LIKE ? OR m.email LIKE ?)");
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  const whereSql = where.join(" AND ");
  const [[countRow]] = await getPool().query<Row[]>(
    `SELECT COUNT(*) AS c FROM blog_posts b
     LEFT JOIN members m ON m.id=b.author_member_id
     WHERE ${whereSql}`,
    params,
  );
  const total = Number(countRow?.c ?? 0);
  const offset = (page - 1) * perPage;
  const [rows] = await getPool().query<Row[]>(
    `SELECT b.id,b.title,b.slug,b.status,b.updated_at,m.display_name,m.email
     FROM blog_posts b
     LEFT JOIN members m ON m.id=b.author_member_id
     WHERE ${whereSql}
     ORDER BY b.id DESC LIMIT ? OFFSET ?`,
    [...params, perPage, offset],
  );
  const [cr] = await getPool().query<Row[]>(
    "SELECT status, COUNT(*) AS c FROM blog_posts WHERE author_type='member' GROUP BY status",
  );
  const counts: Record<string, number> = { all: total };
  for (const r of cr) counts[String(r.status)] = Number(r.c ?? 0);
  return {
    items: rows.map((r) => ({
      id: Number(r.id),
      title: String(r.title ?? ""),
      slug: String(r.slug ?? ""),
      status: String(r.status ?? "draft"),
      authorName: String(r.display_name ?? "Member"),
      authorEmail: String(r.email ?? ""),
      updatedAt: String(r.updated_at ?? ""),
    })),
    total,
    page,
    perPage,
    counts,
  };
}

async function moderateBlogPost(id: number, body: Record<string, unknown>) {
  const status = String(body.status ?? "pending_review");
  await getPool().query("UPDATE blog_posts SET status = ? WHERE id = ? AND author_type = 'member'", [status, id]);
}

async function deleteMediaById(id: number) {
  const [rows] = await getPool().query<Row[]>(
    "SELECT file_path, thumb_path, medium_path, large_path FROM media WHERE id = ? LIMIT 1",
    [id],
  );
  const row = rows[0];
  if (!row) return;
  const media = mediaService();
  const paths = [row.file_path, row.thumb_path, row.medium_path, row.large_path]
    .map((p) => String(p ?? "").trim())
    .filter(Boolean);
  for (const rel of paths) {
    try {
      await fs.unlink(media.absolutePath(rel));
    } catch {
      // ignore missing files
    }
  }
  await getPool().query("DELETE FROM media WHERE id = ?", [id]);
}

async function desimentorDocumentGetResponse(
  entityType: string,
  entityId: number,
): Promise<CmsDispatchResult> {
  const empty = emptyDesimentorDocument();
  const previewToken = createDesimentorPreviewToken(entityType, entityId);
  try {
    await ensureDesimentorTables();
    const document = await getDesimentorDocument(entityType, entityId);
    return { status: 200, data: { document, empty, previewToken } };
  } catch (e) {
    const busy = isDbBusyError(e);
    if (busy) {
      console.warn("[desimentor] DB busy loading document", entityType, entityId);
    } else {
      console.error("[desimentor] GET document", entityType, entityId, e);
    }
    return {
      status: 200,
      data: {
        document: null,
        empty,
        previewToken,
        ...(busy ? { warning: "Database busy — save may fail until MySQL is restarted." } : {}),
      },
    };
  }
}

function desimentorInputContent(body: Record<string, unknown>): Record<string, unknown> {
  const raw = body.content;
  if (raw && typeof raw === "object" && !Array.isArray(raw)) return raw as Record<string, unknown>;
  return parseJson(raw);
}

let desimentorTablesReady = false;
async function ensureDesimentorTables() {
  if (desimentorTablesReady) return;
  try {
  await getPool().query(`
    CREATE TABLE IF NOT EXISTS desimentor_documents (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      entity_type ENUM('page','homepage','service_landing','service','blog_post') NOT NULL,
      entity_id INT UNSIGNED NOT NULL,
      content_json LONGTEXT NOT NULL,
      status ENUM('draft','published') NOT NULL DEFAULT 'draft',
      revision INT UNSIGNED NOT NULL DEFAULT 1,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uq_desimentor_entity (entity_type, entity_id)
    ) ENGINE=InnoDB;
  `);
  await getPool().query(`
    CREATE TABLE IF NOT EXISTS desimentor_templates (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(200) NOT NULL UNIQUE,
      category ENUM('section','page','widget') NOT NULL DEFAULT 'section',
      content_json LONGTEXT NOT NULL,
      thumbnail_media_id INT UNSIGNED NULL,
      status ENUM('draft','published') NOT NULL DEFAULT 'published',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `);
  // Upgrade older installs where enum may not include blog_post
  try {
    await getPool().query(`
      ALTER TABLE desimentor_documents
      MODIFY entity_type ENUM('page','homepage','service_landing','service','blog_post') NOT NULL
    `);
  } catch {
    // ignore if already aligned or insufficient privilege
  }
  desimentorTablesReady = true;
  } catch (e) {
    desimentorTablesReady = false;
    throw e;
  }
}

async function updateMediaMeta(id: number, body: Record<string, unknown>) {
  await getPool().query(
    "UPDATE media SET alt_text = ?, title = ?, caption = ?, description = ? WHERE id = ?",
    [
      String(body.altText ?? ""),
      String(body.title ?? ""),
      String(body.caption ?? ""),
      String(body.description ?? ""),
      id,
    ],
  );
  const item = await mediaService().getById(id);
  if (!item) throw new Error("Media not found");
  return item;
}

async function cropMediaImage(id: number, body: Record<string, unknown>) {
  const [rows] = await getPool().query<Row[]>(
    "SELECT file_path, mime_type, media_type FROM media WHERE id = ? LIMIT 1",
    [id],
  );
  const row = rows[0];
  if (!row) throw new Error("Media not found");
  if (String(row.media_type) !== "image") throw new Error("Crop is available for images only.");

  const x = Math.max(0, Number(body.x ?? 0));
  const y = Math.max(0, Number(body.y ?? 0));
  const width = Math.max(1, Number(body.width ?? 1));
  const height = Math.max(1, Number(body.height ?? 1));

  const media = mediaService();
  const originalRel = String(row.file_path ?? "");
  const originalAbs = media.absolutePath(originalRel);
  const ext = originalRel.split(".").pop() || "jpg";
  const base = originalRel.replace(/\.[^.]+$/, "");
  const thumbRel = `${base}-thumb.${ext}`;
  const mediumRel = `${base}-medium.${ext}`;
  const largeRel = `${base}-large.${ext}`;

  const cropped = sharp(originalAbs).extract({
    left: Math.round(x),
    top: Math.round(y),
    width: Math.round(width),
    height: Math.round(height),
  });
  await cropped.clone().resize(320).toFile(media.absolutePath(thumbRel));
  await cropped.clone().resize(800).toFile(media.absolutePath(mediumRel));
  await cropped.clone().resize(1600).toFile(media.absolutePath(largeRel));

  await getPool().query(
    "UPDATE media SET thumb_path = ?, medium_path = ?, large_path = ?, width = ?, height = ? WHERE id = ?",
    [thumbRel, mediumRel, largeRel, Math.round(width), Math.round(height), id],
  );
  const item = await mediaService().getById(id);
  if (!item) throw new Error("Media not found after crop.");
  return item;
}

function emptyDesimentorDocument() {
  return { version: 2, settings: {}, sections: [] };
}

function createDesimentorPreviewToken(entityType: string, entityId: number) {
  return Buffer.from(`${entityType}:${entityId}`, "utf8").toString("base64url");
}

function parseDesimentorPreviewToken(token: string): { entityType: string; entityId: number } | null {
  try {
    const raw = Buffer.from(token, "base64url").toString("utf8");
    const m = raw.match(/^(page|homepage|service_landing|service|blog_post):(\d+)$/);
    if (!m) return null;
    return { entityType: m[1], entityId: Number(m[2]) };
  } catch {
    return null;
  }
}

function asDesimentorContent(raw: unknown) {
  const parsed = parseJson(raw);
  if (!Array.isArray(parsed.sections)) return emptyDesimentorDocument();
  return {
    version: Number(parsed.version ?? 2),
    settings: parseJson(parsed.settings),
    sections: parsed.sections as unknown[],
  };
}

async function getDesimentorDocument(entityType: string, entityId: number) {
  const [rows] = await getPool().query<Row[]>(
    `SELECT id, entity_type, entity_id, content_json, status, revision, updated_at
     FROM desimentor_documents
     WHERE entity_type = ? AND entity_id = ?
     LIMIT 1`,
    [entityType, entityId],
  );
  const row = rows[0];
  if (!row) return null;
  return {
    id: Number(row.id),
    entityType: String(row.entity_type),
    entityId: Number(row.entity_id),
    content: asDesimentorContent(row.content_json),
    status: String(row.status ?? "draft"),
    revision: Number(row.revision ?? 1),
    updatedAt: String(row.updated_at ?? ""),
  };
}

async function saveDesimentorDocument(
  entityType: string,
  entityId: number,
  content: Record<string, unknown>,
  status: "draft" | "published",
) {
  const normalized = asDesimentorContent(content);
  await getPool().query(
    `INSERT INTO desimentor_documents (entity_type, entity_id, content_json, status, revision)
     VALUES (?, ?, ?, ?, 1)
     ON DUPLICATE KEY UPDATE
       content_json = VALUES(content_json),
       status = VALUES(status),
       revision = revision + 1`,
    [entityType, entityId, JSON.stringify(normalized), status],
  );
  return (await getDesimentorDocument(entityType, entityId))!;
}

async function publishDesimentorDocument(entityType: string, entityId: number) {
  const existing = await getDesimentorDocument(entityType, entityId);
  if (!existing) {
    await saveDesimentorDocument(entityType, entityId, emptyDesimentorDocument(), "published");
  } else {
    await getPool().query(
      "UPDATE desimentor_documents SET status = 'published', revision = revision + 1 WHERE entity_type = ? AND entity_id = ?",
      [entityType, entityId],
    );
  }
  return (await getDesimentorDocument(entityType, entityId))!;
}

async function listDesimentorTemplates(category: string) {
  const where = category && category !== "all" ? "WHERE category = ?" : "";
  const params = category && category !== "all" ? [category] : [];
  const [rows] = await getPool().query<Row[]>(
    `SELECT id, name, slug, category, content_json, thumbnail_media_id, status, created_at, updated_at
     FROM desimentor_templates ${where}
     ORDER BY id DESC`,
    params,
  );
  return rows.map((r) => ({
    id: Number(r.id),
    name: String(r.name ?? ""),
    slug: String(r.slug ?? ""),
    category: String(r.category ?? "section"),
    content: asDesimentorContent(r.content_json),
    thumbnailMediaId: r.thumbnail_media_id ? Number(r.thumbnail_media_id) : null,
    status: String(r.status ?? "published"),
    createdAt: String(r.created_at ?? ""),
    updatedAt: String(r.updated_at ?? ""),
  }));
}

function slugifyName(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 180);
}

async function saveDesimentorTemplate(body: Record<string, unknown>) {
  const name = String(body.name ?? "").trim();
  if (!name) throw new Error("Template name is required.");
  const category = ["section", "page", "widget"].includes(String(body.category))
    ? String(body.category)
    : "section";
  const slug = String(body.slug ?? "").trim() || slugifyName(name);
  const content = asDesimentorContent(parseJson(body.content));
  const thumbnailMediaId = Number(body.thumbnailMediaId ?? 0) || null;
  await getPool().query(
    `INSERT INTO desimentor_templates (name, slug, category, content_json, thumbnail_media_id, status)
     VALUES (?, ?, ?, ?, ?, 'published')
     ON DUPLICATE KEY UPDATE
       name = VALUES(name),
       category = VALUES(category),
       content_json = VALUES(content_json),
       thumbnail_media_id = VALUES(thumbnail_media_id),
       updated_at = CURRENT_TIMESTAMP`,
    [name, slug, category, JSON.stringify(content), thumbnailMediaId],
  );
  const [rows] = await getPool().query<Row[]>(
    `SELECT id, name, slug, category, content_json, thumbnail_media_id, status, created_at, updated_at
     FROM desimentor_templates WHERE slug = ? LIMIT 1`,
    [slug],
  );
  const r = rows[0];
  return {
    id: Number(r.id),
    name: String(r.name ?? ""),
    slug: String(r.slug ?? ""),
    category: String(r.category ?? "section"),
    content: asDesimentorContent(r.content_json),
    thumbnailMediaId: r.thumbnail_media_id ? Number(r.thumbnail_media_id) : null,
    status: String(r.status ?? "published"),
    createdAt: String(r.created_at ?? ""),
    updatedAt: String(r.updated_at ?? ""),
  };
}

async function setEntityDisplayMode(entityType: string, entityId: number, mode: "classic" | "elementor") {
  if (entityType === "page" || entityType === "homepage") {
    await tryUpdateDisplayMode("pages", entityId, mode);
    return mode;
  }
  if (entityType === "service_landing") {
    await tryUpdateDisplayMode("service_landings", entityId, mode);
    return mode;
  }
  if (entityType === "service") {
    await tryUpdateDisplayMode("services", entityId, mode);
    return mode;
  }
  if (entityType === "blog_post") {
    await tryUpdateDisplayMode("blog_posts", entityId, mode);
    return mode;
  }
  return mode;
}

function normalizeDisplayModeInput(value: unknown): "classic" | "elementor" {
  return String(value) === "elementor" ? "elementor" : "classic";
}

async function tryUpdateDisplayMode(
  table: "pages" | "service_landings" | "services" | "blog_posts",
  id: number,
  mode: "classic" | "elementor",
) {
  try {
    await getPool().query(`UPDATE ${table} SET display_mode = ? WHERE id = ?`, [mode, id]);
  } catch (e) {
    const msg = (e as Error).message || "";
    if (!msg.toLowerCase().includes("unknown column")) throw e;
  }
}

export async function cmsResultToResponse(result: CmsDispatchResult): Promise<Response> {
  if (result.file) {
    const buf = await fs.readFile(result.file.path);
    return new Response(buf, {
      status: result.status,
      headers: {
        "Content-Type": result.file.mime,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
        ...result.headers,
      },
    });
  }
  return Response.json(result.data ?? {}, { status: result.status, headers: result.headers });
}
