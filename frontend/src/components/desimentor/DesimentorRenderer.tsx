"use client";

import { stylesToCss, scopedClass } from "@/lib/desimentor/apply-styles";
import type { DesimentorDocument } from "@/lib/desimentor/types";
import { DesimentorWidgetView } from "./DesimentorWidgetView";

export function DesimentorRenderer({ document }: { document: DesimentorDocument }) {
  if (!document?.sections?.length) return null;

  return (
    <div className="desimentor-output">
      {document.sections.map((section) => {
        const secCls = scopedClass(section.id);
        const secStyle = stylesToCss(section.settings);
        const secCustom = section.settings?.customCss;
        return (
          <section key={section.id} className={`desimentor-section ${secCls}`} style={secStyle}>
            {secCustom ? <style dangerouslySetInnerHTML={{ __html: `.${secCls}{${secCustom}}` }} /> : null}
            <div className="corp-container desimentor-section-inner">
              <div className="desimentor-row">
                {section.columns.map((col) => (
                  <div
                    key={col.id}
                    className={`desimentor-col ${scopedClass(col.id)}`}
                    style={{
                      ...stylesToCss(col.styles),
                      flex: `0 0 ${col.width}%`,
                      maxWidth: `${col.width}%`,
                    }}
                  >
                    {col.widgets.map((w) => (
                      <DesimentorWidgetView key={w.id} widget={w} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
