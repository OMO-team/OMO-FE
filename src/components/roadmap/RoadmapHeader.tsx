import CalendarIcon from './CalendarIcon';
import RoadmapMonthSelector from './RoadmapMonthSelector';

type RoadmapHeaderProps = {
  year: number;
  month: number;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  departureDate?: string;
  onDepartureDateClick?: () => void;
};

export default function RoadmapHeader({
  year,
  month,
  onPrevMonth,
  onNextMonth,
  departureDate = '0000년 00월 00일',
  onDepartureDateClick,
}: RoadmapHeaderProps) {
  return (
    <div className="flex w-[614px] flex-col gap-2 rounded-4 border border-gray-100 bg-white px-6 py-5">
      <RoadmapMonthSelector year={year} month={month} onPrevMonth={onPrevMonth} onNextMonth={onNextMonth} />
      <button
        type="button"
        className="title-03 flex w-fit items-center gap-2 rounded-2 px-3 py-2 text-primary-400"
        onClick={onDepartureDateClick}
      >
        <CalendarIcon className="size-icon-sm" />
        출국 예정일 {departureDate}
      </button>
    </div>
  );
}
