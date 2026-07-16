import ChevronLeftIcon from '../../../shared/components/ChevronLeftIcon';
import RoadmapTitleIcon from './icons/RoadmapTitleIcon';

type RoadmapMonthSelectorProps = {
  title?: string;
  year: number;
  month: number;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
};

export default function RoadmapMonthSelector({
  title = '로드맵',
  year,
  month,
  onPrevMonth,
  onNextMonth,
}: RoadmapMonthSelectorProps) {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-2">
        <RoadmapTitleIcon className="size-icon-md text-black" />
        <p className="heading-06 text-black">{title}</p>
      </div>
      <div className="title-01 flex items-center gap-4 text-black">
        <button type="button" onClick={onPrevMonth} aria-label="이전 달">
          <ChevronLeftIcon className="size-icon-md" />
        </button>
        <span>
          {year}년 {String(month).padStart(2, '0')}월
        </span>
        <button type="button" onClick={onNextMonth} aria-label="다음 달">
          <ChevronLeftIcon className="size-icon-md rotate-180" />
        </button>
      </div>
    </div>
  );
}
