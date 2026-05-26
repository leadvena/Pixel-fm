import React from 'react';
import { Disc } from 'lucide-react';
import { YouTubeVideo } from '../utils/youtubeApi';

interface QueueProps {
  queue: YouTubeVideo[];
}

export default function Queue({ queue }: QueueProps) {
  // Take next 3 songs
  const nextSongs = queue.slice(0, 3);
  
  // Backfill with placeholder slots if fewer than 3 songs are returned
  const filledSongs = [...nextSongs];
  while (filledSongs.length < 3) {
    filledSongs.push({
      id: `placeholder_${filledSongs.length}`,
      title: `AUTO_QUEUE_STAGE_0${filledSongs.length + 1}`,
      channelTitle: 'AWAITING TRACK...',
      thumbnail: ''
    });
  }

  return (
    <div className="w-full max-w-sm px-4 mt-6 mb-4 font-mono select-none">
      {/* Title */}
      <h3 className="text-[8px] md:text-[9px] text-bubblegum mb-3 uppercase tracking-widest font-bold flex items-center justify-between">
        <span className="flex items-center gap-1.5 border-b-2 border-black pb-0.5">
          <Disc size={10} className="text-hot-pink animate-spin" style={{ animationDuration: '4s' }} />
          <span>STAGE_LINEUP (NEXT UP)</span>
        </span>
        <span className="text-[7px] text-deep-magenta">LIMIT: 3 Tracks</span>
      </h3>

      {/* Chunky list items */}
      <div className="flex flex-col gap-2.5">
        {filledSongs.map((song, i) => {
          const isPlaceholder = song.id.startsWith('placeholder');
          const title = song.title;
          const artist = song.channelTitle;

          return (
            <div
              key={song.id + '_' + i}
              className={`flex items-center gap-3 p-2 border-2 border-black ${
                isPlaceholder 
                  ? 'bg-retro-dark/40 opacity-50' 
                  : 'bg-retro-dark'
              }`}
            >
              {/* Retro index indicator */}
              <div className="text-[10px] text-hot-pink font-bold bg-[#33001e] border-2 border-black w-8 h-8 flex items-center justify-center shrink-0">
                {String(i + 1).padStart(2, '0')}
              </div>

              {/* Text metadata */}
              <div className="flex-1 min-w-0">
                <div 
                  className="text-[9px] text-white font-bold tracking-wide uppercase truncate" 
                  dangerouslySetInnerHTML={{ __html: title }} 
                />
                <div 
                  className="text-[7px] text-bubblegum uppercase truncate mt-0.5"
                  dangerouslySetInnerHTML={{ __html: artist }}
                />
              </div>

              {/* Status bullet */}
              <div className="shrink-0 pr-1">
                {isPlaceholder ? (
                  <div className="w-1.5 h-1.5 bg-deep-magenta" />
                ) : (
                  <div className="w-1.5 h-1.5 bg-[#00D280] animate-ping" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
