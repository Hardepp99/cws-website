import "server-only";
import fs from "fs/promises";
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
    console.error("[dispatchCms]", path, e);
    return { status: 500, data: { error: "Server error", message: (e as Error).message } };
  }
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

  const user = await requireAdmin(ctx);
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
  if (method === "PUT" && path.startsWith("/menus/")) {
    const key = path.slice("/menus/".length);
    const items = (body.items as unknown[]) ?? body;
    await repo.saveMenu(key, Array.isArray(items) ? items : []);
    return { status: 200, data: { success: true } };
  }

  return notImplemented(path);
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
