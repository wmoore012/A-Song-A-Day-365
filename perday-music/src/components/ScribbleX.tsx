

export default function ScribbleX({
  width = 44,
  stroke = 7,
  tiltDeg = -8,        // small tilt for "sports" vibe
  className = "",      // use Tailwind color here (e.g., "text-rose-500")
}: { width?: number; stroke?: number; tiltDeg?: number; className?: string }) {
  const w = width, h = width;
  return (
    <span
      className={`inline-block align-baseline ${className}`}
      style={{ transform: `rotate(${tiltDeg}deg)` }}
      aria-hidden
      role="presentation"
    >
      <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className="inline-block translate-y-1">
        <defs>
          {/* subtle marker fuzz */}
          <filter id="sx-marker" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" result="noise"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.6"/>
            <feGaussianBlur stdDeviation="0.35"/>
          </filter>
        </defs>
        <g filter="url(#sx-marker)" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" fill="none" strokeWidth={stroke}>
          {/* downstroke */}
          <path d={`M 3 ${h-3} L ${w-3} 3`}>
            <animate attributeName="stroke-dasharray" from="0,200" to="200,0" dur="0.55s" fill="freeze" begin="0s" />
          </path>
          {/* upstroke */}
          <path d={`M 3 3 L ${w-3} ${h-3}`}>
            <animate attributeName="stroke-dasharray" from="0,200" to="200,0" dur="0.55s" fill="freeze" begin="0.12s" />
          </path>
        </g>
      </svg>
    </span>
  );
}
