import type { DesimentorWidget } from "./types";

function hasUrlItems(items: unknown): boolean {
  if (!Array.isArray(items)) return false;
  return items.some((i) => i && typeof i === "object" && Boolean((i as { url?: string }).url));
}

/** Empty / default widgets show compact chrome (no title, delete only). */
export function isPlaceholderWidget(widget: DesimentorWidget): boolean {
  const p = widget.props;
  switch (widget.type) {
    case "image":
    case "site-logo":
      return !p.url;
    case "video":
    case "audio":
      return !p.url;
    case "gallery":
    case "slider": {
      const slides = Array.isArray(p.slides) ? (p.slides as { bgImage?: string }[]) : [];
      return !slides.some((s) => s?.bgImage);
    }
    case "carousel":
      return !hasUrlItems(p.items);
    case "image-box":
      return !p.url;
    case "button":
      return !p.label || p.label === "Click here";
    case "spacer":
    case "divider":
    case "html":
    case "menu-anchor":
      return true;
    default:
      return false;
  }
}

export function isResizableWidget(widget: DesimentorWidget): boolean {
  if (isPlaceholderWidget(widget)) return true;
  return ["spacer", "image", "video", "gallery", "slider", "carousel", "container", "call-to-action", "google-maps"].includes(
    widget.type
  );
}

export function defaultPlaceholderSize(widget: DesimentorWidget): { minHeight?: string; width?: string } {
  if (widget.styles?.minHeight || widget.styles?.width) return {};
  if (widget.type === "spacer") return { minHeight: String(widget.props.height ?? "40px") };
  return { minHeight: "120px", width: "100%" };
}
