import type { ImageUploadGuide as Guide } from "@/lib/admin/image-upload-guides";

export function ImageUploadGuide({
  guide,
  compact = false,
  className = "",
}: {
  guide: Guide;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      className={["image-upload-guide", compact ? "image-upload-guide--compact" : "", className]
        .filter(Boolean)
        .join(" ")}
      role="note"
    >
      {guide.title ? <p className="image-upload-guide__title">{guide.title}</p> : null}
      <ul className="image-upload-guide__list">
        <li>
          <span className="image-upload-guide__label">Ratio</span>
          <span>{guide.ratio}</span>
        </li>
        <li>
          <span className="image-upload-guide__label">Recommended</span>
          <span>{guide.recommended}</span>
        </li>
        {guide.minSize ? (
          <li>
            <span className="image-upload-guide__label">Minimum</span>
            <span>{guide.minSize}</span>
          </li>
        ) : null}
        <li>
          <span className="image-upload-guide__label">Max size</span>
          <span>{guide.maxFileSize}</span>
        </li>
        <li>
          <span className="image-upload-guide__label">Formats</span>
          <span>{guide.formats}</span>
        </li>
      </ul>
      {guide.tips ? <p className="image-upload-guide__tips">{guide.tips}</p> : null}
    </div>
  );
}
