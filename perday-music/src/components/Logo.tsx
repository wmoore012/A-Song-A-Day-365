import { Music } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Logo() {

  return (
    <Link
      to="/features"
      className="flex items-center gap-2 text-white font-bold text-lg transition-all duration-300 hover:scale-105 hover:drop-shadow-lg hover:shadow-cyan-400/20 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black"
      aria-label="Go to features page"
    >
      <Music className="w-6 h-6 text-cyan-400 transition-transform duration-300 group-hover:rotate-12" />
      <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent transition-all duration-300 hover:from-cyan-300 hover:to-purple-300">
        Perday: Music
      </span>
    </Link>
  );
}
