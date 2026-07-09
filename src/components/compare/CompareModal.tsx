import { useCompareStore } from "../../store/useCompareStore";
import CompareMetricLabelColumn from "./CompareMetricLabelColumn";
import CompareCityColumn from "./CompareCityColumn";
import CloseButton from "../common/CloseButton";
import type { CompareCity } from "../../types/compare";

interface CompareModalProps {
  cities: CompareCity[];
  onSelectCity?: (cityId: string) => void;
}

export default function CompareModal({
  cities,
  onSelectCity,
}: CompareModalProps) {
  const compareList = useCompareStore((s) => s.compareList);
  const isModalOpen = useCompareStore((s) => s.isModalOpen);
  const closeModal = useCompareStore((s) => s.closeModal);

  if (!isModalOpen) return null;

  const selectedCities = compareList
    .map((id) => cities.find((city) => city.id === id))
    .filter((city): city is CompareCity => Boolean(city));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={closeModal}
    >
      <div
        className="flex flex-col items-start gap-[60px] rounded-[20px] bg-white px-11 pt-[50px] pb-[60px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex w-full items-center justify-between">
          <p className="heading-05 text-gray-800">도시 비교</p>
          <CloseButton onClick={closeModal} hasBackground={false} />
        </div>

        <div className="flex items-start gap-5">
          <CompareMetricLabelColumn />
          {selectedCities.map((city, index) => (
            <CompareCityColumn
              key={city.id}
              city={city}
              order={index + 1}
              onSelect={() => onSelectCity?.(city.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
