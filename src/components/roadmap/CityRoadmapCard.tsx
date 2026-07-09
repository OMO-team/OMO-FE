import LargeFillButton from '../common/LargeFillButton';
import StarIcon from '../common/StarIcon';
import HeartIcon from '../common/HeartIcon';
import ProgressBar from '../common/ProgressBar';

type CityRoadmapCardProps = {
  cityName: string;
  countryName: string;
  progressPercent: number;
  description: string;
  rating: number;
  isWished?: boolean;
  costProgressPercent: number;
  completedSteps: number;
  totalSteps: number;
  nextSchedule: string;
  imageUrl: string;
  onViewRoadmap?: () => void;
  onToggleWish?: () => void;
};

export default function CityRoadmapCard({
  cityName,
  countryName,
  progressPercent,
  description,
  rating,
  isWished = false,
  costProgressPercent,
  completedSteps,
  totalSteps,
  nextSchedule,
  imageUrl,
  onViewRoadmap,
  onToggleWish,
}: CityRoadmapCardProps) {
  return (
    <div className="flex w-[522px] flex-col overflow-hidden rounded-4 bg-white shadow-02">
      <div
        className="relative h-[306px] bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
        <div className="relative flex items-center justify-between p-6">
          <span className="body-02 flex items-center gap-0.5 rounded-2 bg-black/30 px-3 py-1 text-white">
            <StarIcon size={16} className="text-white" /> {rating}
          </span>
          <button
            type="button"
            onClick={onToggleWish}
            className="size-6"
            aria-label={isWished ? '위시리스트에서 제거' : '위시리스트에 추가'}
          >
            <HeartIcon isWished={isWished} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6 px-9 pb-[30px] pt-[26px]">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="title-01 text-black">{cityName}</span>
            <span className="body-05 rounded-2 bg-gray-100 px-2.5 py-1 text-gray-500">{countryName}</span>
            <span className="body-05 rounded-md bg-primary-50 px-2.5 py-1 text-primary-700">
              진행률 {progressPercent}%
            </span>
          </div>
          <p className="label-01 text-gray-500">{description}</p>
        </div>

        <ProgressBar percent={costProgressPercent} leftLabel="준비 진행률" rightLabel={`${costProgressPercent}%`} />

        <div className="body-04 flex items-center justify-between text-gray-600">
          <span>
            {completedSteps} / {totalSteps} 단계 완료
          </span>
          <span className="title-03 text-primary-600">다음 일정 : {nextSchedule}</span>
        </div>

        <LargeFillButton label="로드맵 보기" onClick={onViewRoadmap} />
      </div>
    </div>
  );
}
