import "server-only";

export function isDbBusyError(err: unknown): boolean {
  const e = err as { code?: string; message?: string };
  const msg = String(e?.message ?? "").toLowerCase();
  return e?.code === "ER_CON_COUNT_ERROR" || msg.includes("too many connections");
}

export async function withDbFallback<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    if (isDbBusyError(e)) return fallback;
    throw e;
  }
}
