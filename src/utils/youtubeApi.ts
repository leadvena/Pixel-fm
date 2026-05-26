export interface YouTubeVideo {
  id: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
  durationMs?: number;
}

function decodeHTMLEntities(text: string) {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
}

export async function searchYouTube(query: string): Promise<YouTubeVideo[]> {
  const YOUTUBE_API_KEY = (import.meta as any).env.VITE_YOUTUBE_API_KEY;

  if (!YOUTUBE_API_KEY) {
    throw new Error('Missing VITE_YOUTUBE_API_KEY environment variable. Please configure it in your AI Studio secrets.');
  }

  const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${encodeURIComponent(query)}&type=video&key=${YOUTUBE_API_KEY}`);
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to search YouTube.');
  }
  
  const data = await res.json();
  
  return data.items.map((item: any) => ({
    id: item.id.videoId,
    title: decodeHTMLEntities(item.snippet.title),
    channelTitle: decodeHTMLEntities(item.snippet.channelTitle),
    thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
  }));
}
