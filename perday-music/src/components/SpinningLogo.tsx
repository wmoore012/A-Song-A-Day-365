import { Link } from "react-router-dom";

export default function SpinningLogo() {
  return (
    <Link to="/features" aria-label="Go to Features" className="inline-block">
      <div
        className="relative grid place-items-center select-none"
        style={{ width: 56, height: 56 }}
      >
        {/* Spinning logo */}
        <svg viewBox="0 0 100 100" className="animate-[spin_16s_linear_infinite] drop-shadow-md">
          <circle cx="50" cy="50" r="44" fill="none" stroke="white" strokeWidth="2" />
          <path d="M 30 30 L 70 70 M 30 70 L 70 30" stroke="white" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    </Link>
  );
}
