/** Small animated info accent for item cards. */
export function HomeItemInfoSvg({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`home-item-info-svg ${className}`.trim()}
      viewBox="0 0 20 20"
      width={18}
      height={18}
      aria-hidden="true"
    >
      <circle className="home-item-info-svg__pulse" cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="10" cy="10" r="7" fill="currentColor" opacity="0.12" />
      <text x="10" y="14.5" textAnchor="middle" fontSize="11" fontWeight="700" fill="currentColor">
        i
      </text>
    </svg>
  );
}
