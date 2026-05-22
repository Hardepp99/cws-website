import Link from "next/link";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  breadcrumb?: Breadcrumb[];
}

/** Top bar: breadcrumb only (left). Page title belongs in content via PageContentTitle */
export function PageHeader({ breadcrumb = [] }: PageHeaderProps) {
  if (breadcrumb.length === 0) return null;

  return (
    <section className="page-header page-header--compact" aria-label="Breadcrumb">
      <div className="corp-container page-header-inner">
        <nav className="breadcrumb-nav" aria-label="Breadcrumb">
          <ol className="breadcrumb-list">
            {breadcrumb.map((item, i) => (
              <li key={`${item.label}-${i}`} className="breadcrumb-list-item">
                {i > 0 && (
                  <span className="breadcrumb-sep" aria-hidden="true">
                    /
                  </span>
                )}
                {item.href ? (
                  <Link href={item.href} className="breadcrumb-link">
                    {item.label}
                  </Link>
                ) : (
                  <span className="breadcrumb-current" aria-current="page">
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </section>
  );
}
