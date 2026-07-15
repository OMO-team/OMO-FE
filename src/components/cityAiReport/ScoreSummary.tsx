import StarIcon from "../common/StarIcon";

interface ScoreSummaryProps {
  totalScore: number;
  cityName: string;
  oneLineSummary: string;
}

export default function ScoreSummary({
  totalScore,
  cityName,
  oneLineSummary,
}: ScoreSummaryProps) {
  return (
    <div className="flex flex-col justify-start items-start gap-2">
      <div className="flex justify-center items-center gap-[3px]">
        <StarIcon size={21} className="text-primary-500" />
        <p className="heading-06 text-primary-500">총점 {totalScore}</p>
      </div>
      <div className="flex justify-start items-start relative gap-2">
        <p className="body-01 text-gray-500">{cityName} 한줄 요약</p>
        <p className="body-01 text-primary-900">{oneLineSummary}</p>
      </div>
    </div>
  );
}
