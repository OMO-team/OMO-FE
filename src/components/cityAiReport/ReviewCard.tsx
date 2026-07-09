import StarIcon from "../common/StarIcon";

interface ReviewCardProps {
  authorInitial: string;
  authorName: string;
  rating: number;
  content: string;
}

export default function ReviewCard({
  authorInitial,
  authorName,
  rating,
  content,
}: ReviewCardProps) {
  return (
    <div className="flex flex-col justify-center items-start self-stretch gap-1 px-5 py-3 rounded-3 bg-gray-100">
      <div className="flex flex-col justify-start items-start self-stretch relative gap-1">
        <div className="flex justify-between items-center self-stretch">
          <div className="flex justify-start items-center relative gap-1">
            <div className="w-6 h-6 relative overflow-hidden rounded-full bg-primary-500">
              <p className="absolute left-[7px] top-1 label-03 text-white">
                {authorInitial}
              </p>
            </div>
            <p className="body-05 text-gray-900">{authorName}</p>
          </div>
          <div className="flex justify-center items-center relative">
            <StarIcon size={16} className="size-icon-xs text-gray-500" />
            <p className="body-05 text-gray-600">{rating}</p>
          </div>
        </div>
        <p className="label-01 text-gray-600 self-stretch">{content}</p>
      </div>
    </div>
  );
}
