import ProgressBar from "../../../shared/components/ProgressBar";

interface CompareMetricValueProps {
  value: string; // "180만원" 또는 "85%"
  percent: number | null; // null이면 기준치가 없는 지표라 막대 없이 값만 표시
  color?: "gray" | "gradient";
  isBest?: boolean;
}

export default function CompareMetricValue({
  value,
  percent,
  color = "gradient",
  isBest = false,
}: CompareMetricValueProps) {
  return (
    <div className="flex h-[52px] w-[222px] flex-col items-end gap-1">
      <p className={`body-04 text-right ${isBest ? "font-bold text-primary-600" : "text-gray-800"}`}>
        {value}
      </p>
      {percent !== null && (
        <div className="flex w-full flex-col gap-1">
          <div className="flex justify-between">
            <span className="label-01 text-gray-500">낮음</span>
            <span className="label-01 text-gray-500">높음</span>
          </div>
          <ProgressBar percent={percent} color={color} />
        </div>
      )}
    </div>
  );
}
