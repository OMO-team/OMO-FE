import LargeFillButton from '../../../shared/components/LargeFillButton';
import StarIcon from '../../../shared/components/StarIcon';
import HeartIcon from '../../../shared/components/HeartIcon';
import ProgressBar from '../../../shared/components/ProgressBar';
import TrashIcon from './icons/TrashIcon';
import InfoCircleIcon from './icons/InfoCircleIcon';

type CityRoadmapCardProps = {
  cityName: string;
  countryName: string;
  /** RoadmapDetail의 CityHeroBanner 등 다른 화면에서 사용, 이 카드 자체에는 표시하지 않음 */
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
  onDelete?: () => void;
};

export default function CityRoadmapCard({
  cityName,
  countryName,
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
  onDelete,
}: CityRoadmapCardProps) {
  return (
    <div className="flex w-130.5 flex-col overflow-hidden rounded-4 border-2 border-transparent bg-white shadow-02 transition-colors hover:border-primary-500 hover:bg-gray-20 hover:shadow-[0px_5px_16px_0px_rgba(21,93,252,0.2)]">
      <div
        className="relative h-62.5 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-black/20 to-transparent" />
        <div className="relative flex items-center justify-between px-6 pt-6">
          <span className="body-02 flex items-center gap-0.5 rounded-2 bg-primary-900/30 py-1 pl-2.5 pr-3 text-white">
            <StarIcon size={16} className="text-white" /> {rating}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleWish}
              className="size-6"
              aria-label={isWished ? '위시리스트에서 제거' : '위시리스트에 추가'}
            >
              <HeartIcon isWished={isWished} />
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="size-6 text-white"
              aria-label="로드맵 삭제"
            >
              <TrashIcon className="size-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5 px-9 pb-7.5 pt-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="title-01 text-black">{cityName}</span>
              <span className="body-05 rounded-2 bg-gray-100 px-2.5 py-1 text-gray-500">{countryName}</span>
            </div>
            <p className="label-01 text-gray-500">{description}</p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="title-05 text-gray-800">준비 진행률</span>
              <span className="heading-06 text-primary-500">{costProgressPercent}%</span>
            </div>
            <ProgressBar percent={costProgressPercent} trackClassName="h-1.5" />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="body-04 flex items-center gap-0.5 text-gray-600">
              <InfoCircleIcon className="size-icon-sm text-primary-500" />
              {completedSteps} / {totalSteps} 단계 완료
            </span>
            <span className="title-03 text-primary-600">다음 일정 : {nextSchedule}</span>
          </div>

          <LargeFillButton label="로드맵 보기" onClick={onViewRoadmap} />
        </div>
      </div>
    </div>
  );
}
