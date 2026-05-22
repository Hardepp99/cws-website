"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import {
  parseSlides,
  slideBgForDevice,
  type DesimentorSlideItem,
  type DesimentorSliderProps as SliderPropsData,
} from "@/lib/desimentor/slider-types";
import type { EditorDevice } from "@/lib/desimentor/store";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

type Props = {
  widgetId: string;
  props: Record<string, unknown>;
  editable?: boolean;
  device?: EditorDevice;
  onPropChange?: (key: string, value: unknown) => void;
  onSlideFieldChange?: (slideIndex: number, field: keyof DesimentorSlideItem, value: string) => void;
};

function sliderHeight(data: SliderPropsData, device: EditorDevice) {
  if (device === "mobile") return data.heightMobile || "360px";
  if (device === "tablet") return data.heightTablet || "480px";
  return data.heightDesktop || "560px";
}

function inlineText(
  editable: boolean,
  value: string,
  onChange: (v: string) => void,
  Tag: keyof JSX.IntrinsicElements = "span",
  className = ""
) {
  if (!editable) {
    const El = Tag;
    return <El className={className}>{value}</El>;
  }
  return (
    <Tag
      className={`desimentor-inline-edit ${className}`.trim()}
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => onChange(e.currentTarget.textContent ?? "")}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      {value}
    </Tag>
  );
}

export function DesimentorSlider({
  widgetId,
  props: raw,
  editable = false,
  device = "desktop",
  onPropChange,
  onSlideFieldChange,
}: Props) {
  const slides = parseSlides(raw.slides);
  const data: SliderPropsData = {
    slides,
    activeSlideIndex: Number(raw.activeSlideIndex) || 0,
    autoplay: raw.autoplay !== false,
    interval: Number(raw.interval) || 6,
    effect: (raw.effect as "fade" | "slide") || "fade",
    loop: raw.loop !== false,
    showArrows: raw.showArrows !== false,
    showPagination: raw.showPagination !== false,
    heightDesktop: String(raw.heightDesktop ?? "560px"),
    heightTablet: String(raw.heightTablet ?? "480px"),
    heightMobile: String(raw.heightMobile ?? "360px"),
  };

  const swiperRef = useRef<SwiperType | null>(null);
  const activeIdx = Math.min(Math.max(0, data.activeSlideIndex ?? 0), Math.max(0, slides.length - 1));
  const [current, setCurrent] = useState(activeIdx);
  const height = sliderHeight(data, device);
  const uid = widgetId.replace(/[^a-zA-Z0-9]/g, "");

  useEffect(() => {
    if (editable && swiperRef.current && swiperRef.current.activeIndex !== activeIdx) {
      swiperRef.current.slideTo(activeIdx, 0);
    }
    setCurrent(activeIdx);
  }, [activeIdx, editable]);

  function updateSlide(i: number, field: keyof DesimentorSlideItem, value: string) {
    onSlideFieldChange?.(i, field, value);
  }

  function goTo(i: number) {
    setCurrent(i);
    onPropChange?.("activeSlideIndex", i);
    swiperRef.current?.slideTo(i);
  }

  if (!slides.length) {
    return (
      <div className="dsmt-slider dsmt-slider--empty" style={{ minHeight: height }}>
        <p>Add slides in the sidebar or click + below</p>
      </div>
    );
  }

  const modules = [Pagination, Navigation];
  if (data.effect === "fade") modules.push(EffectFade);
  if (data.autoplay && !editable) {
    modules.push(Autoplay);
  }

  const rootStyle = {
    "--dsmt-h-desktop": data.heightDesktop,
    "--dsmt-h-tablet": data.heightTablet,
    "--dsmt-h-mobile": data.heightMobile,
    ...(editable ? { "--dsmt-slider-height": height } : {}),
  } as React.CSSProperties;

  return (
    <div
      className={`dsmt-slider dsmt-slider--${device}${editable ? " is-editing" : ""}`}
      style={rootStyle}
      data-widget-id={widgetId}
    >
      {editable ? (
        <div className="dsmt-slider-edit-bar" onClick={(e) => e.stopPropagation()}>
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              className={i === current ? "active" : ""}
              onClick={() => goTo(i)}
            >
              Slide {i + 1}
            </button>
          ))}
        </div>
      ) : null}

      <Swiper
        modules={modules}
        effect={data.effect === "fade" ? "fade" : undefined}
        loop={data.loop && slides.length > 1 && !editable}
        speed={editable ? 0 : 600}
        autoplay={
          data.autoplay && !editable && slides.length > 1
            ? { delay: Math.max(2, data.interval!) * 1000, disableOnInteraction: false }
            : false
        }
        navigation={
          data.showArrows && slides.length > 1
            ? {
                nextEl: `.dsmt-slider-next-${uid}`,
                prevEl: `.dsmt-slider-prev-${uid}`,
              }
            : false
        }
        pagination={
          data.showPagination && slides.length > 1
            ? { clickable: true, el: `.dsmt-slider-pagination-${uid}` }
            : false
        }
        onSwiper={(sw) => {
          swiperRef.current = sw;
          if (editable) sw.slideTo(activeIdx, 0);
        }}
        onSlideChange={(sw) => {
          const idx = sw.realIndex;
          setCurrent(idx);
          if (editable) onPropChange?.("activeSlideIndex", idx);
        }}
        className="dsmt-slider-swiper"
      >
        {slides.map((slide, i) => {
          const bg = slideBgForDevice(slide, device);
          const alignRaw = String(slide.contentAlign || "center").toLowerCase();
          const align =
            alignRaw === "left" || alignRaw === "right" ? alignRaw : "center";
          const overlay = slide.overlayOpacity ?? "0.45";
          const color = slide.textColor || "#fff";

          return (
            <SwiperSlide key={i}>
              <div className="dsmt-slider-slide" style={{ minHeight: height }}>
                <div
                  className="dsmt-slider-slide-bg"
                  style={{
                    backgroundImage: bg ? `url(${bg})` : undefined,
                    backgroundColor: bg ? undefined : "#1a2b4a",
                  }}
                />
                <div
                  className="dsmt-slider-slide-overlay"
                  style={{ backgroundColor: `rgba(0,0,0,${overlay})` }}
                />
                <div className={`dsmt-slider-slide-content align-${align}`} style={{ color }}>
                  {slide.subtitle ? (
                    <p className="dsmt-slider-subtitle">
                      {inlineText(editable && i === current, String(slide.subtitle), (v) =>
                        updateSlide(i, "subtitle", v)
                      )}
                    </p>
                  ) : null}
                  <h2 className="dsmt-slider-title">
                    {inlineText(
                      editable && i === current,
                      String(slide.title || "Slide title"),
                      (v) => updateSlide(i, "title", v),
                      "span"
                    )}
                  </h2>
                  {slide.description ? (
                    <p className="dsmt-slider-desc">
                      {inlineText(editable && i === current, String(slide.description), (v) =>
                        updateSlide(i, "description", v)
                      )}
                    </p>
                  ) : null}
                  {slide.buttonLabel ? (
                    editable && i === current ? (
                      <span
                        className="btn btn-primary-custom desimentor-inline-edit dsmt-slider-btn"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => updateSlide(i, "buttonLabel", e.currentTarget.textContent ?? "")}
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        {slide.buttonLabel}
                      </span>
                    ) : (
                      <Link href={slide.buttonHref || "#"} className="btn btn-primary-custom dsmt-slider-btn">
                        {slide.buttonLabel}
                      </Link>
                    )
                  ) : null}
                  {editable && i === current && !bg ? (
                    <p className="dsmt-slider-bg-hint">Set background image in sidebar → Slide background</p>
                  ) : null}
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {data.showArrows && slides.length > 1 ? (
        <>
          <button type="button" className={`dsmt-slider-arrow prev dsmt-slider-prev-${uid}`} aria-label="Previous" />
          <button type="button" className={`dsmt-slider-arrow next dsmt-slider-next-${uid}`} aria-label="Next" />
        </>
      ) : null}
      {data.showPagination && slides.length > 1 ? (
        <div className={`dsmt-slider-pagination dsmt-slider-pagination-${uid}`} />
      ) : null}
    </div>
  );
}
