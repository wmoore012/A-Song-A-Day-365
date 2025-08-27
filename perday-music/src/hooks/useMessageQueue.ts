import { useRef, useState } from "react";

export type VillainLine = { id: string; text: string; createdAt?: number };

export function useMessageQueue() {
  const [displayed, setDisplayed] = useState<VillainLine[]>([]);
  const qRef = useRef<VillainLine[]>([]);
  const processingRef = useRef(false);

  const enqueue = (line: VillainLine) => {
    qRef.current.push({ ...line, createdAt: Date.now() });
    tick();
  };

  const clear = () => {
    qRef.current = [];
    setDisplayed([]);
    processingRef.current = false;
  };

  const tick = () => {
    if (processingRef.current) return;
    processingRef.current = true;

    const step = () => {
      const next = qRef.current.shift();
      if (!next) {
        processingRef.current = false;
        return;
      }
      setDisplayed((d) => [...d, next]);
      const delay = Math.min(8000, Math.max(600, next.text.length * 28));
      window.setTimeout(step, delay);
    };

    step();
  };

  return { displayed, enqueue, clear };
}
