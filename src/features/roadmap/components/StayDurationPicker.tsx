import MinusStepperIcon from './icons/MinusStepperIcon';
import PlusStepperIcon from './icons/PlusStepperIcon';

type StayDurationPickerProps = {
  months: number;
  onChange?: (months: number) => void;
  min?: number;
  max?: number;
};

const PRESETS = [3, 6, 9, 12];

/** 프리셋의 마지막 값이 곧 상한 — 프리셋에 없는 기간을 스테퍼로만 넘어갈 수 있으면 안 된다 */
const MAX_MONTHS = PRESETS[PRESETS.length - 1];

export default function StayDurationPicker({ months, onChange, min = 1, max = MAX_MONTHS }: StayDurationPickerProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <span className="body-02 text-gray-700">체류 기간</span>

      {/* 체류 기간은 언제든 바뀔 수 있는 값이라, 하나를 고른 뒤에도 다른 기간을 바로 누를 수 있게 둔다 */}
      <div className="flex w-full items-center justify-center gap-2">
        {PRESETS.map((preset) => {
          const isSelected = preset === months;
          return (
            <button
              key={preset}
              type="button"
              onClick={() => onChange?.(preset)}
              className={`body-02 rounded-2 px-5.5 py-2 transition-colors ${
                isSelected ? 'bg-primary-500 text-white' : 'bg-gray-50 text-gray-800 hover:bg-gray-100'
              }`}
            >
              {preset}개월
            </button>
          );
        })}
      </div>

      <div className="flex w-full items-center justify-center gap-1 rounded-2 bg-gray-20 px-4 py-3">
        <button
          type="button"
          onClick={() => onChange?.(Math.max(min, months - 1))}
          disabled={months <= min}
          aria-label="체류 기간 줄이기"
          className="disabled:opacity-50"
        >
          <MinusStepperIcon className="size-icon-sm" />
        </button>
        <span className="flex flex-1 items-end justify-center gap-0.5 text-gray-900">
          <span className="title-02">{months}</span>
          <span className="body-02">개월</span>
        </span>
        <button
          type="button"
          onClick={() => onChange?.(Math.min(max, months + 1))}
          disabled={months >= max}
          aria-label="체류 기간 늘리기"
          className="disabled:opacity-50"
        >
          <PlusStepperIcon className="size-icon-sm" />
        </button>
      </div>
    </div>
  );
}
