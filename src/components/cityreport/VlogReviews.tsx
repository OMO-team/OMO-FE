import ThumbnailVideo from "./ThumbnailVideo";
import type { VlogItem } from "./types/cityReport";

interface VlogReviewsProps {
  vlogs: VlogItem[];
}

export default function VlogReviews({ vlogs }: VlogReviewsProps) {
  const rows: VlogItem[][] = [];
  for (let i = 0; i < vlogs.length; i += 2) {
    rows.push(vlogs.slice(i, i + 2));
  }

  return (
    <div className="flex flex-col justify-start items-start self-stretch relative gap-4">
      <p className="heading-06 text-black self-stretch">VLOG &amp; 후기</p>
      <div className="flex flex-col justify-start items-start self-stretch gap-3">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex justify-start items-center self-stretch relative gap-3"
          >
            {row.map((vlog) => (
              <ThumbnailVideo
                key={vlog.id}
                tag={vlog.tag}
                title={vlog.title}
                thumbnailUrl={vlog.thumbnailUrl}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
