import CompareRatingRow from "./CompareRatingRow";
import CompareMetricValue from "./CompareMetricValue";
import CompareActionButton from "./CompareActionButton";
import { getCompareRows } from "../utils/compareStats";
import type { CompareCityHeader, CompareStatGroup } from "../types/dto";

interface CompareCityColumnProps {
  city: CompareCityHeader;
  stats: CompareStatGroup[];
  order: number;
  onSelect: () => void;
}

export default function CompareCityColumn({
  city,
  stats,
  order,
  onSelect,
}: CompareCityColumnProps) {
  const rows = getCompareRows(stats, city.cityId);

  return (
    <div className="flex w-[257px] flex-col items-center gap-[42px]">
      <div className="flex w-full flex-col items-start gap-6">
        <div className="flex w-[254px] flex-col gap-3">
          <div className="relative h-[230px] w-full overflow-hidden rounded-3">
            <img
              src={city.imageUrl}
              alt={city.cityName}
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
            <p className="title-01 text-gray-900">{city.cityName}</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-5 px-4">
          <CompareRatingRow rating={city.rating} />
          {rows.map((row) => (
            <CompareMetricValue
              key={row.statType}
              value={row.displayValue}
              percent={row.percent}
              color={row.statType === "COST" ? "gray" : "gradient"}
              isBest={row.isBest}
            />
          ))}
        </div>
      </div>

      <CompareActionButton
        label="선택하기"
        variant="primary"
        shape="rounded"
        onClick={onSelect}
        className="w-full"
      />
    </div>
  );
}
