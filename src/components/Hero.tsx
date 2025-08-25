import React from 'react';

export default function Hero() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-8">🎵 Perday Music 365</h1>
        <p className="text-xl text-cyan-300 mb-6">Lock-In is your lane. Hit Ready to power up.</p>

        <div className="space-y-4">
          <button className="px-8 py-4 bg-gradient-to-r from-magenta-500 to-cyan-400 text-white font-bold rounded-2xl text-lg hover:scale-105 transition-transform">
            ⚡ Ready — Celebrate the first step
          </button>

          <button className="px-8 py-4 border-2 border-cyan-400/60 text-cyan-300 rounded-2xl text-lg hover:bg-cyan-400/20 transition-colors">
            🚀 Start Now (Skip Pre-Start)
          </button>
        </div>
      </div>
    </div>
  );
}


