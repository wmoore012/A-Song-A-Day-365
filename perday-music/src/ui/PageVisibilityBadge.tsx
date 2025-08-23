import { useEffect, useState } from "react";

export default function PageVisibilityBadge() {
  const [hidden, setHidden] = useState(document.hidden);
  useEffect(() => {
    const onVis = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);
  if (!hidden) return null;
  return (
    <div 
      className="fixed top-3 right-3 z-50 px-3 py-1.5 rounded-md text-xs font-bold bg-amber-500/90 text-black shadow"
      data-testid="page-visibility-badge"
      role="alert"
    >
      Tab hidden — we're paused (no auto-fail)
    </div>
  );
}
