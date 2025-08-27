import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface FlipClockProps {
  text: string;
  className?: string;
  onComplete?: () => void;
}

/**
 * FlipClock
 * - Scramble-to-final effect per character (authentic "flip" feel without 60fps setState spam)
 * - One render per animation frame (batched), not per character update
 * - Skips animation in tests / reduced-motion / SSR
 */
export default function FlipClock({ text, className = "", onComplete }: FlipClockProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const rafRef = useRef<number | null>(null);
  const workingCharsRef = useRef<string[]>([]);
  const [displayText, setDisplayText] = useState<string>("");

  useEffect(() => {
    const isSSR = typeof window === 'undefined';
    const isTest = (import.meta as { env?: { MODE?: string } })?.env?.MODE === 'test';
    const reduceMotion = !isSSR && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (!containerRef.current || !text) {
      setDisplayText(text || "");
      return;
    }

    // No animation paths
    if (isSSR || isTest || reduceMotion) {
      setDisplayText(text);
      return;
    }

    // Kill any previous animation
    tlRef.current?.kill();
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    const finalChars = text.split('');
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    const n = finalChars.length;

    // Initialize working buffer with random chars (same length as target)
    workingCharsRef.current = Array.from({ length: n }).map(
      () => charset[Math.floor(Math.random() * charset.length)]
    );

    // Commit loop (single RAF per frame)
    const commit = () => {
      setDisplayText(workingCharsRef.current.join(''));
      rafRef.current = requestAnimationFrame(commit);
    };
    rafRef.current = requestAnimationFrame(commit);

    // Build a single timeline that animates each character's reveal
    const tl = gsap.timeline({
      onComplete: () => {
        // Final commit to ensure perfect text
        workingCharsRef.current = finalChars.slice();
        setDisplayText(text);
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
        onComplete?.();
      }
    });

    // Stagger per character with a little randomness
    finalChars.forEach((ch, i) => {
      const dur = 0.6 + Math.random() * 0.6;   // 0.6–1.2s
      const delay = Math.random() * 0.2;       // 0–0.2s
      // Dummy tween whose onUpdate mutates the working array (no setState here)
      const proxy = { p: 0 };
      tl.to(proxy, {
        p: 1,
        duration: dur,
        delay,
        ease: 'power2.out',
        onUpdate: () => {
          // While <80% progressed, keep scrambling this index only
          if (proxy.p < 0.8) {
            workingCharsRef.current[i] = charset[Math.floor(Math.random() * charset.length)];
          } else {
            workingCharsRef.current[i] = ch;
          }
        }
      }, i * 0.06); // slight deterministic stagger
    });

    tlRef.current = tl;

    return () => {
      tlRef.current?.kill();
      tlRef.current = null;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [text, onComplete]);

  return (
    <div
      ref={containerRef}
      className={`font-mono font-bold tracking-wider [perspective:800px] ${className}`}
      aria-label={text}
    >
      {displayText.split('').map((char, idx) => (
        <span
          key={idx}
          className="inline-block mx-1 [transform-style:preserve-3d]"
        >
          {/* Keep the markup simple; the 'flip' sensation is conveyed by the scramble + subtle depth */}
          <span className="inline-block rounded-md px-1 py-2 bg-gradient-to-b from-gray-800 to-gray-900 border border-cyan-400/30 text-cyan-300 text-lg font-bold will-change-transform">
            {char}
          </span>
        </span>
      ))}
    </div>
  );
}
