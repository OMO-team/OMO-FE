import ChevronLeftIcon from '../../../shared/components/icons/ChevronLeftIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';
import InfoCircleIcon from './icons/InfoCircleIcon';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

type DatePickerModalProps = {
  mode: 'day' | 'month';
  year: number;
  month: number;
  selectedDay?: number;
  selectedMonth?: number;
  /** 있으면 달력 위에 빨간 경고 pill 표시 (예: "출국 예정일은 오늘 이후 날짜로 선택해 주세요") */
  warningMessage?: string;
  /**
   * 이 날짜보다 이른 날은 아예 고를 수 없게 막는다.
   * 출국 예정일처럼 지난 날짜를 넣으면 안 되는 경우에 오늘 날짜를 넘긴다.
   */
  minDate?: { year: number; month: number; day: number };
  onModeToggle?: () => void;
  onSelectDay?: (day: number) => void;
  onSelectMonth?: (month: number) => void;
  onYearPrev?: () => void;
  onYearNext?: () => void;
  onClose?: () => void;
};

function getCalendarWeeks(year: number, month: number) {
  const firstWeekday = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

/** 두 날짜를 비교해 a가 b보다 이르면 음수 — 연/월/일 순으로 자리수를 붙여 한 번에 비교한다 */
function toComparable(year: number, month: number, day: number) {
  return year * 10000 + month * 100 + day;
}

export default function DatePickerModal({
  mode,
  year,
  month,
  selectedDay,
  selectedMonth,
  warningMessage,
  minDate,
  onModeToggle,
  onSelectDay,
  onSelectMonth,
  onYearPrev,
  onYearNext,
  onClose,
}: DatePickerModalProps) {
  return (
    <div className="flex w-[386px] flex-col items-center rounded-4 border border-gray-100 bg-white px-8 pb-[30px] pt-5 shadow-02">
      {warningMessage && (
        <div className="mb-3 flex h-9.5 w-full items-center gap-2 rounded-full bg-red-50 py-2 pl-5 pr-6 text-red-700">
          <InfoCircleIcon className="size-icon-sm shrink-0" />
          <p className="body-03 whitespace-nowrap">{warningMessage}</p>
        </div>
      )}
      <div className="flex w-full items-center justify-between pb-[30px] pt-3">
        <button type="button" className="title-01 flex items-center gap-0.5 text-gray-900" onClick={onModeToggle}>
          <span>
            {year}년 {String(month).padStart(2, '0')}월
          </span>
          <ChevronDownIcon className={`size-icon-sm ${mode === 'day' ? '-rotate-90' : 'rotate-0'}`} />
        </button>
        <button
          type="button"
          className="flex size-icon-lg items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-50"
          onClick={onClose}
          aria-label="닫기"
        >
          <svg viewBox="0 0 24 24" fill="none" className="size-icon-md" aria-hidden>
            <path d="M19 5L5 19M5 5L19 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {mode === 'day' ? (
        <div className="flex w-full flex-col items-start">
          <div className="flex w-full items-center">
            {WEEKDAYS.map((day) => (
              <span key={day} className="body-04 flex size-[30px] items-center justify-center text-gray-700">
                {day}
              </span>
            ))}
          </div>
          {getCalendarWeeks(year, month).map((week, i) => (
            <div key={i} className="flex w-full items-center">
              {week.map((day, j) => {
                const isBeforeMin =
                  day !== null && minDate !== undefined &&
                  toComparable(year, month, day) < toComparable(minDate.year, minDate.month, minDate.day);
                /**
                 * minDate를 준 화면은 그 기준만 따른다 — 이미 잡힌 날짜보다 이르다고 막아버리면
                 * 출국일을 앞당기는 것 자체가 불가능해진다.
                 * minDate가 없을 때만 "선택한 날짜 이전"을 막는다(같은 달 안에서만 판단).
                 */
                const isBeforeSelected =
                  minDate === undefined && day !== null && selectedDay !== undefined && day < selectedDay;
                const isDisabled = day === null || isBeforeSelected || isBeforeMin;
                return (
                  <button
                    key={j}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => day && onSelectDay?.(day)}
                    className={`body-04 flex size-[30px] items-center justify-center rounded-full transition-colors ${
                      day === selectedDay
                        ? 'bg-primary-100 text-primary-600'
                        : isBeforeSelected || isBeforeMin
                          ? 'cursor-not-allowed text-gray-300'
                          : 'text-gray-700 not-disabled:hover:bg-gray-50'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-10">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onYearPrev}
              aria-label="이전 해"
              // 고를 수 있는 최소 연도보다 더 뒤로는 넘길 수 없게 막는다
              disabled={minDate !== undefined && year <= minDate.year}
              className="rounded-full p-1 text-gray-700 transition-colors not-disabled:hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-300"
            >
              <ChevronLeftIcon className="size-icon-sm" />
            </button>
            <span className="heading-05 text-primary-500">{year}년</span>
            <button
              type="button"
              onClick={onYearNext}
              aria-label="다음 해"
              className="rounded-full p-1 text-gray-700 transition-colors hover:bg-gray-50"
            >
              <ChevronLeftIcon className="size-icon-sm rotate-180" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {MONTHS.map((m) => {
              // 그 달의 마지막 날까지 전부 지났으면 달째로 고를 수 없다
              const lastDayOfMonth = new Date(year, m, 0).getDate();
              const isBeforeMin =
                minDate !== undefined &&
                toComparable(year, m, lastDayOfMonth) < toComparable(minDate.year, minDate.month, minDate.day);
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => onSelectMonth?.(m)}
                  disabled={isBeforeMin}
                  className={`body-04 flex h-[34px] w-[66px] items-center justify-center rounded-full shadow-02 transition-colors ${
                    m === selectedMonth
                      ? 'bg-primary-500 text-white'
                      : isBeforeMin
                        ? 'cursor-not-allowed bg-gray-50 text-gray-300'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {String(m).padStart(2, '0')}월
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
