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
      <div className="flex flex-wrap justify-start items-center self-stretch gap-3">
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
