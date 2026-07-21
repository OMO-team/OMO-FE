import { useEffect } from "react";
import { useCompareStore, useCanOpenModal } from "../store/useCompareStore";
import Chip from "../../../shared/components/Chip";
import AlertCircleIcon from "../../../shared/components/AlertCircleIcon";
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
  const isMaxWarningVisible = useCompareStore((s) => s.isMaxWarningVisible);
  const dismissMaxWarning = useCompareStore((s) => s.dismissMaxWarning);

  useEffect(() => {
    if (!isMaxWarningVisible) return;
    const timer = setTimeout(dismissMaxWarning, 2500);
    return () => clearTimeout(timer);
  }, [isMaxWarningVisible, dismissMaxWarning]);

  if (compareList.length === 0) return null; // 0개면 바 자체가 안 보임

  const selectedCities = compareList
    .map((id) => cities.find((city) => city.id === id))
    .filter((city): city is CompareCity => Boolean(city));

  return (
    <div className="fixed inset-x-0 bottom-6 z-40 flex flex-col items-center gap-2 px-4">
      {isMaxWarningVisible && (
        <div className="shadow-01 flex items-center gap-1.5 rounded-full border border-[#FF5241]/20 bg-[#FFE3E0] px-4 py-2">
          <AlertCircleIcon className="size-icon-sm shrink-0" />
          <span className="body-04 whitespace-nowrap text-[#FF5241]">최대 3개까지 비교할 수 있어요.</span>
        </div>
      )}

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
