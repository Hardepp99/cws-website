import { createWidget } from "./document-utils";
import { defaultSlides } from "./slider-types";

export type WidgetFieldType =
  | "text"
  | "textarea"
  | "number"
  | "color"
  | "select"
  | "media"
  | "icon"
  | "url"
  | "toggle"
  | "repeater";

export type RepeaterSubField = {
  key: string;
  label: string;
  type: "text" | "textarea" | "media" | "url";
};

export type WidgetFieldDef = {
  key: string;
  label: string;
  type: WidgetFieldType;
  options?: { value: string; label: string }[];
  repeaterFields?: RepeaterSubField[];
  hint?: string;
};

export type WidgetCategory = "layout" | "basic" | "media" | "pro" | "general" | "site";

export type WidgetDef = {
  type: string;
  label: string;
  icon: string;
  category: WidgetCategory;
  defaultProps: Record<string, unknown>;
  contentFields: WidgetFieldDef[];
  inlineEditable?: boolean;
};

function w(
  type: string,
  label: string,
  icon: string,
  category: WidgetCategory,
  defaultProps: Record<string, unknown>,
  contentFields: WidgetFieldDef[],
  inlineEditable = true
): WidgetDef {
  return { type, label, icon, category, defaultProps, contentFields, inlineEditable };
}

export const WIDGET_REGISTRY: WidgetDef[] = [
  // Layout
  w("spacer", "Spacer", "fa-arrows-up-down", "layout", { height: "40px" }, [
    { key: "height", label: "Height", type: "text" },
  ], false),
  w("divider", "Divider", "fa-minus", "layout", { color: "#e2e8f0", style: "solid", width: "100%" }, [
    { key: "color", label: "Color", type: "color" },
    { key: "style", label: "Style", type: "select", options: [
      { value: "solid", label: "Solid" },
      { value: "dashed", label: "Dashed" },
      { value: "dotted", label: "Dotted" },
    ]},
    { key: "width", label: "Width", type: "text" },
  ], false),
  w("container", "Inner Container", "fa-square", "layout", { maxWidth: "1200px" }, [
    { key: "maxWidth", label: "Max width", type: "text" },
  ], false),

  // Basic
  w("heading", "Heading", "fa-heading", "basic", { text: "Add Your Heading Text Here", tag: "h2" }, [
    { key: "text", label: "Title", type: "text" },
    { key: "tag", label: "HTML Tag", type: "select", options: [
      { value: "h1", label: "H1" },
      { value: "h2", label: "H2" },
      { value: "h3", label: "H3" },
      { value: "h4", label: "H4" },
      { value: "h5", label: "H5" },
      { value: "h6", label: "H6" },
    ]},
  ]),
  w("text", "Text Editor", "fa-align-left", "basic", {
    html: "<p>Type your content here. Click on the canvas to edit directly.</p>",
  }, [{ key: "html", label: "Content", type: "textarea" }]),
  w("button", "Button", "fa-hand-pointer", "basic", {
    label: "Click here",
    href: "#",
    variant: "primary",
    size: "md",
    target: "_self",
  }, [
    { key: "label", label: "Text", type: "text" },
    { key: "href", label: "Link", type: "url" },
    { key: "variant", label: "Type", type: "select", options: [
      { value: "primary", label: "Primary" },
      { value: "outline", label: "Outline" },
      { value: "link", label: "Link" },
    ]},
    { key: "size", label: "Size", type: "select", options: [
      { value: "sm", label: "Small" },
      { value: "md", label: "Medium" },
      { value: "lg", label: "Large" },
    ]},
    { key: "target", label: "Open in", type: "select", options: [
      { value: "_self", label: "Same window" },
      { value: "_blank", label: "New window" },
    ]},
  ]),
  w("read-more", "Read More", "fa-ellipsis", "basic", { label: "Read more", href: "#" }, [
    { key: "label", label: "Text", type: "text" },
    { key: "href", label: "Link", type: "url" },
  ]),
  w("blockquote", "Blockquote", "fa-quote-left", "basic", {
    quote: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  }, [
    { key: "quote", label: "Quote", type: "textarea" },
    { key: "author", label: "Author", type: "text" },
  ]),
  w("menu-anchor", "Menu Anchor", "fa-anchor", "basic", { anchorId: "section" }, [
    { key: "anchorId", label: "CSS ID", type: "text", hint: "No spaces. Used in menu links as #id" },
  ], false),

  // Media
  w("image", "Image", "fa-image", "media", { mediaId: null, url: "", alt: "", link: "" }, [
    { key: "url", label: "Image", type: "media" },
    { key: "alt", label: "Alt text", type: "text" },
    { key: "link", label: "Link (optional)", type: "url" },
  ], false),
  w("gallery", "Image Gallery", "fa-images", "media", {
    columns: 3,
    items: [{ url: "", alt: "" }, { url: "", alt: "" }, { url: "", alt: "" }],
  }, [
    { key: "columns", label: "Columns", type: "number" },
    {
      key: "items",
      label: "Images",
      type: "repeater",
      repeaterFields: [
        { key: "url", label: "Image", type: "media" },
        { key: "alt", label: "Alt", type: "text" },
      ],
    },
  ], false),
  w("video", "Video", "fa-video", "media", {
    source: "youtube",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    aspectRatio: "16/9",
  }, [
    { key: "source", label: "Source", type: "select", options: [
      { value: "youtube", label: "YouTube" },
      { value: "vimeo", label: "Vimeo" },
      { value: "hosted", label: "Self hosted URL" },
    ]},
    { key: "url", label: "URL", type: "url" },
    { key: "aspectRatio", label: "Aspect ratio", type: "text" },
  ], false),
  w("audio", "Audio", "fa-volume-high", "media", { url: "" }, [
    { key: "url", label: "Audio file URL", type: "media", hint: "Select or paste MP3 URL" },
  ], false),
  w("icon", "Icon", "fa-icons", "media", { iconClass: "fas fa-star", size: "2rem", color: "#0057ff" }, [
    { key: "iconClass", label: "Icon", type: "icon" },
    { key: "size", label: "Size", type: "text" },
    { key: "color", label: "Color", type: "color" },
  ], false),
  w("icon-box", "Icon Box", "fa-cube", "media", {
    iconClass: "fas fa-rocket",
    title: "This is the heading",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    iconColor: "#0057ff",
    position: "top",
  }, [
    { key: "iconClass", label: "Icon", type: "icon" },
    { key: "title", label: "Title", type: "text" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "iconColor", label: "Icon color", type: "color" },
    { key: "position", label: "Icon position", type: "select", options: [
      { value: "top", label: "Top" },
      { value: "left", label: "Left" },
    ]},
  ]),
  w("image-box", "Image Box", "fa-image", "media", {
    url: "",
    title: "Title",
    description: "Description",
    link: "#",
  }, [
    { key: "url", label: "Image", type: "media" },
    { key: "title", label: "Title", type: "text" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "link", label: "Link", type: "url" },
  ]),
  w("slider", "Slides", "fa-panorama", "media", {
    slides: defaultSlides(),
    activeSlideIndex: 0,
    autoplay: true,
    interval: 6,
    effect: "fade",
    loop: true,
    showArrows: true,
    showPagination: true,
    heightDesktop: "560px",
    heightTablet: "480px",
    heightMobile: "360px",
  }, [
    {
      key: "slides",
      label: "Slides",
      type: "repeater",
      repeaterFields: [
        { key: "bgImage", label: "Background (desktop)", type: "media" },
        { key: "bgImageTablet", label: "Background (tablet)", type: "media" },
        { key: "bgImageMobile", label: "Background (mobile)", type: "media" },
        { key: "title", label: "Title", type: "text" },
        { key: "subtitle", label: "Subtitle", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "buttonLabel", label: "Button text", type: "text" },
        { key: "buttonHref", label: "Button link", type: "url" },
        { key: "overlayOpacity", label: "Overlay (0–1)", type: "text" },
        {
          key: "contentAlign",
          label: "Align",
          type: "text",
        },
        { key: "textColor", label: "Text color", type: "text" },
      ],
    },
    { key: "autoplay", label: "Autoplay", type: "toggle" },
    { key: "interval", label: "Interval (sec)", type: "number" },
    {
      key: "effect",
      label: "Effect",
      type: "select",
      options: [
        { value: "fade", label: "Fade" },
        { value: "slide", label: "Slide" },
      ],
    },
    { key: "loop", label: "Loop", type: "toggle" },
    { key: "showArrows", label: "Arrows", type: "toggle" },
    { key: "showPagination", label: "Dots", type: "toggle" },
    { key: "heightDesktop", label: "Height desktop", type: "text" },
    { key: "heightTablet", label: "Height tablet", type: "text" },
    { key: "heightMobile", label: "Height mobile", type: "text" },
  ], false),
  w("carousel", "Image Carousel", "fa-clone", "media", {
    items: [{ url: "", alt: "" }],
    autoplay: false,
    interval: 5,
  }, [
    {
      key: "items",
      label: "Slides",
      type: "repeater",
      repeaterFields: [
        { key: "url", label: "Image", type: "media" },
        { key: "alt", label: "Alt", type: "text" },
      ],
    },
    { key: "autoplay", label: "Autoplay", type: "toggle" },
    { key: "interval", label: "Interval (sec)", type: "number" },
  ], false),

  // Pro
  w("tabs", "Tabs", "fa-folder", "pro", {
    items: [
      { title: "Tab 1", content: "<p>Tab content 1</p>" },
      { title: "Tab 2", content: "<p>Tab content 2</p>" },
    ],
  }, [
    {
      key: "items",
      label: "Tabs",
      type: "repeater",
      repeaterFields: [
        { key: "title", label: "Title", type: "text" },
        { key: "content", label: "Content", type: "textarea" },
      ],
    },
  ], false),
  w("accordion", "Accordion", "fa-list", "pro", {
    items: [
      { title: "Accordion #1", content: "<p>Content for item 1</p>" },
      { title: "Accordion #2", content: "<p>Content for item 2</p>" },
    ],
  }, [
    {
      key: "items",
      label: "Items",
      type: "repeater",
      repeaterFields: [
        { key: "title", label: "Title", type: "text" },
        { key: "content", label: "Content", type: "textarea" },
      ],
    },
  ], false),
  w("toggle", "Toggle", "fa-toggle-on", "pro", {
    title: "Toggle title",
    content: "<p>Hidden content revealed when open.</p>",
    defaultOpen: false,
  }, [
    { key: "title", label: "Title", type: "text" },
    { key: "content", label: "Content", type: "textarea" },
    { key: "defaultOpen", label: "Open by default", type: "toggle" },
  ]),
  w("counter", "Counter", "fa-sort-numeric-up", "pro", {
    number: 100,
    suffix: "+",
    title: "Happy Clients",
    duration: 2,
  }, [
    { key: "number", label: "Number", type: "number" },
    { key: "suffix", label: "Suffix", type: "text" },
    { key: "title", label: "Title", type: "text" },
    { key: "duration", label: "Animation (sec)", type: "number" },
  ]),
  w("progress", "Progress Bar", "fa-bars-progress", "pro", {
    percent: 75,
    title: "Skill",
    color: "#0057ff",
  }, [
    { key: "percent", label: "Percentage", type: "number" },
    { key: "title", label: "Title", type: "text" },
    { key: "color", label: "Color", type: "color" },
  ], false),
  w("testimonial", "Testimonial", "fa-comment-dots", "pro", {
    content: "Great service and support!",
    name: "John Doe",
    role: "CEO",
    imageUrl: "",
  }, [
    { key: "content", label: "Content", type: "textarea" },
    { key: "name", label: "Name", type: "text" },
    { key: "role", label: "Job title", type: "text" },
    { key: "imageUrl", label: "Avatar", type: "media" },
  ]),
  w("alert", "Alert", "fa-circle-exclamation", "pro", {
    type: "info",
    title: "Heads up!",
    message: "This is an alert message.",
  }, [
    { key: "type", label: "Type", type: "select", options: [
      { value: "info", label: "Info" },
      { value: "success", label: "Success" },
      { value: "warning", label: "Warning" },
      { value: "danger", label: "Danger" },
    ]},
    { key: "title", label: "Title", type: "text" },
    { key: "message", label: "Message", type: "textarea" },
  ]),
  w("social-icons", "Social Icons", "fa-share-nodes", "pro", {
    items: [
      { iconClass: "fab fa-facebook", url: "#" },
      { iconClass: "fab fa-linkedin", url: "#" },
      { iconClass: "fab fa-x-twitter", url: "#" },
    ],
    size: "1.25rem",
    color: "#0057ff",
  }, [
    {
      key: "items",
      label: "Icons",
      type: "repeater",
      repeaterFields: [
        { key: "iconClass", label: "Icon class", type: "text" },
        { key: "url", label: "Link", type: "url" },
      ],
    },
    { key: "size", label: "Size", type: "text" },
    { key: "color", label: "Color", type: "color" },
  ], false),
  w("icon-list", "Icon List", "fa-list-ul", "pro", {
    items: [
      { iconClass: "fas fa-check", text: "List item one" },
      { iconClass: "fas fa-check", text: "List item two" },
    ],
    iconColor: "#0057ff",
  }, [
    {
      key: "items",
      label: "Items",
      type: "repeater",
      repeaterFields: [
        { key: "iconClass", label: "Icon", type: "text" },
        { key: "text", label: "Text", type: "text" },
      ],
    },
    { key: "iconColor", label: "Icon color", type: "color" },
  ], false),
  w("star-rating", "Star Rating", "fa-star", "pro", { rating: 4.5, scale: 5 }, [
    { key: "rating", label: "Rating", type: "number" },
    { key: "scale", label: "Scale", type: "number" },
  ], false),
  w("call-to-action", "Call to Action", "fa-bullhorn", "pro", {
    title: "Ready to get started?",
    description: "Contact us today for a free consultation.",
    buttonLabel: "Get in touch",
    buttonHref: "/contact",
    bgColor: "#0a1e5e",
    textColor: "#ffffff",
  }, [
    { key: "title", label: "Title", type: "text" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "buttonLabel", label: "Button text", type: "text" },
    { key: "buttonHref", label: "Button link", type: "url" },
    { key: "bgColor", label: "Background", type: "color" },
    { key: "textColor", label: "Text color", type: "color" },
  ]),
  w("price-table", "Price Table", "fa-table", "pro", {
    title: "Basic",
    price: "$29",
    period: "/mo",
    features: "Feature one\nFeature two\nFeature three",
    buttonLabel: "Choose plan",
    buttonHref: "#",
    featured: false,
  }, [
    { key: "title", label: "Title", type: "text" },
    { key: "price", label: "Price", type: "text" },
    { key: "period", label: "Period", type: "text" },
    { key: "features", label: "Features (one per line)", type: "textarea" },
    { key: "buttonLabel", label: "Button", type: "text" },
    { key: "buttonHref", label: "Button link", type: "url" },
    { key: "featured", label: "Featured", type: "toggle" },
  ], false),
  w("countdown", "Countdown", "fa-clock", "pro", {
    targetDate: "2026-12-31",
    title: "Coming soon",
  }, [
    { key: "title", label: "Title", type: "text" },
    { key: "targetDate", label: "Target date (YYYY-MM-DD)", type: "text" },
  ], false),
  w("flip-box", "Flip Box", "fa-rotate", "pro", {
    frontTitle: "Front",
    frontText: "Hover to flip",
    backTitle: "Back",
    backText: "Back side content",
    bgFront: "#0057ff",
    bgBack: "#0a1e5e",
  }, [
    { key: "frontTitle", label: "Front title", type: "text" },
    { key: "frontText", label: "Front text", type: "textarea" },
    { key: "backTitle", label: "Back title", type: "text" },
    { key: "backText", label: "Back text", type: "textarea" },
    { key: "bgFront", label: "Front background", type: "color" },
    { key: "bgBack", label: "Back background", type: "color" },
  ], false),
  w("animated-headline", "Animated Headline", "fa-font", "pro", {
    before: "We are",
    highlight: "Creative",
    after: "Agency",
    highlightColor: "#93003c",
  }, [
    { key: "before", label: "Before", type: "text" },
    { key: "highlight", label: "Highlighted", type: "text" },
    { key: "after", label: "After", type: "text" },
    { key: "highlightColor", label: "Highlight color", type: "color" },
  ]),
  w("google-maps", "Google Maps", "fa-map-location-dot", "pro", {
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.0!2d-73.98!3d40.75!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQ1JzAwLjAiTiA3M8KwNTgnNDguMCJX!5e0!3m2!1sen!2sus!4v1",
    height: "400px",
  }, [
    { key: "embedUrl", label: "Embed URL", type: "url" },
    { key: "height", label: "Height", type: "text" },
  ], false),
  w("form", "Form", "fa-wpforms", "pro", {
    title: "Contact us",
    submitLabel: "Send",
    fields: "name:Name:text\nemail:Email:email\nmessage:Message:textarea",
  }, [
    { key: "title", label: "Form title", type: "text" },
    { key: "submitLabel", label: "Submit button", type: "text" },
    {
      key: "fields",
      label: "Fields",
      type: "textarea",
      hint: "One per line: name:Label:type (text, email, textarea)",
    },
  ], false),

  // General
  w("html", "HTML", "fa-code", "general", { html: "<div>Custom HTML</div>" }, [
    { key: "html", label: "HTML", type: "textarea" },
  ], false),
  w("shortcode", "Shortcode", "fa-terminal", "general", { shortcode: "[your_shortcode]" }, [
    { key: "shortcode", label: "Shortcode", type: "text" },
  ], false),

  // Site
  w("site-logo", "Site Logo", "fa-building", "site", { url: "", alt: "Logo", width: "180px" }, [
    { key: "url", label: "Logo image", type: "media" },
    { key: "alt", label: "Alt text", type: "text" },
    { key: "width", label: "Width", type: "text" },
  ], false),
  w("search-form", "Search Form", "fa-magnifying-glass", "site", {
    placeholder: "Search…",
    action: "/search",
  }, [
    { key: "placeholder", label: "Placeholder", type: "text" },
    { key: "action", label: "Form action URL", type: "url" },
  ], false),
];

export function getWidgetDef(type: string): WidgetDef | undefined {
  return WIDGET_REGISTRY.find((w) => w.type === type);
}

export function createWidgetFromRegistry(type: string) {
  const def = getWidgetDef(type);
  if (!def) return createWidget(type);
  return createWidget(type, { ...def.defaultProps });
}

export const WIDGET_CATEGORIES: { id: WidgetCategory; label: string }[] = [
  { id: "layout", label: "Layout" },
  { id: "basic", label: "Basic" },
  { id: "media", label: "Media" },
  { id: "pro", label: "Pro" },
  { id: "general", label: "General" },
  { id: "site", label: "Site" },
];

export const FA_ICON_OPTIONS = [
  "fas fa-star",
  "fas fa-check",
  "fas fa-rocket",
  "fas fa-phone",
  "fas fa-envelope",
  "fas fa-location-dot",
  "fas fa-user",
  "fas fa-globe",
  "fas fa-chart-line",
  "fas fa-shield-halved",
  "fab fa-facebook",
  "fab fa-linkedin",
  "fab fa-x-twitter",
  "fab fa-instagram",
  "fab fa-youtube",
];
