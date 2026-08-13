import { useYoutubeChannelName } from '../hooks/useYoutubeChannelName';

interface ThumbnailVideoProps {
  /** 채널명을 가져오기 전이나 실패했을 때 보여줄 대체 값 */
  tag: string;
  title: string;
  thumbnailUrl?: string;
  url: string;
}

export default function ThumbnailVideo({
  tag,
  title,
  thumbnailUrl,
  url,
}: ThumbnailVideoProps) {
  const { data: channelName } = useYoutubeChannelName(url);
  const displayTag = channelName ?? tag;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="w-[214px] h-[143px] relative overflow-hidden rounded-4 bg-cover bg-center block"
      style={
        thumbnailUrl
          ? { backgroundImage: `url(${thumbnailUrl})` }
          : { background: "var(--color-gray-50)" }
      }
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--color-primary-900) 0%, transparent) 0%, color-mix(in srgb, var(--color-gray-900) 55%, transparent) 100%)",
        }}
      />
      <div className="flex flex-col justify-end items-start w-[184px] absolute left-[17px] bottom-3 gap-1">
        <div className="flex justify-center items-center gap-1 px-2 py-1 rounded-md bg-white/40">
          {/* 재생 아이콘이 카드 정중앙(왼쪽 92px 지점부터)에 고정돼 있어, 뱃지 텍스트 시작
              위치(25px)부터 아이콘과 닿기 전인 67px보다 여유 있게 50px에서 잘라 말줄임표로 보여준다 */}
          <p className="label-03 max-w-[50px] truncate text-gray-700">{displayTag}</p>
        </div>
        <p className="body-04 text-white w-[184px] line-clamp-2">{title}</p>
      </div>
      <svg
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <rect width="30" height="30" rx="15" fill="white" />
        <path d="M22 15L11.5 21.0622L11.5 8.93782L22 15Z" fill="#B8BFCB" />
      </svg>
    </a>
  );
}
