import type { Grade } from "@/store/store";

const clamp = (lo: number, hi: number, x: number) => Math.max(lo, Math.min(hi, x));



/** Multiplier rules (your spec) */
export function sessionMultiplier(opts: {
  readyAtMs: number | null;   // elapsed inside Pre-Start or null
  prestartTotalMs: number;    // 420_000 for 7:00
  wrapGrade: Grade;           // A|B|C
}): number {
  // Validate preconditions
  if (opts.prestartTotalMs <= 0) {
    throw new Error(`Invalid prestartTotalMs: ${opts.prestartTotalMs}. Must be > 0.`);
  }
  if (opts.readyAtMs !== null && (opts.readyAtMs < 0 || opts.readyAtMs > opts.prestartTotalMs)) {
    throw new Error(`Invalid readyAtMs: ${opts.readyAtMs}. Must be 0-${opts.prestartTotalMs}.`);
  }

  const base = 1.0;
  const noReadyPenalty = -0.25;
  const earlyBoostMax = 0.25;
  const lateBoostMin = 0.05;

  let boost = 0;
  if (opts.readyAtMs == null) {
    boost += noReadyPenalty;
  } else {
    const t = Math.min(Math.max(opts.readyAtMs, 0), opts.prestartTotalMs);
    const progress = 1 - t / opts.prestartTotalMs; // earlier tap => bigger boost
    boost += lateBoostMin + (earlyBoostMax - lateBoostMin) * progress;
  }

  const gradeAdj = ({ A: +0.1, B: 0, C: -0.1 } as const)[opts.wrapGrade];
  return clamp(0.6, 2.0, base + boost + gradeAdj);
}

export function sessionScore(basePoints: number, mult: number): number {
  // Validate inputs
  if (basePoints < 0) {
    throw new Error(`Invalid basePoints: ${basePoints}. Must be >= 0.`);
  }
  if (mult < 0) {
    throw new Error(`Invalid multiplier: ${mult}. Must be >= 0.`);
  }
  
  return Math.round(basePoints * mult);
}
