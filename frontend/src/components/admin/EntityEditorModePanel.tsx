"use client";

import { useEffect, useState } from "react";
import { DesimentorEditLink } from "@/components/admin/DesimentorEditLink";
import { publishDesimentorDocument } from "@/lib/admin/desimentor-client";
import { adminFetch } from "@/lib/admin/client";
import type { DesimentorEntityType } from "@/lib/desimentor/types";
import type { DisplayMode } from "@/lib/content/display-mode";

export type DesimentorMeta = {
  hasDocument: boolean;
  status: string | null;
  sectionCount: number;
  revision?: number;
};

export function EntityEditorModePanel({
  entityType,
  entityId,
  displayMode,
  desimentorMeta,
  onDisplayModeChange,
  classicPanel,
  isNew,
}: {
  entityType: DesimentorEntityType;
  entityId: number;
  displayMode: DisplayMode;
  desimentorMeta: DesimentorMeta;
  onDisplayModeChange: (mode: DisplayMode) => void;
  classicPanel: React.ReactNode;
  isNew?: boolean;
}) {
  const [tab, setTab] = useState<DisplayMode>(displayMode);
  const [modeBusy, setModeBusy] = useState(false);
  const [publishBusy, setPublishBusy] = useState(false);
  const [panelMsg, setPanelMsg] = useState("");
  const [panelErr, setPanelErr] = useState("");

  useEffect(() => {
    setTab(displayMode);
  }, [displayMode]);

  function displayModeApiPath(): string {
    if (entityType === "blog_post") return `/blog/${entityId}/display-mode`;
    if (entityType === "page" || entityType === "homepage") return `/pages/${entityId}/display-mode`;
    if (entityType === "service") return `/services/${entityId}/display-mode`;
    return `/landings/${entityId}/display-mode`;
  }

  async function setLiveMode(mode: DisplayMode) {
    if (isNew || !entityId) return;
    setModeBusy(true);
    setPanelErr("");
    try {
      const path = displayModeApiPath();
      await adminFetch(path, { method: "PUT", json: { display_mode: mode } });
      onDisplayModeChange(mode);
      setTab(mode);
      setPanelMsg(
        mode === "elementor"
          ? "Live site now uses the Desimentor layout (classic content is still saved)."
          : "Live site now uses classic content (Desimentor layout is still saved)."
      );
    } catch (e) {
      setPanelErr(String(e));
    } finally {
      setModeBusy(false);
    }
  }

  async function publishDesimentor() {
    setPublishBusy(true);
    setPanelErr("");
    try {
      await publishDesimentorDocument(entityType, entityId, { useOnSite: true });
      onDisplayModeChange("elementor");
      setTab("elementor");
      setPanelMsg("Desimentor layout published and set as the live version.");
    } catch (e) {
      setPanelErr(String(e));
    } finally {
      setPublishBusy(false);
    }
  }

  const liveLabel = displayMode === "elementor" ? "Desimentor" : "Classic";
  const dsStatus = desimentorMeta.status ?? "none";

  return (
    <div className="entity-editor-mode">
      <div className="entity-editor-mode__live">
        <span className="entity-editor-mode__live-label">Live on site:</span>
        <span className={`entity-editor-mode__badge entity-editor-mode__badge--${displayMode}`}>
          {liveLabel}
        </span>
        <span className="entity-editor-mode__hint">
          Classic and Desimentor content are stored separately — switching only changes what visitors see.
        </span>
      </div>

      {panelMsg ? <div className="cms-notice">{panelMsg}</div> : null}
      {panelErr ? <div className="cms-notice err">{panelErr}</div> : null}

      <div className="entity-editor-mode__tabs" role="tablist">
        <button
          type="button"
          role="tab"
          className={tab === "classic" ? "is-active" : ""}
          aria-selected={tab === "classic"}
          onClick={() => setTab("classic")}
        >
          <i className="fa-solid fa-pen-to-square" aria-hidden="true" />
          Classic editor
        </button>
        <button
          type="button"
          role="tab"
          className={tab === "elementor" ? "is-active" : ""}
          aria-selected={tab === "elementor"}
          onClick={() => setTab("elementor")}
          disabled={isNew}
          title={isNew ? "Save the page first to use Desimentor" : undefined}
        >
          <i className="fa-solid fa-wand-magic-sparkles" aria-hidden="true" />
          Desimentor
        </button>
      </div>

      {tab === "classic" ? (
        <div className="entity-editor-mode__panel">
          <p className="entity-editor-mode__panel-desc">
            Edit title, HTML content, and SEO. This does not change your Desimentor layout.
          </p>
          <div className="entity-editor-mode__actions">
            <button
              type="button"
              className="cms-btn cms-btn-green"
              disabled={modeBusy || isNew || displayMode === "classic"}
              onClick={() => setLiveMode("classic")}
            >
              {modeBusy ? "Updating…" : "Use classic on live site"}
            </button>
          </div>
          {classicPanel}
        </div>
      ) : (
        <div className="entity-editor-mode__panel entity-editor-mode__panel--elementor">
          {isNew ? (
            <p className="cms-notice">
              Save this page once, then you can open the Desimentor builder. Classic HTML can be added anytime.
            </p>
          ) : (
            <>
              <p className="entity-editor-mode__panel-desc">
                Build the page visually in Desimentor. Your classic HTML content stays in the Classic tab and is not
                overwritten.
              </p>
              <dl className="entity-editor-mode__stats">
                <div>
                  <dt>Desimentor status</dt>
                  <dd>{dsStatus === "published" ? "Published" : dsStatus === "draft" ? "Draft" : "Empty"}</dd>
                </div>
                <div>
                  <dt>Sections</dt>
                  <dd>{desimentorMeta.sectionCount}</dd>
                </div>
              </dl>
              <div className="entity-editor-mode__actions entity-editor-mode__actions--stack">
                <DesimentorEditLink entityType={entityType} entityId={entityId} />
                <button
                  type="button"
                  className="cms-btn cms-btn-green"
                  disabled={publishBusy}
                  onClick={() => publishDesimentor()}
                >
                  {publishBusy ? "Publishing…" : "Publish Desimentor layout"}
                </button>
                <button
                  type="button"
                  className="cms-btn cms-btn-ghost"
                  disabled={modeBusy || displayMode === "elementor"}
                  onClick={() => setLiveMode("elementor")}
                >
                  Use Desimentor on live site
                </button>
              </div>
              <p className="entity-editor-mode__footnote">
                <strong>Publish Desimentor layout</strong> saves the builder and switches the live site to Desimentor.
                You can switch back to classic anytime.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
