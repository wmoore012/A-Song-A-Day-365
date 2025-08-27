export default function SpinningLogo() {
  return (
    <a href="/features" aria-label="Go to Features" className="inline-block">
      <div
        className="relative grid place-items-center select-none"
        style={{ width: 56, height: 56 }}
      >
        {/* Handwritten X with Permanent Marker font */}
        <div 
          className="relative z-10 text-white"
          style={{
            fontFamily: '"Permanent Marker", cursive',
            fontSize: '48px',
            lineHeight: 1,
            textShadow: '0 0 10px rgba(255,255,255,0.3)',
            filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.2))'
          }}
        >
          X
        </div>
        <div 
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-20"
          style={{
            width: '45px',
            height: '3px',
            background: 'linear-gradient(90deg, #ff4444, #ff6666, #ff4444)',
            borderRadius: '2px',
            boxShadow: '0 0 8px rgba(255,68,68,0.6)'
          }}
        />
      </div>
    </a>
  );
}
