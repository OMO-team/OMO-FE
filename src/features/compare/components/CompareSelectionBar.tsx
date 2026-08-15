import { useEffect } from "react";
import { useCompareStore, useCanOpenModal } from "../store/useCompareStore";
import Chip from "../../../shared/components/Chip";
import CompareActionButton from "./CompareActionButton";
import CompareMaxWarning from "./CompareMaxWarning";
import { useSyncCompareItems } from "../hooks/useSyncCompareItems";
import type { CompareSelectableCity } from "../types/dto";

interface CompareSelectionBarProps {
  cities: CompareSelectableCity[];
}

export default function CompareSelectionBar({
  cities,
}: CompareSelectionBarProps) {
  const compareList = useCompareStore((s) => s.compareList);
  const cityNames = useCompareStore((s) => s.cityNames);
  const removeFromCompare = useCompareStore((s) => s.removeFromCompare);
  const openModal = useCompareStore((s) => s.openModal);
  const showMaxWarning = useCompareStore((s) => s.showMaxWarning);
  const hideMaxWarning = useCompareStore((s) => s.hideMaxWarning);
  const canOpenModal = useCanOpenModal();

  useSyncCompareItems();

  useEffect(() => {
    if (!showMaxWarning) return;
    const timer = setTimeout(hideMaxWarning, 3000);
    return () => clearTimeout(timer);
  }, [showMaxWarning, hideMaxWarning]);

  if (compareList.length === 0) return null; // 0개면 바 자체가 안 보임

  // 이름은 스토어 캐시를 우선 사용 — 페이지를 이동해 현재 페이지의 cities 목록에
  // 없는 도시라도 칩이 사라지지 않게 함. 캐시에 없을 때만 현재 페이지 목록에서 보완.
  const selectedCities: CompareSelectableCity[] = compareList
    .map((id) => {
      const cityName = cityNames[id] ?? cities.find((city) => city.cityId === id)?.cityName;
      return cityName ? { cityId: id, cityName } : null;
    })
    .filter((city): city is CompareSelectableCity => Boolean(city));

  return (
    <div className="fixed inset-x-0 bottom-6 z-40 flex flex-col items-center gap-2 px-4">
      {showMaxWarning && <CompareMaxWarning />}
      <div className="flex max-w-[calc(100vw-2rem)] items-center gap-[clamp(12px,3vw,20px)] overflow-hidden rounded-full bg-primary-900 px-[clamp(16px,6vw,32px)] py-3 shadow-[4px_8px_16px_0_rgba(6,49,88,0.2)]">
        <div className="flex min-w-0 items-center gap-[clamp(8px,2vw,16px)]">
          <span className="body-02 shrink-0 whitespace-nowrap text-white">
            {compareList.length}개 비교중
          </span>

          {/* 도시 이름이 길거나 3개가 다 선택돼 칩이 다 안 들어가면, 바 전체가 넘치는 대신 이 영역만 가로 스크롤 */}
          {/* 네이티브 스크롤바는 브라우저/OS마다 차지하는 높이가 달라 위아래 여백이 비대칭으로 보이므로 숨기고, 스크롤 동작만 유지 */}
          <div className="scrollbar-hide flex min-w-0 items-center gap-2 overflow-x-auto">
            {selectedCities.map((city) => (
              <Chip
                key={city.cityId}
                label={city.cityName}
                variant="dark"
                className="shrink-0"
                onRemove={() => removeFromCompare(city.cityId)}
              />
            ))}
          </div>
        </div>

        <CompareActionButton
          label={canOpenModal ? "비교하기" : "1개 더 선택"}
          variant={canOpenModal ? "primary" : "dark"}
          disabled={!canOpenModal}
          onClick={openModal}
          className="shrink-0"
        />
      </div>
    </div>
  );
}
