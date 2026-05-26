import React, { useState } from 'react';
import { Volume, Volume1, Volume2, VolumeX } from 'lucide-react';

interface VolumeSliderProps {
  currentVolume: number;
  onVolumeChange: (volume: number) => void;
}

export default function VolumeSlider({ currentVolume, onVolumeChange }: VolumeSliderProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Divide into 10 steps of volume (0% to 100%)
  const steps = 10;
  
  // Decide volume icon based on percentage
  const getVolumeIcon = () => {
    if (currentVolume === 0) return <VolumeX size={14} className="text-deep-magenta animate-pulse" />;
    if (currentVolume < 30) return <Volume size={14} className="text-bubblegum" />;
    if (currentVolume < 70) return <Volume1 size={14} className="text-hot-pink" />;
    return <Volume2 size={14} className="text-white animate-pulse" />;
  };

  const handleSegmentClick = (index: number) => {
    const targetVolume = Math.round(((index + 1) / steps) * 100);
    onVolumeChange(targetVolume);
  };

  return (
    <div className="w-full max-w-sm px-4 flex flex-col mt-4 font-mono select-none">
      
      {/* Title/Label */}
      <div className="flex justify-between items-center text-[8px] md:text-[9px] text-bubblegum mb-2 uppercase tracking-widest font-bold">
        <span className="flex items-center gap-1">
          {getVolumeIcon()}
          <span>SND_VOL</span>
        </span>
        <span>{currentVolume}%</span>
      </div>

      {/* Retro Volume Meter with 10 chunky wedge bars */}
      <div className="w-full h-8 bg-retro-dark border-4 border-black p-1.5 flex justify-between items-end gap-1 select-none">
        {Array.from({ length: steps }).map((_, i) => {
          const stepPercent = ((i + 1) / steps) * 100;
          const isActive = currentVolume >= stepPercent;
          const isHovered = hoveredIndex !== null && i <= hoveredIndex;
          
          // Calculate individual wedge height
          const barHeight = `${15 + i * 8}%`;

          return (
            <button
              key={i}
              onClick={() => handleSegmentClick(i)}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`flex-1 cursor-pointer transition-all border-2 border-black ${
                isActive 
                  ? 'bg-hot-pink hover:bg-bubblegum shadow-[inset_-2px_-2px_0_0_#C2185B]' 
                  : isHovered
                    ? 'bg-[#5a003d] border-white shadow-none'
                    : 'bg-[#250017] shadow-none'
              }`}
              style={{ 
                height: barHeight,
                imageRendering: 'pixelated'
              }}
              title={`Set volume to ${stepPercent}%`}
            />
          );
        })}
      </div>
    </div>
  );
}
