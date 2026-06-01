import "server-only";
import bcrypt from "bcrypt";
import crypto from "crypto";
import type { RowDataPacket } from "mysql2";
import { getPool } from "../db";

export type AdminUser = {
  id: number;
  username: string;
  display_name: string;
  role: "admin" | "user";
};

export async function adminLogin(
  username: string,
  password: string,
): Promise<{ token: string; displayName: string; userId: number; username: string; role: string } | null> {
  const pool = getPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT id, username, password_hash, display_name, role FROM users WHERE username = ? LIMIT 1",
    [username],
  );
  const user = rows[0];
  if (!user) return null;
  const ok = await bcrypt.compare(password, String(user.password_hash));
  if (!ok) return null;

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 7 * 86400 * 1000);
  await pool.query("INSERT INTO admin_sessions (token, user_id, expires_at) VALUES (?, ?, ?)", [
    token,
    user.id,
    expires,
  ]);

  return {
    token,
    displayName: String(user.display_name),
    userId: Number(user.id),
    username: String(user.username),
    role: user.role === "admin" ? "admin" : "user",
  };
}

export async function adminUserIdFromToken(token: string): Promise<number | null> {
  const [rows] = await getPool().query<RowDataPacket[]>(
    "SELECT user_id FROM admin_sessions WHERE token = ? AND expires_at > NOW() LIMIT 1",
    [token],
  );
  return rows[0] ? Number(rows[0].user_id) : null;
}

export async function adminGetUserById(id: number): Promise<AdminUser | null> {
  const [rows] = await getPool().query<RowDataPacket[]>(
    "SELECT id, username, display_name, role FROM users WHERE id = ? LIMIT 1",
    [id],
  );
  if (!rows[0]) return null;
  const role = rows[0].role === "admin" ? "admin" : "user";
  return {
    id: Number(rows[0].id),
    username: String(rows[0].username),
    display_name: String(rows[0].display_name),
    role,
  };
}

export async function adminRevokeToken(token: string): Promise<void> {
  await getPool().query("DELETE FROM admin_sessions WHERE token = ?", [token]);
}

export function adminPublicProfile(user: AdminUser) {
  return {
    userId: user.id,
    username: user.username,
    displayName: user.display_name,
    role: user.role,
  };
}
