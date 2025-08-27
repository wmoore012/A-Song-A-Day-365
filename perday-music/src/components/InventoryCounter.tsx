import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../store/store';
import { Genre } from '../types';
import { gsap } from 'gsap';

interface GenreCount {
  genre: Genre;
  count: number;
  color: string;
}

// Genre colors constant - moved outside component to avoid useEffect dependency issues
const genreColors: Record<Genre, string> = {
  'Trap': 'from-purple-500 to-pink-500',
  'Hip-Hop': 'from-orange-500 to-red-500',
  'R&B': 'from-blue-500 to-purple-500',
  'Pop': 'from-pink-500 to-rose-500',
  'Electronic': 'from-cyan-500 to-blue-500',
  'Rock': 'from-red-500 to-orange-500',
    'Jazz': 'from-yellow-500 to-orange-500',
    'Country': 'from-green-500 to-emerald-500',
    'Other': 'from-gray-500 to-slate-500',
  };

export default function InventoryCounter() {
  const { inventory } = useAppStore();
  const [genreCounts, setGenreCounts] = useState<GenreCount[]>([]);
  const [showAnimation, setShowAnimation] = useState(false);
  const animationRef = useRef<HTMLDivElement>(null);

  // Calculate genre counts
  useEffect(() => {
    const counts = Object.values(genreColors).map((color, index) => {
      const genre = Object.keys(genreColors)[index] as Genre;
      const count = inventory.filter(item => item.genre === genre).length;
      return { genre, count, color };
    }).filter(item => item.count > 0);

    setGenreCounts(counts);
  }, [inventory]);

  // Animation when inventory changes
  useEffect(() => {
    if (inventory.length > 0) {
      setShowAnimation(true);
      
      if (animationRef.current) {
        gsap.fromTo(animationRef.current,
          { scale: 0, opacity: 0 },
          { scale: 1.2, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }
        );
        
        gsap.to(animationRef.current,
          { scale: 1, duration: 0.2, delay: 0.3 }
        );
      }

      setTimeout(() => setShowAnimation(false), 1000);
    }
  }, [inventory.length]);

  const totalCount = inventory.length;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-black/80 backdrop-blur-xl border border-cyan-400/30 rounded-xl p-4 shadow-2xl">
        <div className="flex items-center gap-3 mb-3">
          <h3 className="text-cyan-300 font-semibold text-sm">Inventory</h3>
          <div className="text-white font-bold text-lg">{totalCount}</div>
          {showAnimation && (
            <div
              ref={animationRef}
              className="text-green-400 font-bold text-xl animate-pulse"
            >
              +1
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          {genreCounts.map(({ genre, count, color }) => (
            <div key={genre} className="flex items-center justify-between">
              <span className="text-white/70 text-xs">{genre}</span>
              <div className={`px-2 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${color}`}>
                {count}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
