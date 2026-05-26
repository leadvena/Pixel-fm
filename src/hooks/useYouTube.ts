import { useState, useEffect, useRef, useCallback } from 'react';
import { searchYouTube, YouTubeVideo } from '../utils/youtubeApi';

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

export function useYouTube() {
  const [playerReady, setPlayerReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(50);
  
  const [playlist, setPlaylist] = useState<YouTubeVideo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [shuffleState, setShuffleState] = useState(false);
  const [repeatState, setRepeatState] = useState<'off' | 'track' | 'context'>('off');

  const playerRef = useRef<any>(null);
  const progressIntervalRef = useRef<any>(null);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        playerRef.current = new window.YT.Player('youtube-hidden-player', {
          height: '0',
          width: '0',
          videoId: '',
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            playsinline: 1
          },
          events: {
            onReady: (event: any) => {
              setPlayerReady(true);
              event.target.setVolume(volume);
            },
            onStateChange: (event: any) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
                setDuration(event.target.getDuration());
              } else if (event.data === window.YT.PlayerState.PAUSED) {
                setIsPlaying(false);
              } else if (event.data === window.YT.PlayerState.ENDED) {
                setIsPlaying(false);
                handleTrackEnded();
              }
            },
            onError: (event: any) => {
              console.error("YouTube Player Error", event.data);
              // Skip to next if there's an error playing this one
              handleTrackEnded();
            }
          }
        });
      };
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTrackEnded = useCallback(() => {
    if (repeatState === 'track') {
      if (playerRef.current) {
        playerRef.current.seekTo(0);
        playerRef.current.playVideo();
      }
    } else {
      nextTrack();
    }
  }, [repeatState, playlist.length, currentIndex]); // eslint-disable-line

  useEffect(() => {
    if (isPlaying) {
      progressIntervalRef.current = setInterval(() => {
        if (playerRef.current && playerRef.current.getCurrentTime) {
          setProgress(playerRef.current.getCurrentTime());
        }
      }, 1000);
    } else {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    }
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    }
  }, [isPlaying]);

  const searchAndPlay = async (query: string) => {
    setIsSearching(true);
    setError(null);
    try {
      const results = await searchYouTube(query);
      if (results.length > 0) {
        setPlaylist(results);
        setCurrentIndex(0);
      } else {
        setError('No results found.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (playerReady && currentIndex >= 0 && playlist[currentIndex]) {
      const videoId = playlist[currentIndex].id;
      playerRef.current.loadVideoById(videoId);
      setIsPlaying(true);
      setProgress(0);
      setDuration(0);
    }
  }, [currentIndex, playerReady]);

  const togglePlay = useCallback(() => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  }, [isPlaying]);

  const nextTrack = useCallback(() => {
    if (shuffleState && playlist.length > 1) {
      let nextIdx = Math.floor(Math.random() * playlist.length);
      while(nextIdx === currentIndex) {
         nextIdx = Math.floor(Math.random() * playlist.length);
      }
      setCurrentIndex(nextIdx);
    } else if (currentIndex < playlist.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (repeatState === 'context') {
      setCurrentIndex(0);
    } else {
      setIsPlaying(false);
      if (playerRef.current) playerRef.current.stopVideo();
    }
  }, [currentIndex, playlist, shuffleState, repeatState]);

  const prevTrack = useCallback(() => {
    if (progress > 3) {
      if (playerRef.current) playerRef.current.seekTo(0);
      setProgress(0);
    } else if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex, progress]);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    if (playerRef.current && playerRef.current.setVolume) {
      playerRef.current.setVolume(v);
    }
  }, []);

  const seek = useCallback((ms: number) => {
    const s = ms / 1000;
    setProgress(s);
    if (playerRef.current && playerRef.current.seekTo) {
      playerRef.current.seekTo(s, true);
    }
  }, []);

  const toggleShuffle = useCallback(() => {
    setShuffleState(prev => !prev);
  }, []);

  const toggleRepeat = useCallback(() => {
    setRepeatState(prev => prev === 'off' ? 'context' : prev === 'context' ? 'track' : 'off');
  }, []);

  return {
    playerReady,
    isPlaying,
    progressMs: progress * 1000,
    durationMs: duration * 1000,
    volume,
    currentVideo: currentIndex >= 0 ? playlist[currentIndex] : null,
    queue: playlist.slice(currentIndex + 1),
    searchAndPlay,
    isSearching,
    error,
    togglePlay,
    nextTrack,
    prevTrack,
    setVolume,
    seek,
    shuffleState,
    repeatState,
    toggleShuffle,
    toggleRepeat
  };
}
