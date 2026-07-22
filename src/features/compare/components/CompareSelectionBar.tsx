import { useCompareStore, useCanOpenModal } from "../store/useCompareStore";
import Chip from "../../../shared/components/Chip";
import CompareActionButton from "./CompareActionButton";
import type { CompareCity } from "../../../shared/types/compare";

interface CompareSelectionBarProps {
  cities: CompareCity[];
}

export default function CompareSelectionBar({
  cities,
}: CompareSelectionBarProps) {
  const compareList = useCompareStore((s) => s.compareList);
  const removeFromCompare = useCompareStore((s) => s.removeFromCompare);
  const openModal = useCompareStore((s) => s.openModal);
  const canOpenModal = useCanOpenModal();

  if (compareList.length === 0) return null; // 0개면 바 자체가 안 보임

  const selectedCities = compareList
    .map((id) => cities.find((city) => city.id === id))
    .filter((city): city is CompareCity => Boolean(city));

  return (
    <div className="fixed inset-x-0 bottom-6 z-40 flex justify-center px-4">
      <div className="shadow-01 flex items-center gap-3 rounded-full bg-black px-5 py-3">
        <span className="body-02 whitespace-nowrap text-white">
          {compareList.length}개 비교중
        </span>

        <div className="flex items-center gap-2">
          {selectedCities.map((city) => (
            <Chip
              key={city.id}
              label={city.name}
              variant="dark"
              onRemove={() => removeFromCompare(city.id)}
            />
          ))}
        </div>

        <CompareActionButton
          label={canOpenModal ? "비교하기" : "1개 더 선택"}
          variant={canOpenModal ? "primary" : "dark"}
          disabled={!canOpenModal}
          onClick={openModal}
        />
      </div>
    </div>
  );
}
