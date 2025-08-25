"use client"

import { motion } from "framer-motion"

export default function PulsingCircle() {
  return (
    <div className="absolute bottom-8 right-8 z-30">
      <div className="relative w-20 h-20 flex items-center justify-center">
        {/* Pulsing Border Circle */}
        <div
          className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-pulse"
          style={{
            animation: 'pulse 2s infinite',
            boxShadow: '0 0 20px rgba(34, 211, 238, 0.5)'
          }}
        />

        {/* Rotating Text Around the Pulsing Border */}
        <motion.svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          animate={{ rotate: 360 }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          style={{ transform: "scale(1.6)" }}
        >
          <defs>
            <path id="circle" d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
          </defs>
          <text className="text-sm fill-cyan-400 instrument">
            <textPath href="#circle" startOffset="0%">
              PERDAY MUSIC • PERDAY MUSIC • PERDAY MUSIC •
            </textPath>
          </text>
        </motion.svg>

        {/* Center Icon */}
        <div className="relative z-10 text-2xl">🎵</div>
      </div>
    </div>
  )
}
