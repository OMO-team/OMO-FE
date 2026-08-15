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
      // 박스 전체 기준 %가 아니라, 실제로 속한 행(최대 2개, 440px)에서 남는 공간을 flex-1로 직접
      // 채운다. 그래서 2단 컬럼이 스택되는 순간 행에 곧바로 여유가 생기면 전체 화면과 같은 214px로
      // 시작하고, 그 이후 창이 더 좁아질 때만 min-w(160px)까지 줄어든다
      className="h-[143px] max-w-[214px] min-w-[160px] flex-1 relative overflow-hidden rounded-4 bg-cover bg-center block"
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
      {/* left/width는 카드 자체(<a>, position:relative)를 기준으로 한 %값 — 카드 폭이 flex로
          정해지든 min/max로 눌리든 상관없이 항상 카드의 실제 폭에 정확히 비례해 따라간다 */}
      <div className="flex w-[85.981308%] flex-col items-start justify-end absolute left-[7.943925%] bottom-3 gap-1">
        <div className="flex justify-center items-center gap-1 px-2 py-1 rounded-md bg-white/40">
          {/* 재생 아이콘이 카드 정중앙(왼쪽 92px 지점부터)에 고정돼 있어, 뱃지 텍스트 시작
              위치(25px)부터 아이콘과 닿기 전인 67px보다 여유 있게 50px에서 잘라 말줄임표로 보여준다 */}
          <p className="label-03 max-w-[50px] truncate text-gray-700">{displayTag}</p>
        </div>
        {/* 부모(위 div)가 이미 카드의 85.98%로 정확히 맞춰져 있으므로, 여기서는 그 부모를
            100%(w-full)로 채우기만 하면 된다 — 퍼센트를 또 곱하면 카드 대비 실제 폭이 훨씬
            좁아지는 이중 축소 실수가 된다 */}
        <p className="body-04 text-white w-full line-clamp-2">{title}</p>
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
