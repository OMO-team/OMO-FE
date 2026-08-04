import ThumbnailVideo from "./ThumbnailVideo";
import { getYoutubeThumbnailUrl, stripYoutubeSuffix } from "../utils/youtube";
import type { AiReportResource } from "../../../shared/types/cityReport";

interface VlogReviewsProps {
  vlogs: AiReportResource[];
}

export default function VlogReviews({ vlogs }: VlogReviewsProps) {
  const rows: AiReportResource[][] = [];
  for (let i = 0; i < vlogs.length; i += 2) {
    rows.push(vlogs.slice(i, i + 2));
  }

  return (
    <div className="flex flex-col justify-start items-start self-stretch relative gap-4">
      <p className="heading-06 text-black self-stretch">VLOG</p>
      <div className="flex flex-col justify-start items-start self-stretch gap-3">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex justify-start items-center self-stretch relative gap-3"
          >
            {row.map((vlog) => (
              <ThumbnailVideo
                key={`${vlog.topic}-${vlog.url}`}
                tag={stripYoutubeSuffix(vlog.source)}
                title={vlog.title}
                thumbnailUrl={getYoutubeThumbnailUrl(vlog.url)}
                url={vlog.url}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
