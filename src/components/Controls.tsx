import React from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Shuffle, 
  Repeat, 
  Repeat1 
} from 'lucide-react';

interface ControlsProps {
  isPlaying: boolean;
  shuffleState: boolean;
  repeatState: 'off' | 'track' | 'context';
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onShuffleToggle: () => void;
  onRepeatToggle: () => void;
}

export default function Controls({
  isPlaying,
  shuffleState,
  repeatState,
  onPlayPause,
  onNext,
  onPrev,
  onShuffleToggle,
  onRepeatToggle
}: ControlsProps) {
  
  return (
    <div className="w-full max-w-sm px-4 flex flex-col items-center mt-6 select-none font-mono">
      {/* HUD control label */}
      <div className="text-[7px] text-deep-magenta uppercase tracking-[0.25em] mb-3 text-center select-none font-bold">
        🕹️ PLAYBACK CONTROLLER DECK
      </div>

      <div className="flex justify-between items-center w-full gap-2">
        {/* Shuffle Button */}
        <button
          id="ctrl_shuffle"
          onClick={onShuffleToggle}
          title="Shuffle"
          className={`pixel-btn shrink-0 w-11 h-11 flex items-center justify-center p-0 ${
            shuffleState 
              ? 'bg-retro-text hover:bg-bubblegum text-retro-text shadow-[inset_-4px_-4px_0_0_#008A50,inset_4px_4px_0_0_#90FFD0]' 
              : 'pixel-btn-secondary text-bubblegum'
          }`}
          style={{ height: '44px', width: '44px' }}
        >
          <Shuffle size={14} strokeWidth={3} />
        </button>

        {/* Previous Button */}
        <button
          id="ctrl_prev"
          onClick={onPrev}
          title="Previous Track"
          className="pixel-btn pixel-btn-secondary shrink-0"
          style={{ height: '44px', width: '44px' }}
        >
          <SkipBack size={16} strokeWidth={3} />
        </button>

        {/* Play/Pause Button - Central Action, larger */}
        <button
          id="ctrl_play_pause"
          onClick={onPlayPause}
          title={isPlaying ? 'Pause' : 'Play'}
          className="pixel-btn flex-1 shrink-0 bg-white text-retro-text hover:bg-bubblegum border-4 border-retro-text shadow-[inset_-4px_-4px_0_0_#BBB,inset_4px_4px_0_0_#FFF]"
          style={{ height: '52px' }}
        >
          {isPlaying ? (
            <Pause size={20} fill="currentColor" strokeWidth={2} className="mx-auto" />
          ) : (
            <Play size={20} fill="currentColor" strokeWidth={2} className="mx-auto ml-1" />
          )}
        </button>

        {/* Next Button */}
        <button
          id="ctrl_next"
          onClick={onNext}
          title="Next Track"
          className="pixel-btn pixel-btn-secondary shrink-0"
          style={{ height: '44px', width: '44px' }}
        >
          <SkipForward size={16} strokeWidth={3} />
        </button>

        {/* Repeat Button */}
        <button
          id="ctrl_repeat"
          onClick={onRepeatToggle}
          title={`Repeat: ${repeatState}`}
          className={`pixel-btn shrink-0 flex flex-col items-center justify-center p-0 ${
            repeatState !== 'off'
              ? 'bg-hot-pink text-retro-text shadow-[inset_-4px_-4px_0_0_var(--color-deep-magenta),inset_4px_4px_0_0_#FFB3C6]'
              : 'pixel-btn-secondary text-bubblegum'
          }`}
          style={{ height: '44px', width: '44px' }}
        >
          {repeatState === 'track' ? (
            <Repeat1 size={14} strokeWidth={3} className="text-retro-text" />
          ) : (
            <Repeat size={14} strokeWidth={3} className={repeatState === 'context' ? 'text-retro-text' : ''} />
          )}
        </button>
      </div>

      {/* Mini status indicator labels */}
      <div className="flex justify-between w-full px-2 mt-2 select-none pointer-events-none">
        <span className={`text-[6px] tracking-wide font-bold ${shuffleState ? 'text-retro-text' : 'text-deep-magenta'}`}>
          SHF: {shuffleState ? 'ON' : 'OFF'}
        </span>
        <span className="text-[6px] text-deep-magenta uppercase tracking-widest font-bold">
          STEREO COMPACT
        </span>
        <span className={`text-[6px] tracking-wide font-bold ${repeatState !== 'off' ? 'text-hot-pink' : 'text-deep-magenta'}`}>
          RPT: {repeatState.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
