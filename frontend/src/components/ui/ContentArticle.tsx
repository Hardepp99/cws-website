import Image from "next/image";
import type { ReactNode } from "react";

export function ContentArticle({
  title,
  subtitle,
  meta,
  excerpt,
  image,
  imageAlt,
  variant = "page",
  children,
}: {
  title: string;
  subtitle?: string;
  meta?: ReactNode;
  excerpt?: string;
  image?: string;
  imageAlt?: string;
  variant?: "page" | "blog";
  children: ReactNode;
}) {
  return (
    <article className={`content-article content-article--${variant}`}>
      {image ? (
        <div className="content-article__hero">
          <Image
            src={image}
            alt={imageAlt || title}
            width={1200}
            height={630}
            className="content-article__hero-img"
            priority={variant === "blog"}
          />
        </div>
      ) : null}

      <header className="content-article__header">
        {meta ? <div className="content-article__meta">{meta}</div> : null}
        <h1 className="content-article__title">{title}</h1>
        {subtitle ? <p className="content-article__subtitle">{subtitle}</p> : null}
        {excerpt ? <p className="content-article__excerpt">{excerpt}</p> : null}
      </header>

      <div className="content-article__body">{children}</div>
    </article>
  );
}
