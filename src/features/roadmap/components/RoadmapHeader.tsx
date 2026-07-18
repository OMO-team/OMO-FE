import RoadmapMonthSelector from './RoadmapMonthSelector';

type RoadmapHeaderProps = {
  year: number;
  month: number;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  startDate?: string;
  departureDate?: string;
  onStartDateClick?: () => void;
  onDepartureDateClick?: () => void;
};

export default function RoadmapHeader({
  year,
  month,
  onPrevMonth,
  onNextMonth,
  startDate = '0000년 00월 00일',
  departureDate = '0000년 00월 00일',
  onStartDateClick,
  onDepartureDateClick,
}: RoadmapHeaderProps) {
  return (
    <div className="flex w-153.5 flex-col gap-4 rounded-4 border border-gray-100 bg-white px-6 pb-4 pt-7.5">
      <RoadmapMonthSelector year={year} month={month} onPrevMonth={onPrevMonth} onNextMonth={onNextMonth} />
      <div className="flex items-center">
        <button
          type="button"
          className="title-03 flex items-center gap-2 rounded-2 px-2.5 py-1.5 text-gray-500 transition-colors hover:bg-gray-50"
          onClick={onStartDateClick}
        >
          준비 시작일 {startDate}
        </button>
        <button
          type="button"
          className="title-03 flex items-center gap-2 rounded-2 px-2.5 py-1.5 text-primary-400 transition-colors hover:bg-gray-50"
          onClick={onDepartureDateClick}
        >
          출국 예정일 {departureDate}
        </button>
      </div>
    </div>
  );
}
