import ChevronLeftIcon from './icons/ChevronLeftIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

type DatePickerModalProps = {
  mode: 'day' | 'month';
  year: number;
  month: number;
  selectedDay?: number;
  selectedMonth?: number;
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

export default function DatePickerModal({
  mode,
  year,
  month,
  selectedDay,
  selectedMonth,
  onModeToggle,
  onSelectDay,
  onSelectMonth,
  onYearPrev,
  onYearNext,
  onClose,
}: DatePickerModalProps) {
  return (
    <div className="flex w-[386px] flex-col items-center rounded-4 border border-gray-100 bg-white px-8 pb-[30px] pt-5 shadow-02">
      <div className="flex w-full items-center justify-between pb-[30px] pt-3">
        <button type="button" className="title-01 flex items-center gap-0.5 text-gray-900" onClick={onModeToggle}>
          <span>
            {year}년 {String(month).padStart(2, '0')}월
          </span>
          <ChevronDownIcon className={`size-icon-sm ${mode === 'day' ? '-rotate-90' : 'rotate-0'}`} />
        </button>
        <button
          type="button"
          className="flex size-icon-lg items-center justify-center rounded-full text-gray-700"
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
              {week.map((day, j) => (
                <button
                  key={j}
                  type="button"
                  disabled={day === null}
                  onClick={() => day && onSelectDay?.(day)}
                  className={`body-04 flex size-[30px] items-center justify-center rounded-full ${
                    day === selectedDay ? 'bg-primary-100 text-primary-600' : 'text-gray-700'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-10">
          <div className="flex items-center gap-2">
            <button type="button" onClick={onYearPrev} aria-label="이전 해">
              <ChevronLeftIcon className="size-icon-sm" />
            </button>
            <span className="heading-05 text-primary-500">{year}년</span>
            <button type="button" onClick={onYearNext} aria-label="다음 해">
              <ChevronLeftIcon className="size-icon-sm rotate-180" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {MONTHS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => onSelectMonth?.(m)}
                className={`body-04 flex h-[34px] w-[66px] items-center justify-center rounded-full shadow-02 ${
                  m === selectedMonth ? 'bg-primary-500 text-white' : 'bg-gray-50 text-gray-600'
                }`}
              >
                {String(m).padStart(2, '0')}월
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
