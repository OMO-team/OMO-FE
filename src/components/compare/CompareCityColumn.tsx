import CompareRatingRow from "./CompareRatingRow";
import CompareMetricValue from "./CompareMetricValue";
import CompareActionButton from "./CompareActionButton";
import type { CompareCity } from "../../types/compare";

interface CompareCityColumnProps {
  city: CompareCity;
  order: number;
  onSelect: () => void;
}

export default function CompareCityColumn({
  city,
  order,
  onSelect,
}: CompareCityColumnProps) {
  return (
    <div className="flex w-[257px] flex-col items-center gap-[42px]">
      <div className="flex w-full flex-col items-start gap-6">
        <div className="flex w-[254px] flex-col gap-3">
          <div className="relative h-[230px] w-full overflow-hidden rounded-3">
            <img
              src={city.imageUrl}
              alt={city.name}
              className="h-full w-full object-cover"
            />
            <span className="label-02 absolute left-3 top-3 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-white text-gray-500">
              {order}
            </span>
          </div>
          <div className="flex flex-col gap-1.5 px-4">
            <span className="label-01 w-fit rounded-2 bg-gray-100 px-2.5 py-1 text-gray-500">
              {city.countryName}
            </span>
            <p className="title-01 text-gray-900">{city.name}</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-5 px-4">
          <CompareRatingRow rating={city.rating} />
          <CompareMetricValue
            value={city.monthlyCost}
            percent={city.costPercent}
            color="gray"
          />
          {city.keyMetrics.map((metric) => (
            <CompareMetricValue
              key={metric.id}
              value={`${metric.percentage}%`}
              percent={metric.percentage}
              color={metric.barColor}
            />
          ))}
        </div>
      </div>

      <CompareActionButton
        label="선택하기"
        variant="primary"
        onClick={onSelect}
        className="w-full"
      />
    </div>
  );
}
