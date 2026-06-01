import "server-only";
import bcrypt from "bcrypt";
import crypto from "crypto";
import type { RowDataPacket } from "mysql2";
import { getServerConfig } from "../config";
import { getPool } from "../db";

export type MemberPublic = {
  id: number;
  email: string;
  displayName: string;
  avatarUrl: string;
  createdAt: string;
};

async function issueSession(memberId: number) {
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 30 * 86400 * 1000);
  await getPool().query("INSERT INTO member_sessions (member_id, token, expires_at) VALUES (?, ?, ?)", [
    memberId,
    token,
    expires,
  ]);
  const member = await getMemberById(memberId);
  return { success: true as const, token, member, displayName: member?.displayName ?? "Member" };
}

export async function getMemberById(id: number): Promise<MemberPublic | null> {
  const [rows] = await getPool().query<RowDataPacket[]>(
    "SELECT id, email, display_name, avatar_url, status, created_at FROM members WHERE id = ? LIMIT 1",
    [id],
  );
  const row = rows[0];
  if (!row) return null;
  return {
    id: Number(row.id),
    email: String(row.email),
    displayName: String(row.display_name),
    avatarUrl: String(row.avatar_url ?? ""),
    createdAt: String(row.created_at ?? ""),
  };
}

export async function memberIdFromToken(token: string): Promise<number | null> {
  const [rows] = await getPool().query<RowDataPacket[]>(
    "SELECT member_id FROM member_sessions WHERE token = ? AND expires_at > NOW() LIMIT 1",
    [token],
  );
  return rows[0] ? Number(rows[0].member_id) : null;
}

export async function memberRegister(
  email: string,
  password: string,
  displayName: string,
): Promise<{ success: true; token: string; member: MemberPublic | null; displayName: string }> {
  email = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Invalid email address.");
  if (password.length < 8) throw new Error("Password must be at least 8 characters.");
  displayName = displayName.trim();
  if (!displayName) throw new Error("Display name is required.");

  const [exists] = await getPool().query<RowDataPacket[]>(
    "SELECT id FROM members WHERE email = ? LIMIT 1",
    [email],
  );
  if (exists[0]) throw new Error("An account with this email already exists.");

  const hash = await bcrypt.hash(password, 10);
  const [result] = await getPool().query(
    `INSERT INTO members (email, password_hash, display_name, email_verified_at, status)
     VALUES (?, ?, ?, NOW(), 'active')`,
    [email, hash, displayName],
  );
  const id = Number((result as { insertId: number }).insertId);
  return issueSession(id);
}

export async function memberLogin(email: string, password: string) {
  email = email.trim().toLowerCase();
  const [rows] = await getPool().query<RowDataPacket[]>(
    "SELECT id, email, password_hash, display_name, status FROM members WHERE email = ? LIMIT 1",
    [email],
  );
  const row = rows[0];
  if (!row || row.status !== "active") return null;
  if (!row.password_hash) return null;
  const ok = await bcrypt.compare(password, String(row.password_hash));
  if (!ok) return null;
  return issueSession(Number(row.id));
}

export async function memberLoginWithGoogle(idToken: string) {
  const clientId = getServerConfig().googleOauthClientId;
  const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) return null;
  const data = (await res.json()) as Record<string, string>;
  if (data.error_description) return null;
  if (clientId && data.aud !== clientId) return null;

  const sub = String(data.sub ?? "");
  const email = String(data.email ?? "").toLowerCase();
  const name = String(data.name || data.given_name || "Member").trim();
  if (!sub || !email) return null;

  const pool = getPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT id, status FROM members WHERE google_sub = ? OR email = ? LIMIT 1",
    [sub, email],
  );

  if (rows[0]) {
    if (rows[0].status !== "active") return null;
    await pool.query(
      `UPDATE members SET google_sub = ?, display_name = COALESCE(NULLIF(display_name, ''), ?),
       email_verified_at = COALESCE(email_verified_at, NOW()) WHERE id = ?`,
      [sub, name, rows[0].id],
    );
    return issueSession(Number(rows[0].id));
  }

  const [ins] = await pool.query(
    `INSERT INTO members (email, google_sub, display_name, email_verified_at, status, password_hash)
     VALUES (?, ?, ?, NOW(), 'active', NULL)`,
    [email, sub, name],
  );
  return issueSession(Number((ins as { insertId: number }).insertId));
}

export async function memberRevokeToken(token: string): Promise<void> {
  await getPool().query("DELETE FROM member_sessions WHERE token = ?", [token]);
}
