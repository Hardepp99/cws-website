import "server-only";
import type { Pool, RowDataPacket } from "mysql2/promise";
import { getPool } from "../db";
import { encodeJson, sanitizeSlug } from "../utils/json";

type Row = RowDataPacket;

let repo: CommunityRepository | null = null;

export function communityRepository(): CommunityRepository {
  if (!repo) repo = new CommunityRepository(getPool());
  return repo;
}

export class CommunityRepository {
  constructor(private pool: Pool) {}

  async getBlogPostIdBySlug(slug: string): Promise<number | null> {
    const [rows] = await this.pool.query<Row[]>(
      "SELECT id FROM blog_posts WHERE slug = ? AND status = 'published' LIMIT 1",
      [slug],
    );
    return rows[0] ? Number(rows[0].id) : null;
  }

  async listApprovedComments(postId: number, viewerMemberId: number | null) {
    const sql =
      viewerMemberId != null
        ? `SELECT c.id, c.member_id, c.body, c.status, c.created_at, m.display_name, m.avatar_url
           FROM blog_comments c JOIN members m ON m.id = c.member_id
           WHERE c.blog_post_id = ? AND (c.status = 'approved' OR c.member_id = ?)
           ORDER BY c.created_at ASC`
        : `SELECT c.id, c.member_id, c.body, c.status, c.created_at, m.display_name, m.avatar_url
           FROM blog_comments c JOIN members m ON m.id = c.member_id
           WHERE c.blog_post_id = ? AND c.status = 'approved' ORDER BY c.created_at ASC`;
    const params = viewerMemberId != null ? [postId, viewerMemberId] : [postId];
    const [rows] = await this.pool.query<Row[]>(sql, params);
    return {
      items: rows.map((row) => ({
        id: Number(row.id),
        body: String(row.body),
        status: String(row.status ?? "approved"),
        createdAt: String(row.created_at),
        displayName: String(row.display_name),
        avatarUrl: String(row.avatar_url ?? ""),
        isOwn: viewerMemberId != null && Number(row.member_id) === viewerMemberId,
      })),
    };
  }

  async createBlogComment(postId: number, memberId: number, body: string) {
    body = body.trim();
    if (!body) throw new Error("Comment cannot be empty");
    const [result] = await this.pool.query(
      "INSERT INTO blog_comments (blog_post_id, member_id, body, status) VALUES (?, ?, ?, 'pending')",
      [postId, memberId, body],
    );
    return {
      success: true,
      id: Number((result as { insertId: number }).insertId),
      status: "pending",
      message: "Comment submitted for moderation.",
    };
  }

  async listForumsPublic() {
    const [rows] = await this.pool.query<Row[]>(
      `SELECT f.id, f.slug, f.title, f.description, f.icon,
              (SELECT COUNT(*) FROM forum_topics t WHERE t.forum_id = f.id AND t.status = 'published') AS topic_count
       FROM forums f WHERE f.status = 'published' ORDER BY f.sort_order ASC, f.title ASC`,
    );
    return {
      items: rows.map((row) => ({
        id: Number(row.id),
        slug: String(row.slug),
        title: String(row.title),
        description: String(row.description ?? ""),
        icon: String(row.icon ?? "fa-comments"),
        topicCount: Number(row.topic_count),
      })),
    };
  }

  async getForumBySlug(slug: string) {
    const [rows] = await this.pool.query<Row[]>(
      "SELECT id, slug, title, description, icon FROM forums WHERE slug = ? AND status = 'published' LIMIT 1",
      [slug],
    );
    const row = rows[0];
    if (!row) return null;
    return {
      id: Number(row.id),
      slug: String(row.slug),
      title: String(row.title),
      description: String(row.description ?? ""),
      icon: String(row.icon ?? "fa-comments"),
    };
  }

  async listForumTopicsPublic(forumId: number, page: number, perPage: number) {
    const [[countRow]] = await this.pool.query<Row[]>(
      "SELECT COUNT(*) AS c FROM forum_topics WHERE forum_id = ? AND status = 'published'",
      [forumId],
    );
    const total = Number(countRow?.c ?? 0);
    const offset = (page - 1) * perPage;
    const [rows] = await this.pool.query<Row[]>(
      `SELECT t.id, t.slug, t.title, t.reply_count, t.is_pinned, t.last_activity_at, t.created_at, m.display_name
       FROM forum_topics t JOIN members m ON m.id = t.member_id
       WHERE t.forum_id = ? AND t.status = 'published'
       ORDER BY t.is_pinned DESC, t.last_activity_at DESC LIMIT ? OFFSET ?`,
      [forumId, perPage, offset],
    );
    return {
      items: rows.map((row) => ({
        id: Number(row.id),
        slug: String(row.slug),
        title: String(row.title),
        replyCount: Number(row.reply_count),
        isPinned: Boolean(row.is_pinned),
        authorName: String(row.display_name),
        lastActivity: String(row.last_activity_at),
        createdAt: String(row.created_at),
      })),
      total,
      page,
      perPage,
    };
  }

  async getTopicPublic(forumId: number, topicSlug: string) {
    const [rows] = await this.pool.query<Row[]>(
      `SELECT t.*, m.display_name, m.avatar_url FROM forum_topics t
       JOIN members m ON m.id = t.member_id
       WHERE t.forum_id = ? AND t.slug = ? AND t.status = 'published' LIMIT 1`,
      [forumId, topicSlug],
    );
    const row = rows[0];
    if (!row) return null;
    const topicId = Number(row.id);
    const replies = await this.listApprovedReplies(topicId);
    return {
      id: topicId,
      slug: String(row.slug),
      title: String(row.title),
      body: String(row.body),
      authorName: String(row.display_name),
      avatarUrl: String(row.avatar_url ?? ""),
      createdAt: String(row.created_at),
      replyCount: Number(row.reply_count),
      replies,
    };
  }

  async createForum(memberId: number, body: Record<string, unknown>) {
    const title = String(body.title ?? "").trim();
    if (!title) throw new Error("Title required");
    const slug = await this.uniqueSlug("forums", sanitizeSlug(String(body.slug ?? title)));
    await this.pool.query(
      "INSERT INTO forums (slug, title, description, created_by_member_id, status) VALUES (?, ?, ?, ?, 'published')",
      [slug, title, String(body.description ?? "").trim(), memberId],
    );
    return { success: true, slug };
  }

  async createTopic(forumId: number, memberId: number, body: Record<string, unknown>) {
    const title = String(body.title ?? "").trim();
    const content = String(body.body ?? body.content ?? "").trim();
    if (!title || !content) throw new Error("Title and body required");
    const slug = await this.uniqueTopicSlug(forumId, sanitizeSlug(String(body.slug ?? title)));
    await this.pool.query(
      "INSERT INTO forum_topics (forum_id, slug, title, body, member_id, status) VALUES (?, ?, ?, ?, ?, 'pending')",
      [forumId, slug, title, content, memberId],
    );
    return { success: true, slug, status: "pending", message: "Topic submitted for moderation." };
  }

  async createReply(topicId: number, memberId: number, body: string, parentId: number | null = null) {
    body = body.trim();
    if (!body) throw new Error("Reply cannot be empty");
    await this.pool.query(
      "INSERT INTO forum_replies (topic_id, member_id, parent_id, body, status) VALUES (?, ?, ?, ?, 'pending')",
      [topicId, memberId, parentId, body],
    );
    return { success: true, status: "pending", message: "Reply submitted for moderation." };
  }

  async getMemberContributions(memberId: number) {
    const [blogPosts] = await this.pool.query<Row[]>(
      `SELECT id, title, slug, status, published_date, created_at FROM blog_posts
       WHERE author_member_id = ? AND author_type = 'member' ORDER BY created_at DESC`,
      [memberId],
    );
    return {
      blogPosts: blogPosts.map((r) => ({
        id: Number(r.id),
        title: String(r.title),
        slug: String(r.slug),
        status: String(r.status),
        publishedDate: String(r.published_date ?? ""),
        createdAt: String(r.created_at ?? ""),
      })),
      comments: [],
      forumReplies: [],
      forums: [],
    };
  }

  async createMemberBlogPost(memberId: number, data: Record<string, unknown>): Promise<number> {
    const slug = await this.uniqueSlug("blog_posts", sanitizeSlug(String(data.slug ?? data.title ?? "post")));
    const [result] = await this.pool.query(
      `INSERT INTO blog_posts (slug, title, excerpt, content_html, featured_image, published_date, seo, status, author_member_id, author_type)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending_review', ?, 'member')`,
      [
        slug,
        data.title ?? "Untitled",
        data.excerpt ?? "",
        data.content_html ?? data.content ?? "",
        data.featured_image ?? data.image ?? "",
        data.published_date ?? new Date().toISOString().slice(0, 10),
        encodeJson(data.seo ?? {}),
        memberId,
      ],
    );
    return Number((result as { insertId: number }).insertId);
  }

  async updateMemberBlogPost(memberId: number, id: number, data: Record<string, unknown>): Promise<void> {
    const [rows] = await this.pool.query<Row[]>(
      "SELECT id, status FROM blog_posts WHERE id = ? AND author_member_id = ? AND author_type = 'member' LIMIT 1",
      [id, memberId],
    );
    if (!rows[0]) throw new Error("Post not found");
    if (rows[0].status === "published") throw new Error("Published posts cannot be edited. Contact support.");
    await this.pool.query(
      `UPDATE blog_posts SET title = ?, excerpt = ?, content_html = ?, featured_image = ?, slug = ?, status = 'pending_review' WHERE id = ?`,
      [
        data.title ?? "Untitled",
        data.excerpt ?? "",
        data.content_html ?? data.content ?? "",
        data.featured_image ?? data.image ?? "",
        data.slug ?? "",
        id,
      ],
    );
  }

  async getMemberBlogPost(memberId: number, id: number) {
    const [rows] = await this.pool.query<Row[]>(
      "SELECT * FROM blog_posts WHERE id = ? AND author_member_id = ? AND author_type = 'member' LIMIT 1",
      [id, memberId],
    );
    return rows[0] ?? null;
  }

  async countPendingModeration() {
    const count = async (sql: string) => {
      const [[r]] = await this.pool.query<Row[]>(sql);
      return Number(r?.c ?? 0);
    };
    return {
      blogComments: await count("SELECT COUNT(*) AS c FROM blog_comments WHERE status = 'pending'"),
      forumTopics: await count("SELECT COUNT(*) AS c FROM forum_topics WHERE status = 'pending'"),
      forumReplies: await count("SELECT COUNT(*) AS c FROM forum_replies WHERE status = 'pending'"),
      memberBlogs: await count(
        "SELECT COUNT(*) AS c FROM blog_posts WHERE status = 'pending_review' AND author_type = 'member'",
      ),
    };
  }

  private async listApprovedReplies(topicId: number) {
    const [rows] = await this.pool.query<Row[]>(
      `SELECT r.id, r.body, r.created_at, r.parent_id, m.display_name, m.avatar_url
       FROM forum_replies r JOIN members m ON m.id = r.member_id
       WHERE r.topic_id = ? AND r.status = 'approved' ORDER BY r.created_at ASC`,
      [topicId],
    );
    return rows.map((row) => ({
      id: Number(row.id),
      body: String(row.body),
      parentId: row.parent_id ? Number(row.parent_id) : null,
      createdAt: String(row.created_at),
      authorName: String(row.display_name),
      avatarUrl: String(row.avatar_url ?? ""),
    }));
  }

  private async uniqueSlug(table: string, slug: string): Promise<string> {
    let candidate = slug;
    let n = 1;
    while (true) {
      const [rows] = await this.pool.query<Row[]>(`SELECT id FROM ${table} WHERE slug = ? LIMIT 1`, [candidate]);
      if (!rows.length) return candidate;
      candidate = `${slug}-${n++}`;
    }
  }

  private async uniqueTopicSlug(forumId: number, slug: string): Promise<string> {
    let candidate = slug;
    let n = 1;
    while (true) {
      const [rows] = await this.pool.query<Row[]>(
        "SELECT id FROM forum_topics WHERE forum_id = ? AND slug = ? LIMIT 1",
        [forumId, candidate],
      );
      if (!rows.length) return candidate;
      candidate = `${slug}-${n++}`;
    }
  }
}
