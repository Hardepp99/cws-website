interface DigitalBackgroundProps {
  idPrefix: string;
  className?: string;
  viewBox?: string;
}

export function DigitalBackground({
  idPrefix,
  className = "digital-bg",
  viewBox = "0 0 1440 48",
}: DigitalBackgroundProps) {
  const base = `${idPrefix}-base`;
  const glow = `${idPrefix}-glow`;
  const grid = `${idPrefix}-grid`;
  const dots = `${idPrefix}-dots`;
  const dotsAlt = `${idPrefix}-dots-alt`;
  const blur = `${idPrefix}-blur`;

  return (
    <div className={className} aria-hidden="true">
      <svg
        className="digital-bg-svg"
        viewBox={viewBox}
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={base} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#071540" />
            <stop offset="45%" stopColor="#0A1E5E" />
            <stop offset="100%" stopColor="#051030" />
          </linearGradient>

          <linearGradient id={glow} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0088FF" stopOpacity="0" />
            <stop offset="50%" stopColor="#0057FF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0088FF" stopOpacity="0" />
          </linearGradient>

          <pattern id={grid} width="24" height="24" patternUnits="userSpaceOnUse">
            <path
              d="M 24 0 L 0 0 0 24"
              fill="none"
              stroke="rgba(0,136,255,0.14)"
              strokeWidth="0.5"
            />
          </pattern>

          <pattern id={dots} width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.9" fill="rgba(255,255,255,0.14)" />
          </pattern>

          <pattern id={dotsAlt} width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="1" fill="rgba(0,87,255,0.24)" />
          </pattern>

          <filter id={blur} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        <rect width="100%" height="100%" fill={`url(#${base})`} />

        <rect className="digital-bg-grid" width="100%" height="100%" fill={`url(#${grid})`} />
        <rect className="digital-bg-dots" width="100%" height="100%" fill={`url(#${dots})`} opacity="0.85" />
        <rect
          className="digital-bg-dots-alt"
          width="55%"
          height="100%"
          x="45%"
          fill={`url(#${dotsAlt})`}
          opacity="0.5"
        />

        <g className="digital-bg-shapes" filter={`url(#${blur})`} opacity="0.55">
          <circle className="digital-shape digital-shape--1" cx="120" cy="24" r="28" fill="#0057FF" />
          <circle className="digital-shape digital-shape--2" cx="980" cy="8" r="22" fill="#0088FF" />
          <ellipse className="digital-shape digital-shape--3" cx="640" cy="40" rx="36" ry="14" fill="#00A86B" />
          {viewBox !== "0 0 1440 48" ? (
            <>
              <circle className="digital-shape digital-shape--4" cx="280" cy="180" r="36" fill="#0057FF" />
              <circle className="digital-shape digital-shape--5" cx="1100" cy="220" r="30" fill="#0088FF" />
              <ellipse className="digital-shape digital-shape--6" cx="720" cy="280" rx="48" ry="18" fill="#00A86B" />
            </>
          ) : null}
        </g>

        <g className="digital-bg-lines" strokeLinecap="round">
          <line className="digital-line digital-line--1" x1="0" y1="12" x2="180" y2="12" stroke={`url(#${glow})`} strokeWidth="1.5" />
          <line className="digital-line digital-line--2" x1="260" y1="36" x2="520" y2="36" stroke={`url(#${glow})`} strokeWidth="1.2" />
          <line className="digital-line digital-line--3" x1="760" y1="18" x2="1100" y2="18" stroke={`url(#${glow})`} strokeWidth="1.4" />
          {viewBox !== "0 0 1440 48" ? (
            <>
              <line className="digital-line digital-line--4" x1="80" y1="140" x2="420" y2="140" stroke={`url(#${glow})`} strokeWidth="1.3" />
              <line className="digital-line digital-line--5" x1="600" y1="240" x2="980" y2="240" stroke={`url(#${glow})`} strokeWidth="1.2" />
            </>
          ) : null}
        </g>

        <g className="digital-bg-nodes" fill="none" stroke="rgba(0,136,255,0.38)" strokeWidth="0.75">
          <path className="digital-node digital-node--1" d="M 420 24 L 470 24 L 495 10 L 520 24 L 570 24" />
          <path className="digital-node digital-node--2" d="M 1180 30 L 1210 14 L 1240 30 L 1270 14 L 1300 30" />
          {viewBox !== "0 0 1440 48" ? (
            <path className="digital-node digital-node--3" d="M 200 200 L 250 200 L 275 186 L 300 200 L 350 200" />
          ) : null}
          <circle className="digital-node-dot digital-node-dot--1" cx="470" cy="24" r="2.5" fill="#0057FF" stroke="none" />
          <circle className="digital-node-dot digital-node-dot--2" cx="520" cy="24" r="2.5" fill="#00A86B" stroke="none" />
          <circle className="digital-node-dot digital-node-dot--3" cx="1210" cy="14" r="2.5" fill="#0088FF" stroke="none" />
          <circle className="digital-node-dot digital-node-dot--4" cx="1270" cy="14" r="2.5" fill="#FF8C1A" stroke="none" />
        </g>

        <rect className="digital-bg-scan" y="0" width="120" height="100%" fill={`url(#${glow})`} opacity="0.25" />
      </svg>
    </div>
  );
}
