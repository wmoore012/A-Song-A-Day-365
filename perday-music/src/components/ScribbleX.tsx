

export default function ScribbleX({
  width = 42,
  stroke = 7,
  className = "",
}: { width?: number; stroke?: number; className?: string }) {
  const w = width, h = width;
  return (
    <span className={`inline-block align-baseline ${className}`} aria-hidden>
      <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h}
           className="inline-block translate-y-1">
        <defs>
          {/* subtle marker fuzz */}
          <filter id="marker">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" result="noise"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.6"/>
            <feGaussianBlur stdDeviation="0.35"/>
          </filter>
        </defs>
        <g filter="url(#marker)" stroke="currentColor" strokeLinecap="round"
           strokeLinejoin="round" fill="none" strokeWidth={stroke}>
          <path d={`M 3 ${h-3} L ${w-3} 3`}>
            <animate attributeName="stroke-dasharray" from="0,200" to="200,0" dur="0.6s"
                     fill="freeze" begin="0s" />
          </path>
          <path d={`M 3 3 L ${w-3} ${h-3}`}>
            <animate attributeName="stroke-dasharray" from="0,200" to="200,0" dur="0.6s"
                     fill="freeze" begin="0.15s" />
          </path>
        </g>
      </svg>
    </span>
  );
}
