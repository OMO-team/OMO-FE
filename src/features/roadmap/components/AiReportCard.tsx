import StarIcon from '../../../shared/components/StarIcon';
import chevronRight from '../../../assets/icons/icon-chevron-right-blue.svg';

type AiReportCardProps = {
  /** 도시 카탈로그의 rating을 그대로 받는다 — 5점 만점 */
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
            <StarIcon size={28} className="text-primary-500" /> 총점 {score}/5
          </span>
          <span className="title-02 text-gray-500">{cityName} 한줄 요약</span>
        </div>
        <p className="title-02 text-primary-900">{summary}</p>
      </div>
      <button
        type="button"
        // hover 배경(#a6d5ff)은 primary-100과 200 사이 값이라 대응하는 프로젝트 토큰이 없어 그대로 씀
        className="title-03 flex h-10 items-center justify-center gap-1 rounded-2 bg-primary-100 px-3 py-1.5 text-primary-500 transition-colors hover:bg-[#a6d5ff]"
        onClick={onViewReport}
      >
        AI 리포트 보러가기
        <span className="flex size-4 items-center justify-center">
          <img src={chevronRight} alt="" className="h-2.5 w-1.25" />
        </span>
      </button>
    </div>
  );
}
