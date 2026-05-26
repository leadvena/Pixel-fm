import React, { useRef, MouseEvent } from 'react';

interface ProgressBarProps {
  currentMs: number;
  durationMs: number;
  onSeek?: (ms: number) => void;
}

export default function ProgressBar({ currentMs, durationMs, onSeek }: ProgressBarProps) {
  const barRef = useRef<HTMLDivElement>(null);

  // Math safety
  const safeDuration = durationMs > 0 ? durationMs : 1;
  const safeCurrent = Math.max(0, Math.min(currentMs, safeDuration));
  const percent = (safeCurrent / safeDuration) * 100;

  // Format Helper e.g. 182300 ms -> "03:02"
  const formatTime = (ms: number) => {
    const totalSecs = Math.floor(ms / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!onSeek || !barRef.current) return;
    const rect = barRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickPercent = Math.max(0, Math.min(clickX / rect.width, 1));
    const targetMs = Math.round(clickPercent * safeDuration);
    onSeek(targetMs);
  };

  return (
    <div className="w-full max-w-sm px-4 flex flex-col mt-4 font-mono select-none">
      
      {/* Time indicators above */}
      <div className="flex justify-between items-center text-[8px] md:text-[9px] text-bubblegum mb-2 tracking-widest font-bold">
        <span>{formatTime(safeCurrent)}</span>
        <span className="text-[7px] text-deep-magenta">TIME LIMIT</span>
        <span>{formatTime(durationMs)}</span>
      </div>

      {/* Chunky Pixel Progress Bar Container */}
      <div 
        ref={barRef}
        onClick={handleClick}
        className="relative h-6 bg-retro-dark border-4 border-retro-text box-content cursor-pointer hover:shadow-[0_0_8px_rgba(255,45,120,0.4)] transition-all"
      >
        {/* Pixel Segments Grid Effect */}
        <div className="absolute inset-0 w-full h-full flex justify-between pointer-events-none z-10 select-none">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="h-full w-[2px] bg-retro-text opacity-30" />
          ))}
        </div>

        {/* Solid chunky pink fill */}
        <div 
          className="h-full bg-hot-pink select-none transition-all duration-300"
          style={{ 
            width: `${percent}%`,
            boxShadow: 'inset -4px -4px 0 0 var(--color-deep-magenta), inset 4px 4px 0 0 #FFB3C6'
          }}
        />

        {/* Highlight glowing notch if progress is active */}
        {percent > 0 && (
          <div 
            className="absolute top-0 h-full w-2 bg-white border border-retro-text z-20"
            style={{ left: `calc(${percent}% - 4px)` }}
          />
        )}
      </div>
    </div>
  );
}
