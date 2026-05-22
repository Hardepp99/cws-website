interface PageContentTitleProps {
  title: string;
  subtitle?: string;
}

/** Centered page heading — use inside the main content section, not in PageHeader */
export function PageContentTitle({ title, subtitle }: PageContentTitleProps) {
  return (
    <header className="page-content-title">
      <h1 className="page-content-title__heading">{title}</h1>
      {subtitle ? <p className="page-content-title__subtitle">{subtitle}</p> : null}
    </header>
  );
}
