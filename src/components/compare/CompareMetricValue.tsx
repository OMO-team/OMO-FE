import ProgressBar from "../common/ProgressBar";

interface CompareMetricValueProps {
  value: string; // "180만원" 또는 "85%"
  percent: number;
  color?: "gray" | "gradient";
}

export default function CompareMetricValue({
  value,
  percent,
  color = "gradient",
}: CompareMetricValueProps) {
  return (
    <div className="flex h-[52px] w-[222px] flex-col items-end gap-1">
      <p className="body-04 text-right text-gray-800">{value}</p>
      <div className="flex w-full flex-col gap-1">
        <div className="flex justify-between">
          <span className="label-01 text-gray-500">낮음</span>
          <span className="label-01 text-gray-500">높음</span>
        </div>
        <ProgressBar percent={percent} color={color} />
      </div>
    </div>
  );
}
