"use client";

import { useMemo, useState } from "react";
import { adminFetch } from "@/lib/admin/client";
import type { GmbApiPayload } from "@/lib/gmb/from-api";
import { parseGmbReviewsJson, serializeGmbReviews } from "@/lib/gmb/resolve";
import type { GmbReviewRecord } from "@/lib/gmb/types";

export function GmbSettingsEditor({
  reviewsJson,
  mapsUrl,
  cachedAt,
  useLive,
  onReviewsJsonChange,
  onSettingsPatch,
}: {
  reviewsJson: string;
  mapsUrl: string;
  cachedAt?: string;
  useLive?: string;
  onReviewsJsonChange: (json: string) => void;
  onSettingsPatch?: (patch: Record<string, string>) => void;
}) {
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");
  const [syncErr, setSyncErr] = useState("");

  const reviews = useMemo(() => parseGmbReviewsJson(reviewsJson), [reviewsJson]);

  function commit(next: GmbReviewRecord[]) {
    onReviewsJsonChange(serializeGmbReviews(next));
  }

  function toggleShow(index: number, show: boolean) {
    const next = reviews.map((r, i) => (i === index ? { ...r, showOnHomepage: show } : r));
    commit(next);
  }

  async function syncFromGoogle() {
    setSyncing(true);
    setSyncErr("");
    setSyncMsg("");
    try {
      const res = await adminFetch<{
        success: boolean;
        payload: GmbApiPayload;
        settings: Record<string, string>;
      }>("/gmb/sync", { method: "POST", json: {} });

      if (res.payload?.reviews?.length) {
        const merged: GmbReviewRecord[] = res.payload.reviews.map((r) => ({
          id: r.id,
          author: r.author,
          text: r.text,
          rating: r.rating,
          ago: r.ago,
          showOnHomepage: true,
          source: "google",
        }));
        commit(merged);
      }

      onSettingsPatch?.({
        gmbPlaceId: res.settings?.gmbPlaceId ?? "",
        gmbReviewsCachedAt: res.settings?.gmbReviewsCachedAt ?? "",
        gmbRating: res.settings?.gmbRating ?? "",
        gmbReviewCount: res.settings?.gmbReviewCount ?? "",
        gmbUseLive: "1",
        ...(res.payload?.mapsUrl ? { gmbMapsUrl: res.payload.mapsUrl } : {}),
        ...(res.payload?.placeName ? { gmbPlaceName: res.payload.placeName } : {}),
      });

      setSyncMsg(
        `Synced ${res.payload?.reviews?.length ?? 0} reviews from Google` +
          (res.settings?.gmbReviewsCachedAt ? ` · ${new Date(res.settings.gmbReviewsCachedAt).toLocaleString()}` : "")
      );
    } catch (e) {
      setSyncErr(String(e));
    } finally {
      setSyncing(false);
    }
  }

  const shownCount = reviews.filter((r) => r.showOnHomepage !== false).length;
  const liveOn = useLive !== "0" && useLive !== "false";

  return (
    <div className="gmb-settings-editor">
      <div className="gmb-settings-editor__toolbar">
        <p className="cms-field-hint">
          Reviews load from your{" "}
          <a href={mapsUrl || "#"} target="_blank" rel="noopener noreferrer">
            Google Business Profile
          </a>{" "}
          via Places API (up to 5 latest). Homepage shows {shownCount} selected review
          {shownCount === 1 ? "" : "s"}.
        </p>
        {cachedAt ? (
          <p className="cms-field-hint">
            Last synced: {new Date(cachedAt).toLocaleString()}
            {liveOn ? " · auto-refresh every 12h" : ""}
          </p>
        ) : null}
        <div className="gmb-settings-editor__actions">
          <button type="button" className="cms-btn cms-btn-primary" onClick={syncFromGoogle} disabled={syncing}>
            {syncing ? "Syncing…" : "Sync reviews from Google"}
          </button>
        </div>
        {syncMsg ? <p className="cms-notice ok">{syncMsg}</p> : null}
        {syncErr ? <p className="cms-notice err">{syncErr}</p> : null}
        <p className="cms-field-hint">
          Requires <code>google.places_api_key</code> in <code>cms/config.php</code> (Places API enabled in Google
          Cloud).
        </p>
      </div>

      {!reviews.length ? (
        <p className="cms-field-hint">No reviews yet — click Sync reviews from Google.</p>
      ) : (
        <div className="gmb-settings-editor__list">
          {reviews.map((review, i) => (
            <div key={review.id || i} className="gmb-settings-editor__card gmb-settings-editor__card--readonly">
              <div className="gmb-settings-editor__card-head">
                <strong>{review.author}</strong>
                <span className="gmb-settings-editor__rating">{review.rating}★</span>
                <label className="gmb-settings-editor__show">
                  <input
                    type="checkbox"
                    checked={review.showOnHomepage !== false}
                    onChange={(e) => toggleShow(i, e.target.checked)}
                  />
                  Show on homepage
                </label>
              </div>
              <p className="gmb-settings-editor__text">{review.text}</p>
              {review.ago ? <span className="gmb-settings-editor__ago">{review.ago}</span> : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
