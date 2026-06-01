import "server-only";
import type { RowDataPacket } from "mysql2";
import { getPool } from "../db";
import { encodeJson } from "../utils/json";

function extractMeta(type: string, payload: Record<string, unknown>) {
  const name = String(payload.name ?? payload.fullName ?? payload.displayName ?? "Visitor");
  const email = String(payload.email ?? "");
  const subject =
    String(payload.subject ?? "") ||
    (type === "contact" ? `Contact from ${name}` : `New ${type.replace(/_/g, " ")}`);
  const snippet = String(
    payload.message ?? payload.body ?? payload.notes ?? JSON.stringify(payload).slice(0, 200),
  ).slice(0, 500);
  return { from_name: name, from_email: email, subject, snippet };
}

export async function saveInboundForm(type: string, payload: Record<string, unknown>): Promise<number> {
  const meta = extractMeta(type, payload);
  const pool = getPool();
  const [result] = await pool.query(
    `INSERT INTO form_submissions
     (form_type, payload, from_name, from_email, subject, snippet, folder, direction, is_read, last_activity_at)
     VALUES (?, ?, ?, ?, ?, ?, 'inbox', 'inbound', 0, NOW())`,
    [type, encodeJson(payload), meta.from_name, meta.from_email, meta.subject, meta.snippet],
  );
  const id = Number((result as { insertId: number }).insertId);
  await pool.query("UPDATE form_submissions SET thread_id = ? WHERE id = ?", [id, id]);
  return id;
}

export async function getCrmStats(): Promise<Record<string, unknown>> {
  const pool = getPool();
  const [unread] = await pool.query<RowDataPacket[]>(
    "SELECT COUNT(*) AS c FROM form_submissions WHERE is_read = 0 AND direction = 'inbound'",
  );
  return { unread: Number(unread[0]?.c ?? 0) };
}
