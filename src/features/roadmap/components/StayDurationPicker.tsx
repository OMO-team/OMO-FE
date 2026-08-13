import MinusStepperIcon from './icons/MinusStepperIcon';
import PlusStepperIcon from './icons/PlusStepperIcon';

type StayDurationPickerProps = {
  months: number;
  onChange?: (months: number) => void;
  min?: number;
  max?: number;
  /**
   * 체류 기간을 한 번이라도 정했는지. 아직 안 정했으면 프리셋을 고르는 단계라 네 개 다 누를 수 있고,
   * 정한 뒤에는 프리셋이 잠기고 스테퍼로만 조정한다.
   */
  hasChosen?: boolean;
};

const PRESETS = [3, 6, 9, 12];

/** 프리셋의 마지막 값이 곧 상한 — 프리셋에 없는 기간을 스테퍼로만 넘어갈 수 있으면 안 된다 */
const MAX_MONTHS = PRESETS[PRESETS.length - 1];

/** 아직 아무것도 안 정했을 때 보여줄 기본 기간 */
export const DEFAULT_STAY_MONTHS = MAX_MONTHS;

export default function StayDurationPicker({
  months,
  onChange,
  min = 1,
  max = MAX_MONTHS,
  hasChosen = false,
}: StayDurationPickerProps) {
  /** 스테퍼로 조정해 프리셋에서 벗어난 값 — 스테퍼를 파랗게 해서 직접 정한 기간임을 알린다 */
  const isCustomMonths = hasChosen && !PRESETS.includes(months);

  return (
    <div className="flex w-full flex-col gap-2">
      <span className="body-02 text-gray-700">체류 기간</span>

      <div className="flex w-full items-center justify-center gap-2">
        {PRESETS.map((preset) => {
          const isSelected = hasChosen && preset === months;
          return (
            <button
              key={preset}
              type="button"
              onClick={() => onChange?.(preset)}
              // 한 번 정한 뒤에는 프리셋을 바꿀 수 없고 스테퍼로만 조정한다
              disabled={hasChosen}
              aria-pressed={isSelected}
              className={`body-02 rounded-2 px-5.5 py-2 transition-colors ${
                isSelected
                  ? 'bg-primary-500 text-white'
                  : hasChosen
                    ? 'bg-gray-20 text-gray-400'
                    : // 아직 고르기 전 — 스테퍼에 떠 있는 기본값만 배경을 살짝 진하게 둔다
                      `text-gray-800 hover:bg-gray-100 ${preset === months ? 'bg-gray-50' : 'bg-gray-20'}`
              }`}
            >
              {preset}개월
            </button>
          );
        })}
      </div>

      <div
        className={`flex w-full items-center justify-center gap-1 rounded-2 px-4 py-3 transition-colors ${
          isCustomMonths ? 'bg-primary-50' : 'bg-gray-20'
        }`}
      >
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
