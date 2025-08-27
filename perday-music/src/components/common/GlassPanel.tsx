import React from "react";
import { cn } from "../../lib/utils";

export type GlassPanelProps = React.HTMLAttributes<HTMLDivElement>

export default function GlassPanel({ children, className, ...props }: GlassPanelProps) {
  return (
    <div
      className={cn(
        "bg-black/20 backdrop-blur-xl ring-1 ring-cyan-400/30 rounded-2xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
