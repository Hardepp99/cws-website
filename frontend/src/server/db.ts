import "server-only";
import mysql, { type Pool, type RowDataPacket, type ResultSetHeader } from "mysql2/promise";

export type { RowDataPacket, ResultSetHeader };

let pool: Pool | null = null;

export function getDbConfig() {
  return {
    host: process.env.MYSQL_HOST || process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.MYSQL_PORT || process.env.DB_PORT || 3306),
    database: process.env.MYSQL_DATABASE || process.env.DB_NAME || "cws_cms",
    user: process.env.MYSQL_USER || process.env.DB_USER || "root",
    password: process.env.MYSQL_PASSWORD ?? process.env.DB_PASSWORD ?? "",
  };
}

export function getPool(): Pool {
  if (!pool) {
    const cfg = getDbConfig();
    pool = mysql.createPool({
      host: cfg.host,
      port: cfg.port,
      database: cfg.database,
      user: cfg.user,
      password: cfg.password,
      charset: "utf8mb4",
      waitForConnections: true,
      connectionLimit: 10,
      enableKeepAlive: true,
    });
  }
  return pool;
}

export function nodeCmsEnabled(): boolean {
  return process.env.CWS_NODE_CMS !== "0" && Boolean(getDbConfig().database);
}
