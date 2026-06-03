import { Reveal } from "@/components/ui/Reveal";
import {
  parseStoredContentStructure,
  sectionizePageHtml,
  type ProContentBlock,
  type ProContentSection,
  type ProContentStructure,
} from "@/lib/pages/sectionize-html";

function BlockView({ block }: { block: ProContentBlock }) {
  if (block.type === "figure") {
    return (
      <figure className="pro-page__figure">
        <div className="pro-page__figure-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={block.src} alt={block.alt || ""} className="pro-page__figure-img" loading="lazy" />
        </div>
        {block.caption ? <figcaption>{block.caption}</figcaption> : null}
      </figure>
    );
  }
  if (block.type === "icon-list") {
    return (
      <ul className="pro-page__icon-list">
        {block.items.map((item) => (
          <li key={item.text}>
            <i className={item.iconClass} aria-hidden="true" />
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    );
  }
  if (block.type === "cards") {
    return (
      <div className="pro-page__mini-grid">
        {block.items.map((card) => (
          <article key={card.title} className="pro-page__mini-card">
            <h4>{card.title}</h4>
            <div className="pro-page__prose" dangerouslySetInnerHTML={{ __html: card.html }} />
          </article>
        ))}
      </div>
    );
  }
  return <div className="pro-page__prose seo-rich-prose" dangerouslySetInnerHTML={{ __html: block.html }} />;
}

function SectionView({ section, index }: { section: ProContentSection; index: number }) {
  const hasMedia = section.blocks.some((b) => b.type === "figure");
  const textBlocks = section.blocks.filter((b) => b.type !== "figure");
  const mediaBlock = section.blocks.find((b) => b.type === "figure");

  return (
    <Reveal variant={index % 2 === 0 ? "fade-up" : "fade-in"} delay={index * 60}>
      <section
        className={`pro-page__section pro-page__section--${section.variant}${hasMedia ? " pro-page__section--split" : ""}`}
        id={section.id}
      >
        <div className="corp-container pro-page__section-inner">
          {section.eyebrow ? <span className="pro-page__eyebrow">{section.eyebrow}</span> : null}
          {section.title ? <h2 className="pro-page__section-title">{section.title}</h2> : null}
          <div className="pro-page__section-body">
            {hasMedia && mediaBlock && mediaBlock.type === "figure" ? (
              <>
                <div className="pro-page__section-media">
                  <BlockView block={mediaBlock} />
                </div>
                <div className="pro-page__section-copy">
                  {textBlocks.map((b, i) => (
                    <BlockView key={i} block={b} />
                  ))}
                </div>
              </>
            ) : (
              section.blocks.map((b, i) => <BlockView key={i} block={b} />)
            )}
          </div>
        </div>
      </section>
    </Reveal>
  );
}

export function ProSectionedContent({
  html,
  storedStructure,
  pageTitle,
  showPageTitle = false,
}: {
  html: string;
  storedStructure?: unknown;
  pageTitle?: string;
  showPageTitle?: boolean;
}) {
  const structure: ProContentStructure =
    parseStoredContentStructure(storedStructure) ?? sectionizePageHtml(html);

  if (!structure.sections.length) return null;

  return (
    <div className="pro-page">
      {showPageTitle && pageTitle ? (
        <div className="corp-container pro-page__title-wrap">
          <h1 className="pro-page__page-title">{pageTitle}</h1>
        </div>
      ) : null}
      {structure.sections.map((section, index) => (
        <SectionView key={section.id} section={section} index={index} />
      ))}
    </div>
  );
}
