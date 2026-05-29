/** Colorful hero illustration — person building a website (inline SVG). */
export function HeroWebBuilderIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`hero-web-builder-illus ${className}`.trim()}
      viewBox="0 0 420 500"
      role="img"
      aria-label="Designer building a modern website on laptop"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="heroBlob" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E8F4FF" />
          <stop offset="45%" stopColor="#F3E8FF" />
          <stop offset="100%" stopColor="#FFF4E8" />
        </linearGradient>
        <linearGradient id="heroShirt" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0071E3" />
          <stop offset="100%" stopColor="#5856D6" />
        </linearGradient>
        <linearGradient id="heroScreen" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1D1D1F" />
          <stop offset="100%" stopColor="#2C2C2E" />
        </linearGradient>
        <linearGradient id="heroCardA" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B9D" />
          <stop offset="100%" stopColor="#FF8A5C" />
        </linearGradient>
        <linearGradient id="heroCardB" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34C759" />
          <stop offset="100%" stopColor="#30D158" />
        </linearGradient>
        <linearGradient id="heroCardC" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5AC8FA" />
          <stop offset="100%" stopColor="#007AFF" />
        </linearGradient>
        <filter id="heroSoftShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000" floodOpacity="0.12" />
        </filter>
      </defs>

      {/* Background blob */}
      <ellipse cx="210" cy="260" rx="185" ry="200" fill="url(#heroBlob)" opacity="0.95" />

      {/* Floating UI cards */}
      <g className="hero-web-builder-illus__float hero-web-builder-illus__float--a" filter="url(#heroSoftShadow)">
        <rect x="28" y="72" width="88" height="64" rx="14" fill="#fff" />
        <rect x="40" y="86" width="48" height="8" rx="4" fill="url(#heroCardA)" />
        <rect x="40" y="100" width="64" height="6" rx="3" fill="#E8E8ED" />
        <rect x="40" y="112" width="52" height="6" rx="3" fill="#E8E8ED" />
        <circle cx="98" cy="118" r="10" fill="url(#heroCardB)" />
      </g>

      <g className="hero-web-builder-illus__float hero-web-builder-illus__float--b" filter="url(#heroSoftShadow)">
        <rect x="300" y="48" width="96" height="78" rx="16" fill="#fff" />
        <rect x="312" y="62" width="72" height="40" rx="8" fill="url(#heroCardC)" opacity="0.25" />
        <rect x="312" y="62" width="72" height="10" rx="4" fill="url(#heroCardC)" />
        <rect x="312" y="78" width="56" height="6" rx="3" fill="#D2D2D7" />
        <rect x="312" y="90" width="40" height="6" rx="3" fill="#D2D2D7" />
        <path d="M312 108h72v4H312z" fill="#34C759" opacity="0.5" />
      </g>

      <g className="hero-web-builder-illus__float hero-web-builder-illus__float--c" filter="url(#heroSoftShadow)">
        <rect x="318" y="168" width="72" height="52" rx="12" fill="#1D1D1F" />
        <text x="332" y="192" fill="#30D158" fontFamily="ui-monospace, monospace" fontSize="11" fontWeight="600">
          {"</>"}
        </text>
        <rect x="332" y="200" width="44" height="4" rx="2" fill="#FF9F0A" />
        <rect x="332" y="208" width="32" height="4" rx="2" fill="#64D2FF" />
      </g>

      {/* Sparkles */}
      <circle className="hero-web-builder-illus__spark" cx="72" cy="200" r="5" fill="#FFD60A" />
      <circle className="hero-web-builder-illus__spark hero-web-builder-illus__spark--b" cx="350" cy="280" r="4" fill="#BF5AF2" />
      <path
        className="hero-web-builder-illus__spark hero-web-builder-illus__spark--c"
        d="M48 320l6 12 12 6-12 6-6 12-6-12-12-6 12-6z"
        fill="#FF375F"
        opacity="0.85"
      />

      {/* Desk */}
      <rect x="68" y="368" width="284" height="14" rx="7" fill="#C7C7CC" />
      <rect x="88" y="378" width="8" height="48" rx="4" fill="#AEAEB2" />
      <rect x="324" y="378" width="8" height="48" rx="4" fill="#AEAEB2" />

      {/* Laptop */}
      <g filter="url(#heroSoftShadow)">
        <path d="M118 318h184v108a12 12 0 0 1-12 12H130a12 12 0 0 1-12-12V318z" fill="#8E8E93" />
        <rect x="126" y="298" width="168" height="108" rx="10" fill="url(#heroScreen)" />
        {/* Browser chrome */}
        <circle cx="142" cy="312" r="4" fill="#FF5F57" />
        <circle cx="156" cy="312" r="4" fill="#FFBD2E" />
        <circle cx="170" cy="312" r="4" fill="#28CA42" />
        <rect x="182" y="308" width="96" height="8" rx="4" fill="#3A3A3C" />
        {/* Website mockup on screen */}
        <rect x="136" y="328" width="148" height="18" rx="6" fill="url(#heroCardA)" opacity="0.9" />
        <rect x="136" y="352" width="68" height="40" rx="6" fill="#48484A" />
        <rect x="212" y="352" width="72" height="18" rx="4" fill="#636366" />
        <rect x="212" y="376" width="72" height="16" rx="4" fill="#48484A" />
        <rect x="136" y="398" width="148" height="6" rx="3" fill="#0071E3" />
        <path d="M118 418h184l-16 10H134l-16-10z" fill="#AEAEB2" />
      </g>

      {/* Person */}
      <g className="hero-web-builder-illus__person">
        {/* Chair back */}
        <ellipse cx="210" cy="355" rx="52" ry="18" fill="#D1D1D6" />
        {/* Body */}
        <path
          d="M168 340c8-42 76-42 84 0v58c0 12-10 22-22 22h-40c-12 0-22-10-22-22V340z"
          fill="url(#heroShirt)"
        />
        {/* Arms */}
        <path
          d="M158 328c-14 8-18 28-8 40 6 8 18 4 22-6 4-10-2-28-14-34z"
          fill="#2997FF"
          opacity="0.95"
        />
        <path
          d="M262 328c14 8 18 28 8 40-6 8-18 4-22-6-4-10 2-28 14-34z"
          fill="#2997FF"
          opacity="0.95"
        />
        {/* Neck */}
        <rect x="198" y="268" width="24" height="22" rx="8" fill="#F5C49A" />
        {/* Head */}
        <ellipse cx="210" cy="248" rx="38" ry="42" fill="#F5C49A" />
        {/* Hair */}
        <path
          d="M176 248c4-36 68-36 68 0 4 18-8 28-22 30-6 1-12 0-18-4-14-2-28-12-24-26z"
          fill="#2C1810"
        />
        {/* Face */}
        <ellipse cx="196" cy="252" rx="4" ry="5" fill="#1D1D1F" />
        <ellipse cx="224" cy="252" rx="4" ry="5" fill="#1D1D1F" />
        <path d="M202 268c8 6 16 6 24 0" stroke="#C68642" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* Glasses accent */}
        <rect x="186" y="246" width="20" height="12" rx="6" fill="none" stroke="#5856D6" strokeWidth="2" />
        <rect x="214" y="246" width="20" height="12" rx="6" fill="none" stroke="#5856D6" strokeWidth="2" />
        <path d="M206 252h8" stroke="#5856D6" strokeWidth="2" />
      </g>

      {/* Tablet / phone floating */}
      <g className="hero-web-builder-illus__float hero-web-builder-illus__float--d" filter="url(#heroSoftShadow)">
        <rect x="52" y="268" width="44" height="72" rx="10" fill="#1D1D1F" />
        <rect x="58" y="278" width="32" height="48" rx="4" fill="url(#heroCardB)" opacity="0.35" />
        <rect x="58" y="278" width="32" height="10" rx="3" fill="#fff" opacity="0.9" />
        <circle cx="74" cy="332" r="4" fill="#636366" />
      </g>
    </svg>
  );
}
