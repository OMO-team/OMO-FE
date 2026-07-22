import { useEffect } from "react";
import { useCompareStore, useCanOpenModal } from "../store/useCompareStore";
import Chip from "../../../shared/components/Chip";
import CompareActionButton from "./CompareActionButton";
import CompareMaxWarning from "./CompareMaxWarning";
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
  const showMaxWarning = useCompareStore((s) => s.showMaxWarning);
  const hideMaxWarning = useCompareStore((s) => s.hideMaxWarning);
  const canOpenModal = useCanOpenModal();

  useEffect(() => {
    if (!showMaxWarning) return;
    const timer = setTimeout(hideMaxWarning, 3000);
    return () => clearTimeout(timer);
  }, [showMaxWarning, hideMaxWarning]);

  if (compareList.length === 0) return null; // 0개면 바 자체가 안 보임

  const selectedCities = compareList
    .map((id) => cities.find((city) => city.id === id))
    .filter((city): city is CompareCity => Boolean(city));

  return (
    <div className="fixed inset-x-0 bottom-6 z-40 flex flex-col items-center gap-2 px-4">
      {showMaxWarning && <CompareMaxWarning />}
      <div className="flex items-center gap-5 overflow-hidden rounded-full bg-primary-900 px-8 py-3 shadow-[4px_8px_16px_0_rgba(6,49,88,0.2)]">
        <div className="flex items-center gap-4">
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
