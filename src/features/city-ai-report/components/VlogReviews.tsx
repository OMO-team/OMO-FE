import ThumbnailVideo from "./ThumbnailVideo";
import { getYoutubeThumbnailUrl, stripYoutubeSuffix } from "../utils/youtube";
import type { AiReportResource } from "../../../shared/types/cityReport";

interface VlogReviewsProps {
  vlogs: AiReportResource[];
}

export default function VlogReviews({ vlogs }: VlogReviewsProps) {
  return (
    <div className="flex flex-col justify-start items-start self-stretch relative gap-4">
      <p className="heading-06 text-black self-stretch">VLOG</p>
      {/* 컬럼이 grow로 넓어지면 영상이 3개까지 들어갈 수 있어, 그리드 자체 폭을 "영상 2개 + 간격"
          (dev 원본 폭 214px*2 + gap 12px)으로 못박아 한 줄에 항상 최대 2개만 들어가게 한다 */}
      <div className="flex max-w-[440px] flex-wrap justify-start items-center self-stretch gap-3">
        {vlogs.map((vlog) => (
          <ThumbnailVideo
            key={`${vlog.topic}-${vlog.url}`}
            tag={stripYoutubeSuffix(vlog.source)}
            title={vlog.title}
            thumbnailUrl={getYoutubeThumbnailUrl(vlog.url)}
            url={vlog.url}
          />
        ))}
      </div>
    </div>
  );
}
