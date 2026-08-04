const YOUTUBE_VIDEO_ID_PATTERN =
  /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/;

export function getYoutubeVideoId(url: string): string | null {
  return url.match(YOUTUBE_VIDEO_ID_PATTERN)?.[1] ?? null;
}

export function getYoutubeThumbnailUrl(url: string): string | undefined {
  const videoId = getYoutubeVideoId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : undefined;
}

export function stripYoutubeSuffix(source: string): string {
  return source.replace(/\s*\(youtube\)\s*$/i, "").trim();
}
