import React from 'react';
import { useYouTube } from './hooks/useYouTube';
import YouTubeSearch from './components/YouTubeSearch';
import Player from './components/Player';

export default function App() {
  const {
    playerReady,
    isPlaying,
    progressMs,
    durationMs,
    volume,
    currentVideo,
    queue,
    searchAndPlay,
    isSearching,
    error,
    togglePlay,
    nextTrack,
    prevTrack,
    setVolume,
    toggleShuffle,
    toggleRepeat,
    shuffleState,
    repeatState,
    seek,
  } = useYouTube();

  return (
    <div className="relative min-h-screen font-sans bg-retro-bg text-white overflow-x-hidden antialiased select-none">
      
      {/* AUTHENTIC RETRO SPECIAL OVERLAYS */}
      {/* 1. CRT Scanlines effect */}
      <div className="crt-overlay" />
      
      {/* 2. CRT Screen Vignette corners shadowing */}
      <div className="crt-vignette" />

      {/* Hidden YouTube Player div placeholder (wrapped to prevent React DOM conflicts) */}
      <div className="hidden absolute w-0 h-0 invisible" aria-hidden="true">
        <div id="youtube-hidden-player" />
      </div>

      {/* RENDER PAGES */}
      {(!playerReady) ? (
        /* Pixel loader boot screen */
        <div className="min-h-screen bg-retro-bg scrolling-bg flex flex-col items-center justify-center p-4">
          <div className="max-w-xs w-full pixel-border-window p-6 text-center select-none bg-retro-dark">
            <div className="text-[10px] md:text-xs text-hot-pink animate-pulse font-bold tracking-widest uppercase mb-4">
              BOOTING PIXEL.FM...
            </div>
            {/* Health loader gauge */}
            <div className="w-full bg-retro-bg border-4 border-black h-6 relative p-0.5 overflow-hidden">
              <div 
                className="h-full bg-hot-pink uppercase" 
                style={{ 
                  width: '75%',
                  boxShadow: 'inset -4px -4px 0 0 #C2185B, inset 4px 4px 0 0 #FFB3C6',
                  animation: 'pulse 1.5s infinite ease-in-out'
                }} 
              />
            </div>
            <div className="text-[7px] text-deep-magenta mt-3 uppercase tracking-widest select-none">
              AWAITING AUDIO DRIVER
            </div>
          </div>
        </div>
      ) : (!currentVideo) ? (
        /* YouTube Search / landing screen */
        <YouTubeSearch onSearch={searchAndPlay} error={error} isSearching={isSearching} />
      ) : (
        /* Active retro game player console */
        <Player
          isPlaying={isPlaying}
          progressMs={progressMs}
          durationMs={durationMs}
          volume={volume}
          currentVideo={currentVideo}
          queue={queue}
          onSearch={() => searchAndPlay('')}
          togglePlay={togglePlay}
          nextTrack={nextTrack}
          prevTrack={prevTrack}
          setVolume={setVolume}
          toggleShuffle={toggleShuffle}
          toggleRepeat={toggleRepeat}
          seek={seek}
          shuffleState={shuffleState}
          repeatState={repeatState}
        />
      )}
    </div>
  );
}

