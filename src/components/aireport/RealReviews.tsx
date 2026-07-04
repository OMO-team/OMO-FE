import ReviewCard from "./ReviewCard";
import type { ReviewItem } from "../types/cityReport";

interface RealReviewsProps {
  reviews: ReviewItem[];
}

export default function RealReviews({ reviews }: RealReviewsProps) {
  return (
    <div className="flex flex-col justify-start items-start self-stretch relative gap-4">
      <p className="heading-06 text-black self-stretch">실제 후기</p>
      <div className="flex flex-col justify-start items-start self-stretch gap-3">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            authorInitial={review.authorInitial}
            authorName={review.authorName}
            rating={review.rating}
            content={review.content}
          />
        ))}
      </div>
    </div>
  );
}
