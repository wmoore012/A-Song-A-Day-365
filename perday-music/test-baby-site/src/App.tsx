import React from "react";
export default function App() {
  return (
    <div className="min-h-full grid place-items-center">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold">Test Baby Site</h1>
        <p className="text-white/70 mt-2">Step 1: Tailwind v4 OK</p>
        <button 
          onClick={() => alert("Tailwind v4 works!")}
          className="mt-4 px-4 py-2 rounded-xl bg-[var(--brand-accent1)] font-bold hover:bg-[#8e77ff] transition-colors cursor-pointer"
        >
          Click me
        </button>
      </div>
    </div>
  )
}
