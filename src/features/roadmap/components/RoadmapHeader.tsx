import RoadmapMonthSelector from './RoadmapMonthSelector';

type RoadmapHeaderProps = {
  year: number;
  month: number;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  /** true면 이전 달로 못 넘어감 */
  isPrevMonthDisabled?: boolean;
  startDate?: string;
  departureDate?: string;
  onDepartureDateClick?: () => void;
};

export default function RoadmapHeader({
  year,
  month,
  onPrevMonth,
  onNextMonth,
  isPrevMonthDisabled = false,
  startDate = '0000년 00월 00일',
  departureDate = '0000년 00월 00일',
  onDepartureDateClick,
}: RoadmapHeaderProps) {
  return (
    <div className="flex w-full flex-col gap-4 rounded-4 border border-gray-100 bg-white px-6 pb-4 pt-7.5">
      <RoadmapMonthSelector
        year={year}
        month={month}
        onPrevMonth={onPrevMonth}
        onNextMonth={onNextMonth}
        isPrevDisabled={isPrevMonthDisabled}
      />
      <div className="flex items-center gap-2">
        {/* 준비 시작일은 로드맵 생성 시점으로 서버가 정하는 값이라 고를 수 없다 */}
        <p className="title-03 flex items-center gap-2 px-2.5 py-1.5 text-gray-500">준비 시작일 {startDate}</p>
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
