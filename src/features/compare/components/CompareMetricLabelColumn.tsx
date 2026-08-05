import { STAT_ORDER, STAT_LABEL } from '../utils/compareStats';

const METRIC_LABELS = ['평점', ...STAT_ORDER.map((type) => STAT_LABEL[type])];

export default function CompareMetricLabelColumn() {
  return (
    <div className="flex w-[60px] flex-col gap-5 pt-[324px]">
      {METRIC_LABELS.map((label) => (
        <div key={label} className="flex h-[52px] items-center p-1">
          <p className="body-01 text-black">{label}</p>
        </div>
      ))}
    </div>
  );
}
