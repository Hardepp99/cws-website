import "server-only";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import type { RowDataPacket } from "mysql2";
import { getServerConfig, mediaPublicUrl } from "../config";
import { getPool } from "../db";

type Row = RowDataPacket;

const ALLOWED: Record<string, { ext: string[]; type: string; max: number }> = {
  "image/jpeg": { ext: ["jpg", "jpeg"], type: "image", max: 20 * 1024 * 1024 },
  "image/png": { ext: ["png"], type: "image", max: 20 * 1024 * 1024 },
  "image/gif": { ext: ["gif"], type: "image", max: 20 * 1024 * 1024 },
  "image/webp": { ext: ["webp"], type: "image", max: 20 * 1024 * 1024 },
  "application/pdf": { ext: ["pdf"], type: "document", max: 25 * 1024 * 1024 },
};

let service: MediaService | null = null;

export function mediaService(): MediaService {
  if (!service) service = new MediaService();
  return service;
}

export class MediaService {
  uploadRoot(): string {
    return getServerConfig().uploadDir;
  }

  absolutePath(relative: string): string {
    const clean = relative.replace(/\\/g, "/").replace(/\.\./g, "");
    return path.join(this.uploadRoot(), clean);
  }

  publicUrl(id: number, variant = "medium"): string {
    return mediaPublicUrl(id, variant);
  }

  async getById(id: number): Promise<Record<string, unknown> | null> {
    const [rows] = await getPool().query<Row[]>("SELECT * FROM media WHERE id = ? LIMIT 1", [id]);
    return rows[0] ? this.rowToArray(rows[0]) : null;
  }

  async serve(id: number, variant: string): Promise<{ path: string; mime: string } | null> {
    const [rows] = await getPool().query<Row[]>("SELECT * FROM media WHERE id = ? LIMIT 1", [id]);
    const row = rows[0];
    if (!row) return null;
    const key =
      variant === "thumb"
        ? "thumb_path"
        : variant === "large"
          ? "large_path"
          : variant === "original"
            ? "file_path"
            : "medium_path";
    const rel = String(row[key] ?? row.file_path ?? "");
    if (!rel) return null;
    const abs = this.absolutePath(rel);
    try {
      await fs.access(abs);
    } catch {
      return null;
    }
    return { path: abs, mime: String(row.mime_type ?? "application/octet-stream") };
  }

  async uploadFromBuffer(
    buffer: Buffer,
    originalName: string,
    mime: string,
    meta: Record<string, unknown> = {},
  ): Promise<Record<string, unknown>> {
    const rule = ALLOWED[mime];
    if (!rule) throw new Error("File type not allowed. Use images or PDF only.");
    if (buffer.length > rule.max) throw new Error("File exceeds maximum allowed size.");

    const ext = path.extname(originalName).slice(1).toLowerCase();
    if (!rule.ext.includes(ext)) throw new Error("File extension does not match file type.");

    const subdir = new Date().toISOString().slice(0, 10).replace(/-/g, "/");
    const dir = path.join(this.uploadRoot(), subdir);
    await fs.mkdir(dir, { recursive: true });

    const title = String(meta.title ?? path.basename(originalName, path.extname(originalName))).trim() || "media";
    const alt = String(meta.alt_text ?? meta.altText ?? title).trim() || title;
    const stored = `${sanitize(title)}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const dest = path.join(dir, stored);
    await fs.writeFile(dest, buffer);

    let thumb: string | null = null;
    let medium: string | null = null;
    let large: string | null = null;
    let width: number | null = null;
    let height: number | null = null;

    if (rule.type === "image") {
      const metaImg = await sharp(dest).metadata();
      width = metaImg.width ?? null;
      height = metaImg.height ?? null;
      const base = path.basename(stored, `.${ext}`);
      thumb = `${subdir}/${base}-thumb.${ext}`;
      medium = `${subdir}/${base}-medium.${ext}`;
      large = `${subdir}/${base}-large.${ext}`;
      await sharp(dest).resize(320).toFile(this.absolutePath(thumb));
      await sharp(dest).resize(800).toFile(this.absolutePath(medium));
      await sharp(dest).resize(1600).toFile(this.absolutePath(large));
    }

    const relative = `${subdir}/${stored}`.replace(/\\/g, "/");
    const memberId = meta.member_id != null ? Number(meta.member_id) : null;
    const [result] = await getPool().query(
      `INSERT INTO media (original_name, stored_name, mime_type, media_type, file_size, width, height, alt_text, title, caption, description, file_path, thumb_path, medium_path, large_path, member_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, '', '', ?, ?, ?, ?, ?)`,
      [
        originalName,
        stored,
        mime,
        rule.type,
        buffer.length,
        width,
        height,
        alt,
        title,
        relative,
        thumb,
        medium,
        large,
        memberId,
      ],
    );
    const id = Number((result as { insertId: number }).insertId);
    const item = await this.getById(id);
    if (!item) throw new Error("Failed to save media record.");
    return item;
  }

  async listMedia(page: number, perPage: number, type = "all", search = "") {
    let where = "WHERE 1=1";
    const values: unknown[] = [];
    if (type !== "all" && ["image", "audio", "video", "document"].includes(type)) {
      where += " AND media_type = ?";
      values.push(type);
    }
    if (search) {
      where += " AND (original_name LIKE ? OR title LIKE ? OR alt_text LIKE ?)";
      const q = `%${search}%`;
      values.push(q, q, q);
    }
    const [[countRow]] = await getPool().query<Row[]>(`SELECT COUNT(*) AS c FROM media ${where}`, values);
    const total = Number(countRow?.c ?? 0);
    const offset = (page - 1) * perPage;
    const [rows] = await getPool().query<Row[]>(
      `SELECT * FROM media ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...values, perPage, offset],
    );
    return {
      items: rows.map((r) => this.rowToArray(r)),
      total,
      page,
      perPage,
    };
  }

  private rowToArray(row: Row): Record<string, unknown> {
    const id = Number(row.id);
    return {
      id,
      title: row.title,
      altText: row.alt_text,
      mimeType: row.mime_type,
      mediaType: row.media_type,
      url: this.publicUrl(id, "large"),
      thumbUrl: row.thumb_path ? this.publicUrl(id, "thumb") : "",
      mediumUrl: row.medium_path ? this.publicUrl(id, "medium") : "",
      largeUrl: row.large_path ? this.publicUrl(id, "large") : "",
      filePath: row.file_path,
      createdAt: row.created_at,
    };
  }
}

function sanitize(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "media"
  );
}
