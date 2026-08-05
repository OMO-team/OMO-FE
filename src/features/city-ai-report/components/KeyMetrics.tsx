import ProgressBar from "../../../shared/components/ProgressBar";
import type { KeyMetricItem } from "../../../shared/types/cityReport";

interface KeyMetricsProps {
  metrics: KeyMetricItem[];
}

export default function KeyMetrics({ metrics }: KeyMetricsProps) {
  return (
    <div className="flex flex-col justify-start items-start self-stretch relative gap-7">
      <p className="heading-06 text-black self-stretch">주요 지표</p>
      <div className="flex flex-col justify-start items-start self-stretch gap-2.5">
        {metrics.map((metric) => (
          <ProgressBar
            key={metric.id}
            percent={metric.percentage}
            leftLabel={metric.label}
            rightLabel={`${metric.percentage}%`}
            color={metric.barColor}
          />
        ))}
      </div>
    </div>
  );
}
