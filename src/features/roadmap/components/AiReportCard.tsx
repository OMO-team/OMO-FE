import StarIcon from '../../../shared/components/StarIcon';

type AiReportCardProps = {
  score: number;
  cityName: string;
  summary: string;
  onViewReport?: () => void;
};

export default function AiReportCard({ score, cityName, summary, onViewReport }: AiReportCardProps) {
  return (
    <div className="flex w-[434px] flex-col gap-[30px] rounded-4 bg-white px-4 py-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="heading-06 flex items-center gap-1 text-primary-500">
            <StarIcon size={28} className="text-primary-500" /> 총점 {score}
          </span>
          <span className="title-02 text-gray-500">{cityName} 한줄 요약</span>
        </div>
        <p className="title-02 text-primary-900">{summary}</p>
      </div>
      <button
        type="button"
        className="title-03 flex h-10 items-center justify-center gap-1 rounded-2 bg-primary-100 text-primary-500"
        onClick={onViewReport}
      >
        AI 리포트 보러가기 〉
      </button>
    </div>
  );
}
