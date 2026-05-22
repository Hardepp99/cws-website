import Link from "next/link";
import { countItemsByStatus, getRepeaterItems, getSectionRepeaters } from "./section-repeaters";
import type { SectionRecord } from "./SectionEditor";
import { layoutLabel } from "./layouts";

export function SectionRepeaterNav({
  sectionId,
  section,
}: {
  sectionId: number;
  section: SectionRecord;
}) {
  const layout = String(section.acfFcLayout ?? "");
  const repeaters = getSectionRepeaters(layout);
  if (repeaters.length === 0) return null;

  return (
    <div className="section-repeater-nav">
      <h2 className="section-repeater-nav__title">Lists in this section</h2>
      <p className="cms-field-hint">
        {layoutLabel(layout)} — edit each {repeaters.length === 1 ? "item" : "list"} one at a time (add, draft, publish, trash).
      </p>
      <ul className="section-repeater-nav__list">
        {repeaters.map((rep) => {
          const items = getRepeaterItems(section, rep.key);
          const counts = countItemsByStatus(items);
          const href = `/admin/homepage/${sectionId}/items?key=${encodeURIComponent(rep.key)}`;
          return (
            <li key={rep.key}>
              <Link href={href} className="section-repeater-nav__card">
                <strong>{rep.label}</strong>
                <span className="section-repeater-nav__counts">
                  {counts.published} published · {counts.draft} draft
                  {counts.trash > 0 ? ` · ${counts.trash} trash` : ""}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
