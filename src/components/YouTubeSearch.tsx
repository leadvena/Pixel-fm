import React, { useState, useEffect } from 'react';
import { Search, AlertCircle, Music } from 'lucide-react';

interface YouTubeSearchProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
  error: string | null;
}

export default function YouTubeSearch({ onSearch, isSearching, error }: YouTubeSearchProps) {
  const [query, setQuery] = useState('');
  const [sparkles, setSparkles] = useState<{ id: number; top: number; left: number; delay: number }[]>([]);

  useEffect(() => {
    const newSparkles = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      top: Math.random() * 85 + 5,
      left: Math.random() * 90 + 5,
      delay: Math.random() * 2,
    }));
    setSparkles(newSparkles);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <div className="relative min-h-screen bg-retro-bg flex flex-col items-center justify-center p-4 selection:bg-hot-pink selection:text-retro-text">
      {/* Sparkles Floating */}
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="pixel-bg-sparkle pointer-events-none"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}

      {/* Main Search Frame */}
      <div className="relative max-w-lg w-full pixel-border-window p-6 md:p-8 flex flex-col items-center text-center z-10">
        
        {/* Animated Cassette Retro Character */}
        <div className="mb-6 flex flex-col items-center justify-center">
          <div className="relative w-40 h-24 bg-hot-pink border-4 border-retro-text box-content flex flex-col justify-between p-2 pixel-sprite-walk select-none shadow-[4px_4px_0_0_var(--color-deep-magenta)]">
            <div className="w-full h-8 bg-bubblegum border-2 border-retro-text flex justify-around items-center px-2">
              <div className="w-4 h-4 bg-retro-text border-2 border-retro-text rounded-full" />
              <div className="text-[6px] text-retro-dark select-none leading-none tracking-widest">TDK 90</div>
              <div className="w-4 h-4 bg-retro-text border-2 border-retro-text rounded-full" />
            </div>
            <div className="flex justify-between items-end w-full px-4 h-4">
              <div className="w-3 h-2 bg-retro-text border-2 border-retro-text border-b-0" />
              <div className="w-10 h-2 bg-bubblegum border-2 border-retro-text border-b-0 flex justify-around items-center">
                <span className="w-1 h-1 bg-retro-text" />
                <span className="w-1 h-1 bg-retro-text" />
              </div>
              <div className="w-3 h-2 bg-retro-text border-2 border-retro-text border-b-0" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-4 mt-2">
              <div className="w-2 h-3 bg-white flex items-end">
                <div className="w-2 h-1 bg-retro-text" />
              </div>
              <div className="w-2 h-3 bg-white flex items-end">
                <div className="w-2 h-1 bg-retro-text" />
              </div>
            </div>
          </div>
          <div className="flex gap-12 -mt-1 select-none">
            <div className="w-4 h-3 bg-white border-2 border-retro-text border-t-0 shadow-[2px_2px_0_0_var(--color-deep-magenta)]" />
            <div className="w-4 h-3 bg-white border-2 border-retro-text border-t-0 shadow-[2px_2px_0_0_var(--color-deep-magenta)]" />
          </div>
        </div>

        {/* Console Title */}
        <div className="mb-2">
          <h1 className="text-3xl md:text-4xl text-hot-pink pixel-glow font-bold mb-1 leading-tight tracking-wider">
            PIXEL.FM<span className="blinking-cursor text-retro-text" />
          </h1>
          <div className="text-[10px] md:text-xs text-bubblegum uppercase tracking-widest mt-2 select-none">
            16-BIT RETRO YT PLAYER
          </div>
        </div>

        <p className="text-[9px] md:text-[10px] text-retro-text max-w-sm mt-4 mb-6 leading-relaxed uppercase">
          Insert quarter to chip in! Search YouTube for any song to start your vintage listening session.
        </p>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ENTER SONG NAME..."
            className="w-full bg-retro-dark border-4 border-retro-text p-4 text-retro-text text-xs md:text-sm font-mono placeholder-retro-text focus:outline-none focus:border-hot-pink transition-colors font-bold uppercase shadow-inner"
            required
            autoFocus
          />
          <button
            type="submit"
            disabled={isSearching}
            className="pixel-btn w-full text-xs py-4 flex items-center justify-center gap-2 select-none"
          >
            {isSearching ? (
              'SEARCHING...'
            ) : (
              <>
                <Search size={16} className="shrink-0" />
                SEARCH YOUTUBE
              </>
            )}
          </button>
        </form>

        {/* Global Error Notice */}
        {error && (
          <div className="mt-4 w-full p-3 bg-retro-dark border-4 border-[var(--color-deep-magenta)] text-hot-pink font-mono text-[9px] flex items-start gap-2 text-left shadow-md">
            <AlertCircle className="shrink-0 mt-0.5" size={14} />
            <div>
              <div className="font-bold uppercase mb-1">SYSTEM WARNING:</div>
              {error}
            </div>
          </div>
        )}
      </div>

      {/* Decorative Arcade footer info */}
      <div className="mt-8 text-[8px] text-deep-magenta tracking-[0.2em] font-sans text-center uppercase select-none">
        © 2026 PIXEL.FM - INSERT QUARTER TO PLAY
      </div>
    </div>
  );
}
