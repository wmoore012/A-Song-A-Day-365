import React from "react";
import { cn } from "@/lib/utils";

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "subtle";
}

export default function GlassPanel({ 
  children, 
  className, 
  variant = "default",
  ...props 
}: GlassPanelProps) {
  const baseClasses = "backdrop-blur-md border border-white/10 rounded-2xl";
  
  const variants = {
    default: "bg-white/5 shadow-lg shadow-black/20",
    elevated: "bg-white/10 shadow-xl shadow-black/30",
    subtle: "bg-white/3 shadow-sm shadow-black/10"
  };

  return (
    <div 
      className={cn(
        baseClasses,
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
