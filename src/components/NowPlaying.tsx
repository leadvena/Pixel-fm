import React from 'react';
import { Radio } from 'lucide-react';
import { YouTubeVideo } from '../utils/youtubeApi';

interface NowPlayingProps {
  currentVideo: YouTubeVideo | null;
  isPlaying: boolean;
}

export default function NowPlaying({ currentVideo, isPlaying }: NowPlayingProps) {
  const albumArt = currentVideo?.thumbnail;
  const songName = currentVideo?.title || 'DECK IS EMPTY';
  const artistName = currentVideo?.channelTitle || 'INSERT CASSETTE';

  return (
    <div className="flex flex-col items-center w-full my-4 md:my-6">
      {/* Album Cover Block Retro Gaming HUD Frame */}
      <div className="relative w-64 h-64 md:w-72 md:h-72 border-4 border-retro-text bg-retro-dark flex flex-col justify-center items-center shadow-[0_0_20px_rgba(255,45,120,0.30)] select-none">
        
        {/* Glow corner brackets */}
        <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-4 border-l-4 border-hot-pink" />
        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-4 border-r-4 border-hot-pink" />
        <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-4 border-l-4 border-hot-pink" />
        <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-4 border-r-4 border-hot-pink" />

        {/* Outer label HUD */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-retro-dark px-1.5 py-0.5 border border-retro-text text-[7px] text-bubblegum">
          <Radio size={8} className={`${isPlaying ? 'animate-pulse' : ''}`} />
          <span>DECK_01</span>
        </div>

        {albumArt ? (
          <img
            src={albumArt}
            alt={songName}
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover transition-transform ${
              isPlaying ? 'scale-[1.01]' : 'scale-100'
            }`}
             style={{ imageRendering: 'pixelated' }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-4">
            {/* Retro Vinyl Record Pixel Art Falling */}
            <div className={`relative w-36 h-36 bg-retro-bg rounded-full border-4 border-retro-text flex items-center justify-center p-3 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }}>
              {/* Grooves */}
              <div className="w-full h-full rounded-full border-2 border-dashed border-retro-text flex items-center justify-center">
                {/* Center tape label */}
                <div className="w-12 h-12 bg-hot-pink rounded-full border-4 border-retro-text flex items-center justify-center">
                  <div className="w-4 h-4 bg-retro-bg rounded-full border-2 border-retro-text" />
                </div>
              </div>
            </div>
            <div className="text-[8px] text-deep-magenta mt-4 font-mono select-none tracking-widest">
              AWAITING AUDIO
            </div>
          </div>
        )}

        {/* Bouncing Equalizer Bars HUD Overlaid Bottom-Right */}
        <div className="absolute bottom-3 right-3 flex items-end gap-1.5 h-12 px-2 py-1 bg-retro-text/60 border border-retro-text select-none pointer-events-none">
          <div className={`w-1.5 bg-hot-pink ${isPlaying ? 'eq-bar-1' : 'h-1'}`} />
          <div className={`w-1.5 bg-bubblegum ${isPlaying ? 'eq-bar-2' : 'h-2'}`} />
          <div className={`w-1.5 bg-hot-pink ${isPlaying ? 'eq-bar-3' : 'h-1.5'}`} />
          <div className={`w-1.5 bg-bubblegum ${isPlaying ? 'eq-bar-4' : 'h-1'}`} />
          <div className={`w-1.5 bg-hot-pink ${isPlaying ? 'eq-bar-5' : 'h-2'}`} />
        </div>
      </div>

      {/* Song Metadata Titles */}
      <div className="text-center w-full max-w-sm mt-4 px-4 overflow-hidden">
        {/* Scrolling or clean text */}
        <div className="relative">
          <h2 className="text-sm md:text-base text-hot-pink font-bold tracking-wide leading-snug break-words uppercase select-text">
             {songName}
          </h2>
        </div>
        <p className="text-[10px] md:text-xs text-bubblegum font-medium tracking-wider mt-1.5 break-words uppercase select-text">
           {artistName}
        </p>
      </div>
    </div>
  );
}
