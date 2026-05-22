import Link from "next/link";

type Counts = { all: number; published: number; draft: number; trash: number };

const VIEWS: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "published", label: "Published" },
  { key: "draft", label: "Draft" },
  { key: "trash", label: "Trash" },
];

export function WpStatusViews({
  basePath,
  current,
  counts,
}: {
  basePath: string;
  current: string;
  counts: Counts;
}) {
  return (
    <ul className="subsubsub">
      {VIEWS.map((v, i) => {
        const n = counts[v.key as keyof Counts] ?? 0;
        const active = current === v.key;
        return (
          <li key={v.key}>
            {i > 0 ? <span className="sep"> |</span> : null}
            {active ? (
              <span className="current">
                {v.label} <span className="count">({n})</span>
              </span>
            ) : (
              <Link href={`${basePath}?status=${v.key}`}>
                {v.label} <span className="count">({n})</span>
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
