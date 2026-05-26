import React, { useEffect, useState } from 'react';
import { Search, Monitor } from 'lucide-react';
import NowPlaying from './NowPlaying';
import ProgressBar from './ProgressBar';
import Controls from './Controls';
import VolumeSlider from './VolumeSlider';
import Queue from './Queue';
import { YouTubeVideo } from '../utils/youtubeApi';

interface PlayerProps {
  isPlaying: boolean;
  progressMs: number;
  durationMs: number;
  volume: number;
  currentVideo: YouTubeVideo | null;
  queue: YouTubeVideo[];
  onSearch: () => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (v: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  seek: (ms: number) => void;
  shuffleState: boolean;
  repeatState: 'off' | 'track' | 'context';
}

export default function Player({
  isPlaying,
  progressMs,
  durationMs,
  volume,
  currentVideo,
  queue,
  onSearch,
  togglePlay,
  nextTrack,
  prevTrack,
  setVolume,
  toggleShuffle,
  toggleRepeat,
  seek,
  shuffleState,
  repeatState,
}: PlayerProps) {
  
  const [sparkles, setSparkles] = useState<{ id: number; top: number; left: number; delay: number }[]>([]);

  // Generate floating bg sparkles
  useEffect(() => {
    const newSparkles = Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      top: Math.random() * 85 + 5,
      left: Math.random() * 90 + 5,
      delay: Math.random() * 3,
    }));
    setSparkles(newSparkles);
  }, []);

  const currentVolume = volume;

  return (
    <div className="relative min-h-screen bg-retro-bg scrolling-bg flex flex-col items-center py-6 px-4 md:py-10 selection:bg-hot-pink selection:text-retro-text">
      {/* Background Sparkles */}
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

      {/* Main Console Container */}
      <div className="relative max-w-md w-full pixel-border-window p-5 md:p-6 flex flex-col items-center z-10 select-none">
        
        {/* Console Header Bar */}
        <div className="w-full flex justify-between items-center border-b-4 border-retro-text pb-4 mb-4 select-none">
          {/* Brand */}
          <div className="flex flex-col">
            <h1 className="text-lg md:text-xl text-hot-pink font-bold tracking-wider mb-0.5 uppercase">
              PIXEL.FM<span className="blinking-cursor text-retro-text" />
            </h1>
            <span className="text-[6px] tracking-widest text-deep-magenta uppercase font-bold">
              FM STEREO DEEP SOUNDS
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            {/* Search Button */}
            <button
              onClick={() => window.location.reload()}
              title="Return to Search"
              className="pixel-btn pixel-btn-secondary w-9 h-9 p-0 flex items-center justify-center cursor-pointer"
              style={{ height: '36px', width: '36px' }}
            >
              <Search size={14} className="transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Audio Output Panel - Kept for aesthetics */}
        <div className="w-full mb-3 select-none">
          <div className="w-full border-2 border-retro-text bg-retro-dark p-2 flex justify-between items-center text-[8px] text-bubblegum tracking-widest">
            <span className="flex items-center gap-1.5 uppercase font-bold">
              <Monitor size={10} className="text-hot-pink" />
              <span>OUT_CH: YT_IFRAME_API</span>
            </span>
            <span className="text-[7px] text-hot-pink font-bold uppercase underline text-opacity-50">
              [LOCKED]
            </span>
          </div>
        </div>

        {/* Core Deck Sub-panels */}
        <NowPlaying currentVideo={currentVideo} isPlaying={isPlaying} />

        {currentVideo ? (
          <>
            <ProgressBar
              currentMs={progressMs}
              durationMs={durationMs}
              onSeek={seek}
            />

            <Controls
              isPlaying={isPlaying}
              shuffleState={shuffleState}
              repeatState={repeatState}
              onPlayPause={togglePlay}
              onNext={nextTrack}
              onPrev={prevTrack}
              onShuffleToggle={toggleShuffle}
              onRepeatToggle={toggleRepeat}
            />

            <VolumeSlider
              currentVolume={currentVolume}
              onVolumeChange={setVolume}
            />
          </>
        ) : (
          <div className="text-center p-8 border-4 border-dashed border-retro-text w-full my-6 flex flex-col justify-center items-center">
            <span className="text-xl animate-bounce">📻</span>
            <div className="text-[10px] text-hot-pink tracking-widest uppercase font-bold mt-3">
              DEMO DECK STANDBY
            </div>
            <p className="text-[8px] text-bubblegum max-w-xs mt-2 leading-loose">
              AWAITING SEARCH INPUT TO INITIATE CHIP CHANNELS.
            </p>
          </div>
        )}

        {/* Upcoming list Queue component */}
        <Queue queue={queue} />
      </div>

      {/* Decorative controls details helper */}
      <div className="mt-6 text-[7px] text-deep-magenta font-mono tracking-widest text-center select-none uppercase">
        VINTAGE 16-BIT RETRO CONSOLE STEREO EMULATED
      </div>
    </div>
  );
}

