"use client";

import { useEffect, useState } from "react";
import { stylesToCss, scopedClass } from "@/lib/desimentor/apply-styles";
import type { DesimentorWidget } from "@/lib/desimentor/types";
import { DesimentorSlider } from "./DesimentorSlider";

function videoEmbedUrl(source: string, url: string): string {
  const u = String(url || "");
  if (source === "youtube") {
    const m = u.match(/(?:embed\/|v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
    return m ? `https://www.youtube.com/embed/${m[1]}` : u;
  }
  if (source === "vimeo") {
    const m = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    return m ? `https://player.vimeo.com/video/${m[1]}` : u;
  }
  return u;
}

type RepeaterItem = Record<string, string>;

function asItems(v: unknown): RepeaterItem[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x) => x && typeof x === "object") as RepeaterItem[];
}

function CarouselSlides({ items, autoplay, interval }: { items: RepeaterItem[]; autoplay: boolean; interval: number }) {
  const [idx, setIdx] = useState(0);
  const slides = items.filter((i) => i.url);

  useEffect(() => {
    if (!autoplay || slides.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), Math.max(2, interval) * 1000);
    return () => clearInterval(t);
  }, [autoplay, interval, slides.length]);

  if (!slides.length) return <div className="dsmt-carousel-empty">Add slides in the sidebar</div>;

  return (
    <div className="dsmt-carousel">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={slides[idx]?.url} alt={slides[idx]?.alt || ""} />
      {slides.length > 1 ? (
        <div className="dsmt-carousel-dots">
          {slides.map((_, i) => (
            <button key={i} type="button" className={i === idx ? "active" : ""} onClick={() => setIdx(i)} aria-label={`Slide ${i + 1}`} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function InteractiveTabs({ items }: { items: RepeaterItem[] }) {
  const [active, setActive] = useState(0);
  if (!items.length) return null;
  const safe = Math.min(active, items.length - 1);
  return (
    <div className="dsmt-tabs">
      <div className="dsmt-tabs-nav" role="tablist">
        {items.map((item, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            className={i === safe ? "active" : ""}
            onClick={() => setActive(i)}
          >
            {item.title || `Tab ${i + 1}`}
          </button>
        ))}
      </div>
      <div
        className="dsmt-tabs-panel seo-rich-prose"
        role="tabpanel"
        dangerouslySetInnerHTML={{ __html: String(items[safe]?.content ?? "") }}
      />
    </div>
  );
}

export type WidgetContentProps = {
  widget: DesimentorWidget;
  editable?: boolean;
  onPropChange?: (key: string, value: unknown) => void;
};

export function WidgetContent({ widget, editable = false, onPropChange }: WidgetContentProps) {
  const cls = scopedClass(widget.id);
  const style = stylesToCss(widget.styles);
  const customCss = widget.styles?.customCss;
  const p = widget.props;
  const stopNav = (e: React.MouseEvent) => {
    if (editable) e.preventDefault();
  };

  function inlineText(
    key: string,
    value: string,
    Tag: keyof JSX.IntrinsicElements = "span",
    className = ""
  ) {
    if (!editable || !onPropChange) {
      const El = Tag;
      return <El className={className}>{value}</El>;
    }
    return (
      <Tag
        className={`desimentor-inline-edit ${className}`.trim()}
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => onPropChange(key, e.currentTarget.textContent ?? "")}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        dangerouslySetInnerHTML={Tag === "div" ? undefined : undefined}
      >
        {value}
      </Tag>
    );
  }

  function inlineHtml(key: string, html: string, className: string) {
    if (!editable || !onPropChange) {
      return (
        <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
      );
    }
    return (
      <div
        className={`desimentor-inline-edit seo-rich-prose ${className}`}
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => onPropChange(key, e.currentTarget.innerHTML)}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  let inner: React.ReactNode = null;

  switch (widget.type) {
    case "heading": {
      const Tag = (p.tag as keyof JSX.IntrinsicElements) || "h2";
      inner = editable && onPropChange ? (
        <Tag
          className={`${cls} dsmt-heading desimentor-inline-edit`}
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => onPropChange("text", e.currentTarget.textContent ?? "")}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {String(p.text ?? "")}
        </Tag>
      ) : (
        <Tag className={`${cls} dsmt-heading`}>{String(p.text ?? "")}</Tag>
      );
      break;
    }
    case "text":
      inner = inlineHtml("html", String(p.html ?? ""), `${cls} dsmt-text`);
      break;
    case "button": {
      const variant = String(p.variant ?? "primary");
      const btnClass =
        variant === "link"
          ? "dsmt-btn-link"
          : variant === "outline"
            ? "btn btn-outline-primary"
            : "btn btn-primary-custom";
      inner = (
        <a
          href={String(p.href ?? "#")}
          target={String(p.target ?? "_self")}
          className={`${cls} dsmt-btn ${btnClass} dsmt-btn-${p.size ?? "md"}`}
          onClick={stopNav}
        >
          {editable && onPropChange ? (
            <span
              className="desimentor-inline-edit"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => onPropChange("label", e.currentTarget.textContent ?? "")}
              onMouseDown={(e) => e.stopPropagation()}
            >
              {String(p.label ?? "Button")}
            </span>
          ) : (
            String(p.label ?? "Button")
          )}
        </a>
      );
      break;
    }
    case "read-more":
      inner = (
        <a href={String(p.href ?? "#")} className={`${cls} dsmt-read-more`} onClick={stopNav}>
          {inlineText("label", String(p.label ?? "Read more"))}
        </a>
      );
      break;
    case "image": {
      const url = String(p.url ?? "");
      const img = url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={String(p.alt ?? "")} className={`${cls} dsmt-image`} style={{ maxWidth: "100%", height: "auto" }} />
      ) : (
        <div className={`${cls} dsmt-image-placeholder`}>Select an image in the sidebar</div>
      );
      const link = String(p.link ?? "");
      inner = link ? (
        <a href={link} onClick={stopNav}>{img}</a>
      ) : (
        img
      );
      break;
    }
    case "gallery": {
      const cols = Number(p.columns) || 3;
      const items = asItems(p.items).filter((i) => i.url);
      inner = (
        <div className={`${cls} dsmt-gallery`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {items.map((item, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={item.url} alt={item.alt || ""} />
          ))}
        </div>
      );
      break;
    }
    case "video":
      inner = (
        <div className={`${cls} dsmt-video`} style={{ aspectRatio: String(p.aspectRatio ?? "16/9") }}>
          <iframe
            src={videoEmbedUrl(String(p.source ?? "youtube"), String(p.url ?? ""))}
            title="Video"
            allowFullScreen
            loading="lazy"
          />
        </div>
      );
      break;
    case "audio":
      inner = p.url ? (
        <audio className={`${cls} dsmt-audio`} controls src={String(p.url)} />
      ) : (
        <div className="dsmt-audio-placeholder">Add audio URL in sidebar</div>
      );
      break;
    case "icon":
      inner = (
        <i
          className={`${cls} ${String(p.iconClass ?? "fas fa-star")}`}
          style={{ fontSize: String(p.size ?? "2rem"), color: String(p.color ?? "#0057ff") }}
          aria-hidden="true"
        />
      );
      break;
    case "icon-box":
      inner = (
        <div className={`${cls} dsmt-icon-box dsmt-icon-box--${p.position ?? "top"}`}>
          <i
            className={String(p.iconClass ?? "fas fa-star")}
            style={{ color: String(p.iconColor ?? "#0057ff") }}
            aria-hidden="true"
          />
          <div>
            <h4 className="dsmt-icon-box-title">
              {inlineText("title", String(p.title ?? ""), "span")}
            </h4>
            <p className="dsmt-icon-box-desc">
              {editable && onPropChange ? (
                <span
                  className="desimentor-inline-edit"
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => onPropChange("description", e.currentTarget.textContent ?? "")}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  {String(p.description ?? "")}
                </span>
              ) : (
                String(p.description ?? "")
              )}
            </p>
          </div>
        </div>
      );
      break;
    case "image-box":
      inner = (
        <a href={String(p.link ?? "#")} className={`${cls} dsmt-image-box`} onClick={stopNav}>
          {p.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={String(p.url)} alt="" />
          ) : (
            <div className="dsmt-image-placeholder">Image</div>
          )}
          <div className="dsmt-image-box-body">
            <h4>{inlineText("title", String(p.title ?? ""), "span")}</h4>
            <p>{String(p.description ?? "")}</p>
          </div>
        </a>
      );
      break;
    case "slider":
      inner = (
        <DesimentorSlider widgetId={widget.id} props={p} editable={false} device="desktop" />
      );
      break;
    case "carousel":
      inner = (
        <CarouselSlides
          items={asItems(p.items)}
          autoplay={Boolean(p.autoplay)}
          interval={Number(p.interval) || 5}
        />
      );
      break;
    case "spacer":
      inner = <div className={`${cls} dsmt-spacer`} style={{ height: String(p.height ?? "40px") }} aria-hidden="true" />;
      break;
    case "divider":
      inner = (
        <hr
          className={`${cls} dsmt-divider`}
          style={{
            borderColor: String(p.color ?? "#e2e8f0"),
            borderStyle: String(p.style ?? "solid"),
            width: String(p.width ?? "100%"),
          }}
        />
      );
      break;
    case "html":
      inner = <div className={`${cls} dsmt-html`} dangerouslySetInnerHTML={{ __html: String(p.html ?? "") }} />;
      break;
    case "shortcode":
      inner = <div className={`${cls} dsmt-shortcode`}>[{String(p.shortcode ?? "").replace(/^\[|\]$/g, "")}]</div>;
      break;
    case "container":
      inner = (
        <div className={`${cls} dsmt-container`} style={{ maxWidth: String(p.maxWidth ?? "1200px"), margin: "0 auto" }} />
      );
      break;
    case "menu-anchor":
      inner = <span id={String(p.anchorId ?? "anchor")} className={`${cls} dsmt-anchor`} />;
      break;
    case "blockquote":
      inner = (
        <blockquote className={`${cls} dsmt-blockquote`}>
          <p>{inlineText("quote", String(p.quote ?? ""), "span")}</p>
          <footer>— {inlineText("author", String(p.author ?? ""), "span")}</footer>
        </blockquote>
      );
      break;
    case "tabs":
      inner = <InteractiveTabs items={asItems(p.items)} />;
      break;
    case "accordion":
      inner = (
        <div className={`${cls} dsmt-accordion`}>
          {asItems(p.items).map((item, i) => (
            <details key={i} className="dsmt-accordion-item">
              <summary>{item.title || `Item ${i + 1}`}</summary>
              <div
                className="seo-rich-prose"
                dangerouslySetInnerHTML={{ __html: String(item.content ?? "") }}
              />
            </details>
          ))}
        </div>
      );
      break;
    case "toggle":
      inner = (
        <details className={`${cls} dsmt-toggle`} open={Boolean(p.defaultOpen)}>
          <summary>
            {editable && onPropChange ? (
              <span
                className="desimentor-inline-edit"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => onPropChange("title", e.currentTarget.textContent ?? "")}
                onMouseDown={(e) => e.stopPropagation()}
              >
                {String(p.title ?? "")}
              </span>
            ) : (
              String(p.title ?? "")
            )}
          </summary>
          <div
            className="seo-rich-prose"
            dangerouslySetInnerHTML={{ __html: String(p.content ?? "") }}
          />
        </details>
      );
      break;
    case "counter":
      inner = (
        <div className={`${cls} dsmt-counter`}>
          <div className="dsmt-counter-number">
            {String(p.number ?? 0)}
            {String(p.suffix ?? "")}
          </div>
          <div className="dsmt-counter-title">{String(p.title ?? "")}</div>
        </div>
      );
      break;
    case "progress": {
      const pct = Math.min(100, Math.max(0, Number(p.percent) || 0));
      inner = (
        <div className={`${cls} dsmt-progress`}>
          <div className="dsmt-progress-label">{String(p.title ?? "")}</div>
          <div className="dsmt-progress-track">
            <div className="dsmt-progress-bar" style={{ width: `${pct}%`, backgroundColor: String(p.color ?? "#0057ff") }} />
          </div>
          <span className="dsmt-progress-pct">{pct}%</span>
        </div>
      );
      break;
    }
    case "testimonial":
      inner = (
        <div className={`${cls} dsmt-testimonial`}>
          {p.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={String(p.imageUrl)} alt="" className="dsmt-testimonial-avatar" />
          ) : null}
          <blockquote>{String(p.content ?? "")}</blockquote>
          <cite>
            {String(p.name ?? "")}
            {p.role ? <span> — {String(p.role)}</span> : null}
          </cite>
        </div>
      );
      break;
    case "alert":
      inner = (
        <div className={`${cls} dsmt-alert dsmt-alert--${p.type ?? "info"}`} role="alert">
          <strong>{inlineText("title", String(p.title ?? ""), "span")}</strong>
          <p>{String(p.message ?? "")}</p>
        </div>
      );
      break;
    case "social-icons":
      inner = (
        <div className={`${cls} dsmt-social-icons`}>
          {asItems(p.items).map((item, i) => (
            <a
              key={i}
              href={item.url || "#"}
              className={item.iconClass}
              style={{ fontSize: String(p.size ?? "1.25rem"), color: String(p.color ?? "#0057ff") }}
              aria-label="Social"
              onClick={stopNav}
            />
          ))}
        </div>
      );
      break;
    case "icon-list":
      inner = (
        <ul className={`${cls} dsmt-icon-list`}>
          {asItems(p.items).map((item, i) => (
            <li key={i}>
              <i className={item.iconClass || "fas fa-check"} style={{ color: String(p.iconColor ?? "#0057ff") }} aria-hidden="true" />
              {item.text}
            </li>
          ))}
        </ul>
      );
      break;
    case "star-rating": {
      const rating = Number(p.rating) || 0;
      const scale = Number(p.scale) || 5;
      inner = (
        <div className={`${cls} dsmt-star-rating`} aria-label={`${rating} of ${scale}`}>
          {Array.from({ length: scale }, (_, i) => (
            <i key={i} className={i < Math.floor(rating) ? "fas fa-star" : i < rating ? "fas fa-star-half-stroke" : "far fa-star"} aria-hidden="true" />
          ))}
        </div>
      );
      break;
    }
    case "call-to-action":
      inner = (
        <div
          className={`${cls} dsmt-cta`}
          style={{ backgroundColor: String(p.bgColor ?? "#0a1e5e"), color: String(p.textColor ?? "#fff") }}
        >
          <h3>{inlineText("title", String(p.title ?? ""), "span")}</h3>
          <p>{String(p.description ?? "")}</p>
          <a href={String(p.buttonHref ?? "#")} className="btn btn-primary-custom" onClick={stopNav}>
            {String(p.buttonLabel ?? "Button")}
          </a>
        </div>
      );
      break;
    case "price-table": {
      const features = String(p.features ?? "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
      inner = (
        <div className={`${cls} dsmt-price-table${p.featured ? " is-featured" : ""}`}>
          <h4>{String(p.title ?? "")}</h4>
          <div className="dsmt-price">
            {String(p.price ?? "")}
            <small>{String(p.period ?? "")}</small>
          </div>
          <ul>
            {features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
          <a href={String(p.buttonHref ?? "#")} className="btn btn-primary-custom" onClick={stopNav}>
            {String(p.buttonLabel ?? "Choose")}
          </a>
        </div>
      );
      break;
    }
    case "countdown":
      inner = (
        <div className={`${cls} dsmt-countdown`}>
          <h4>{String(p.title ?? "")}</h4>
          <p className="dsmt-countdown-date">Target: {String(p.targetDate ?? "")}</p>
        </div>
      );
      break;
    case "flip-box":
      inner = (
        <div className={`${cls} dsmt-flip-box`}>
          <div className="dsmt-flip-front" style={{ background: String(p.bgFront ?? "#0057ff") }}>
            <h4>{String(p.frontTitle ?? "")}</h4>
            <p>{String(p.frontText ?? "")}</p>
          </div>
          <div className="dsmt-flip-back" style={{ background: String(p.bgBack ?? "#0a1e5e") }}>
            <h4>{String(p.backTitle ?? "")}</h4>
            <p>{String(p.backText ?? "")}</p>
          </div>
        </div>
      );
      break;
    case "animated-headline":
      inner = (
        <h2 className={`${cls} dsmt-animated-headline`}>
          {String(p.before ?? "")}{" "}
          <span style={{ color: String(p.highlightColor ?? "#93003c") }}>{String(p.highlight ?? "")}</span>{" "}
          {String(p.after ?? "")}
        </h2>
      );
      break;
    case "google-maps":
      inner = (
        <div className={`${cls} dsmt-map`} style={{ height: String(p.height ?? "400px") }}>
          <iframe src={String(p.embedUrl ?? "")} title="Map" loading="lazy" allowFullScreen />
        </div>
      );
      break;
    case "form": {
      const fields = String(p.fields ?? "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [name, label, type] = line.split(":").map((s) => s.trim());
          return { name, label: label || name, type: type || "text" };
        });
      inner = (
        <form className={`${cls} dsmt-form`} onSubmit={(e) => e.preventDefault()}>
          {p.title ? <h4>{String(p.title)}</h4> : null}
          {fields.map((f) => (
            <div key={f.name} className="dsmt-form-field">
              <label>{f.label}</label>
              {f.type === "textarea" ? (
                <textarea name={f.name} rows={4} />
              ) : (
                <input type={f.type} name={f.name} />
              )}
            </div>
          ))}
          <button type="submit" className="btn btn-primary-custom">
            {String(p.submitLabel ?? "Send")}
          </button>
        </form>
      );
      break;
    }
    case "site-logo":
      inner = p.url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={String(p.url)} alt={String(p.alt ?? "")} style={{ width: String(p.width ?? "180px") }} className={`${cls} dsmt-site-logo`} />
      ) : (
        <div className="dsmt-image-placeholder">Site logo</div>
      );
      break;
    case "search-form":
      inner = (
        <form className={`${cls} dsmt-search`} action={String(p.action ?? "/search")} method="get" onSubmit={(e) => editable && e.preventDefault()}>
          <input type="search" name="q" placeholder={String(p.placeholder ?? "Search…")} />
          <button type="submit" aria-label="Search">
            <i className="fas fa-magnifying-glass" aria-hidden="true" />
          </button>
        </form>
      );
      break;
    default:
      inner = <div className={cls}>Widget: {widget.type}</div>;
  }

  return (
    <>
      {customCss ? <style dangerouslySetInnerHTML={{ __html: `.${cls}{${customCss}}` }} /> : null}
      <div style={style}>{inner}</div>
    </>
  );
}
