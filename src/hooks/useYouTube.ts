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
    const initPlayer = () => {
      if (playerRef.current) return; // already initialized
      playerRef.current = new window.YT.Player('youtube-hidden-player', {
        height: '100%',
        width: '100%',
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
            event.target.unMute();
            event.target.setVolume(50);
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              event.target.unMute();
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
            handleTrackEnded();
          }
        }
      });
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = initPlayer;
    } else if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      // Cleanup player on unmount
      if (playerRef.current && playerRef.current.destroy) {
         playerRef.current.destroy();
         playerRef.current = null;
      }
    };
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
        
        // Call loadVideoById directly here instead of using useEffect
        // to maintain the user interaction trace better (if possible).
        if (playerReady && playerRef.current) {
           playerRef.current.loadVideoById(results[0].id);
           playerRef.current.playVideo();
           setIsPlaying(true);
           setProgress(0);
           setDuration(0);
        }
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
    // We check against the currently playing video id to avoid double-loading on searchAndPlay's effect trigger.
    if (playerReady && currentIndex >= 0 && playlist[currentIndex]) {
       const videoId = playlist[currentIndex].id;
       // Only load if it's changing!
       const currentUrl = playerRef.current.getVideoUrl?.() || '';
       if (!currentUrl.includes(videoId)) {
         playerRef.current.loadVideoById(videoId);
         playerRef.current.playVideo();
         setIsPlaying(true);
         setProgress(0);
         setDuration(0);
       }
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

  const fetchMoreRelatedTracks = async (channelTitle: string) => {
    try {
      const moreResults = await searchYouTube(channelTitle + " music");
      // filter out duplicates
      const uniqueResults = moreResults.filter(newVideo => !playlist.find(p => p.id === newVideo.id));
      if (uniqueResults.length > 0) {
        setPlaylist(prev => [...prev, ...uniqueResults]);
        setCurrentIndex(prev => prev + 1);
        return;
      }
    } catch(err) {
      console.error("Failed to fetch more tracks for radio", err);
    }
    // fallback if error or no unique results
    setIsPlaying(false);
    if (playerRef.current) playerRef.current.stopVideo();
  };

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
      // Endless Radio: Fetch more songs based on the artist
      if (playlist[currentIndex]) {
        fetchMoreRelatedTracks(playlist[currentIndex].channelTitle);
      } else {
        setIsPlaying(false);
        if (playerRef.current) playerRef.current.stopVideo();
      }
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
