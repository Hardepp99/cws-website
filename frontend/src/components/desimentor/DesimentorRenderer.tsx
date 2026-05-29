"use client";

import { stylesToCss, scopedClass } from "@/lib/desimentor/apply-styles";
import type { DesimentorDocument } from "@/lib/desimentor/types";
import { Reveal, type RevealVariant } from "@/components/ui/Reveal";
import { DesimentorWidgetView } from "./DesimentorWidgetView";

const SECTION_VARIANTS: RevealVariant[] = ["fade-up", "fade-in", "fade-up", "fade-in"];

function sectionVariant(index: number): RevealVariant {
  return SECTION_VARIANTS[index % SECTION_VARIANTS.length];
}

/** Cap stagger so long pages do not feel sluggish */
function sectionDelay(index: number): number {
  return Math.min(index * 24, 96);
}

export function DesimentorRenderer({ document }: { document: DesimentorDocument }) {
  if (!document?.sections?.length) return null;

  return (
    <div className="desimentor-output desimentor-output--animated">
      {document.sections.map((section, index) => {
        const secCls = scopedClass(section.id);
        const secStyle = stylesToCss(section.settings);
        const secCustom = section.settings?.customCss;
        const colCount = section.columns.length;
        const rowClass =
          colCount <= 2
            ? `desimentor-row desimentor-row--split desimentor-row--${colCount}`
            : `desimentor-row desimentor-row--grid desimentor-row--${Math.min(colCount, 6)}`;

        return (
          <Reveal
            key={section.id}
            variant={sectionVariant(index)}
            delay={sectionDelay(index)}
            trigger={index < 2 ? "load" : "scroll"}
            className="desimentor-section-reveal"
          >
            <section className={`desimentor-section ${secCls}`} style={secStyle}>
              {secCustom ? <style dangerouslySetInnerHTML={{ __html: `.${secCls}{${secCustom}}` }} /> : null}
              <div className="corp-container desimentor-section-inner">
                <div className={rowClass}>
                  {section.columns.map((col) => {
                    const useSplit = colCount <= 2;
                    return (
                      <div
                        key={col.id}
                        className={`desimentor-col ${scopedClass(col.id)}`}
                        style={{
                          ...stylesToCss(col.styles),
                          ...(useSplit
                            ? {
                                flex: `1 1 ${col.width}%`,
                                maxWidth: `${col.width}%`,
                              }
                            : {}),
                        }}
                      >
                        {col.widgets.map((w) => (
                          <DesimentorWidgetView key={w.id} widget={w} />
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </Reveal>
        );
      })}
    </div>
  );
}
