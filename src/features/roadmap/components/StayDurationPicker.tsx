import MinusStepperIcon from './icons/MinusStepperIcon';
import PlusStepperIcon from './icons/PlusStepperIcon';

type StayDurationPickerProps = {
  months: number;
  onChange?: (months: number) => void;
  min?: number;
  max?: number;
};

const PRESETS = [3, 6, 9, 12];

export default function StayDurationPicker({ months, onChange, min = 1, max = 24 }: StayDurationPickerProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <span className="body-02 text-gray-700">체류 기간</span>

      <div className="flex w-full items-center justify-center gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => onChange?.(preset)}
            className={`body-02 rounded-2 px-5.5 py-2 ${
              preset === months ? 'bg-primary-500 text-white' : 'bg-gray-20 text-gray-400'
            }`}
          >
            {preset}개월
          </button>
        ))}
      </div>

      <div className="flex w-full items-center justify-center gap-1 rounded-2 bg-gray-20 px-4 py-3">
        <button type="button" onClick={() => onChange?.(Math.max(min, months - 1))} aria-label="체류 기간 줄이기">
          <MinusStepperIcon className="size-icon-sm" />
        </button>
        <span className="flex flex-1 items-end justify-center gap-0.5 text-gray-900">
          <span className="title-02">{months}</span>
          <span className="body-02">개월</span>
        </span>
        <button type="button" onClick={() => onChange?.(Math.min(max, months + 1))} aria-label="체류 기간 늘리기">
          <PlusStepperIcon className="size-icon-sm" />
        </button>
      </div>
    </div>
  );
}
