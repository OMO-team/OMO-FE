import StarIcon from "../common/StarIcon";

interface CompareRatingRowProps {
  rating: number;
}

export default function CompareRatingRow({ rating }: CompareRatingRowProps) {
  const filledStars = Math.round(rating);

  return (
    <div className="flex h-[52px] w-[222px] items-center gap-2">
      <span className="heading-06 text-primary-500">
        총점 {rating.toFixed(1)}
      </span>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <StarIcon
            key={i}
            size={21}
            className={i < filledStars ? "text-primary-500" : "text-gray-100"}
          />
        ))}
      </div>
    </div>
  );
}
