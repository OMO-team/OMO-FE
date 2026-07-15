type StayDurationSliderProps = {
  months: number;
  onChange?: (months: number) => void;
  min?: number;
  max?: number;
};

export default function StayDurationSlider({ months, onChange, min = 1, max = 24 }: StayDurationSliderProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="body-02 text-gray-700">체류 기간</span>
        <span className="title-02 text-primary-500">{months}개월</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={months}
        onChange={(e) => onChange?.(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-100 accent-primary-500"
        aria-label="체류 기간 (개월)"
      />
      <div className="flex items-center justify-between">
        <span className="label-01 text-gray-500">{min}개월</span>
        <span className="label-01 text-gray-500">{max}개월</span>
      </div>
    </div>
  );
}
