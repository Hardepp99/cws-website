"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function SlugError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[page error]", error);
  }, [error]);

  const isChunkError =
    error.message?.includes("ChunkLoadError") ||
    error.message?.includes("Loading chunk");

  return (
    <div className="corp-error-page">
      <div className="container text-center py-5" style={{ minHeight: "60vh", paddingTop: 120 }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 16 }}>
          {isChunkError ? "Page is reloading…" : "Something went wrong"}
        </h1>
        <p style={{ color: "#64748b", marginBottom: 24 }}>
          {isChunkError
            ? "The page bundle was updated. Click below to load the latest version."
            : "We could not load this page. Please try again."}
        </p>
        <div className="d-flex gap-3 justify-content-center flex-wrap">
          <button type="button" className="btn btn-primary-custom" onClick={() => reset()}>
            Try again
          </button>
          <Link href="/" className="btn btn-outline-custom">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
