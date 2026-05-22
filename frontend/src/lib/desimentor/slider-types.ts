export type DesimentorSlideItem = {
  bgImage?: string;
  bgImageTablet?: string;
  bgImageMobile?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  buttonLabel?: string;
  buttonHref?: string;
  overlayOpacity?: string;
  contentAlign?: "left" | "center" | "right";
  textColor?: string;
};

export type DesimentorSliderProps = {
  slides?: DesimentorSlideItem[];
  activeSlideIndex?: number;
  autoplay?: boolean;
  interval?: number;
  effect?: "fade" | "slide";
  loop?: boolean;
  showArrows?: boolean;
  showPagination?: boolean;
  heightDesktop?: string;
  heightTablet?: string;
  heightMobile?: string;
};

export function parseSlides(v: unknown): DesimentorSlideItem[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x) => x && typeof x === "object") as DesimentorSlideItem[];
}

export function defaultSlides(): DesimentorSlideItem[] {
  return [
    {
      title: "Slide 1 headline",
      subtitle: "Eyebrow text",
      description: "Edit this text directly on the canvas. Add a background image in the sidebar.",
      buttonLabel: "Learn more",
      buttonHref: "#",
      overlayOpacity: "0.5",
      contentAlign: "center",
      textColor: "#ffffff",
    },
    {
      title: "Slide 2 headline",
      subtitle: "Second slide",
      description: "Drag slides widget, switch devices, and set heights per breakpoint.",
      buttonLabel: "Contact us",
      buttonHref: "/contact",
      overlayOpacity: "0.45",
      contentAlign: "left",
      textColor: "#ffffff",
    },
  ];
}

export function slideBgForDevice(
  slide: DesimentorSlideItem,
  device: "desktop" | "tablet" | "mobile"
): string {
  if (device === "mobile" && slide.bgImageMobile) return slide.bgImageMobile;
  if (device === "tablet" && slide.bgImageTablet) return slide.bgImageTablet;
  if (device === "tablet" && slide.bgImageMobile && !slide.bgImageTablet) return slide.bgImageMobile;
  return slide.bgImage || "";
}
