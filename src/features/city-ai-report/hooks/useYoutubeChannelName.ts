import { useQuery } from '@tanstack/react-query';
import { getYoutubeVideoId } from '../utils/youtube';

/**
 * 백엔드 리소스 API의 source 필드가 실제 채널명이 아니라 모든 영상에 대해 고정 문자열
 * "YouTube"만 내려줘서(백엔드 확인됨), 유튜브 oEmbed로 실제 업로더 채널명을 직접 가져온다.
 * 인증 없이 CORS로 호출 가능한 공개 엔드포인트다.
 */
async function fetchYoutubeChannelName(url: string): Promise<string | null> {
  const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
  if (!res.ok) return null;
  const data: { author_name?: string } = await res.json();
  return data.author_name ?? null;
}

export function useYoutubeChannelName(url: string) {
  const videoId = getYoutubeVideoId(url);
  return useQuery({
    queryKey: ['youtube-oembed-channel', videoId],
    queryFn: () => fetchYoutubeChannelName(url),
    enabled: !!videoId,
    staleTime: Infinity,
    retry: 1,
  });
}
