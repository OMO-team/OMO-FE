import { useCompareStore } from "../store/useCompareStore";
import { useCompareCities } from "../hooks/useCompareCities";
import CompareMetricLabelColumn from "./CompareMetricLabelColumn";
import CompareCityColumn from "./CompareCityColumn";
import CloseButton from "../../../shared/components/CloseButton";

interface CompareModalProps {
  onSelectCity?: (cityId: number) => void;
}

export default function CompareModal({ onSelectCity }: CompareModalProps) {
  const compareList = useCompareStore((s) => s.compareList);
  const isModalOpen = useCompareStore((s) => s.isModalOpen);
  const closeModal = useCompareStore((s) => s.closeModal);
  const resetCompare = useCompareStore((s) => s.resetCompare);
  const { data, isLoading, isError } = useCompareCities(compareList);

  if (!isModalOpen) return null;

  const sortedCities = data ? [...data.cities].sort((a, b) => b.rating - a.rating) : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={closeModal}
    >
      <div
        // 콘텐츠가 뷰포트보다 길어도 모달 자체는 뷰포트 안에 들어오게 하고, 넘치는 부분만 내부에서 스크롤
        // (X 버튼이 항상 보이는 헤더 영역 밖으로 밀려나지 않게 하기 위함)
        className="flex max-h-[90vh] flex-col items-start gap-10 rounded-[20px] bg-white pl-[46px] pr-[50px] pt-[50px] pb-[60px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex w-full items-center justify-between">
          <p className="heading-05 text-gray-800">도시 비교</p>
          <CloseButton onClick={resetCompare} hasBackground={false} />
        </div>

        <div className="w-full overflow-y-auto">
          {isLoading && <p className="body-02 text-gray-500">불러오는 중...</p>}
          {isError && <p className="body-02 text-red-500">비교 정보를 가져오지 못했어요.</p>}

          {data && (
            <div className="flex items-start gap-5">
              <CompareMetricLabelColumn />
              {sortedCities.map((city, index) => (
                <CompareCityColumn
                  key={city.cityId}
                  city={city}
                  stats={data.stats}
                  order={index + 1}
                  onSelect={() => onSelectCity?.(city.cityId)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
