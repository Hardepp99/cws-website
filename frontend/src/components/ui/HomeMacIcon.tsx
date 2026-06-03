import { resolveMacTone, type MacTone } from "@/lib/homepage/mac-tones";

type HomeMacIconSize = "sm" | "md" | "lg";

interface HomeMacIconProps {
  icon: string;
  tone?: string;
  index?: number;
  size?: HomeMacIconSize;
  className?: string;
}

export function HomeMacIcon({
  icon,
  tone,
  index = 0,
  size = "md",
  className = "",
}: HomeMacIconProps) {
  const resolved: MacTone = resolveMacTone(tone, index);

  return (
    <span
      className={`home-mac-icon home-mac-icon--${size} home-mac-icon--${resolved}${className ? ` ${className}` : ""}`}
      data-tone={resolved}
      aria-hidden="true"
    >
      <span className="home-mac-icon__ring" />
      <span className="home-mac-icon__glyph">
        <i className={icon} />
      </span>
    </span>
  );
}
