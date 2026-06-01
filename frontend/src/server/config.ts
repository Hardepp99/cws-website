import "server-only";

export type ServerConfig = {
  siteUrl: string;
  uploadDir: string;
  uploadUrl: string;
  sessionSecret: string;
  googleOauthClientId: string;
  googlePlacesApiKey: string;
  corsOrigins: string[];
};

function env(key: string, fallback = ""): string {
  return (process.env[key] ?? fallback).trim();
}

export function getServerConfig(): ServerConfig {
  const siteUrl = env("NEXT_PUBLIC_SITE_URL", env("CWS_SITE_URL", "http://localhost:3000")).replace(
    /\/$/,
    "",
  );
  const uploadDir =
    env("CWS_UPLOAD_DIR") ||
    (process.env.NODE_ENV === "production"
      ? `${process.cwd()}/data/uploads`
      : `${process.cwd()}/../data/uploads`);

  return {
    siteUrl,
    uploadDir,
    uploadUrl: env("CWS_UPLOAD_URL", "/api/v1/media/file"),
    sessionSecret: env("CWS_SESSION_SECRET", "change-me-in-production"),
    googleOauthClientId: env("GOOGLE_OAUTH_CLIENT_ID"),
    googlePlacesApiKey: env("GOOGLE_PLACES_API_KEY"),
    corsOrigins: (env("CWS_CORS_ORIGINS") || siteUrl)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  };
}

export function cmsPublicUrl(): string {
  const base = getServerConfig().siteUrl;
  return `${base}/api/v1`;
}

export function mediaPublicUrl(id: number, variant = "medium"): string {
  return `${cmsPublicUrl()}/media/${id}/file?variant=${encodeURIComponent(variant)}`;
}
