import CompareSelectionBar from "./components/compare/CompareSelectionBar";
import CompareModal from "./components/compare/CompareModal";
import { mockCities } from "./mocks/cities";
import { useCompareStore, useIsMaxReached } from "./store/useCompareStore";

// 추천 도시 화면이 아직 없어서, 카드의 "비교함에 담기" 버튼 역할을 임시로 대신하는 컴포넌트
// 추천 도시 화면 완성되면 이 컴포넌트는 삭제하고 실제 카드에서 toggleCompare 호출하면 됨
function CompareTestButtons() {
  const compareList = useCompareStore((s) => s.compareList);
  const toggleCompare = useCompareStore((s) => s.toggleCompare);
  const isMaxReached = useIsMaxReached();

  return (
    <div className="flex flex-col gap-3 p-6">
      <p className="body-02 text-gray-500">
        추천 도시 화면 완성 전 임시 테스트용 버튼입니다.
      </p>
      {mockCities.map((city) => {
        const isSelected = compareList.includes(city.id);
        return (
          <button
            key={city.id}
            onClick={() => toggleCompare(city.id)}
            disabled={!isSelected && isMaxReached}
            className={`title-03 rounded-2 border px-4 py-2 text-left disabled:cursor-not-allowed disabled:opacity-40 ${
              isSelected
                ? "border-primary-500 bg-primary-50 text-primary-500"
                : "border-gray-200 text-gray-700"
            }`}
          >
            {city.name} {isSelected ? "· 비교함에 담김" : "· 비교함에 담기"}
          </button>
        );
      })}
    </div>
  );
}

export default function App() {
  return (
    <>
      <CompareTestButtons />
      <CompareSelectionBar cities={mockCities} />
      <CompareModal
        cities={mockCities}
        onSelectCity={(id) => console.log("선택:", id)}
      />
    </>
  );
}
