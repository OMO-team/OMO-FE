interface CityReportFooterProps {
  cityName: string;
  onAddToRoadmap?: () => void;
}

export default function CityReportFooter({
  cityName,
  onAddToRoadmap,
}: CityReportFooterProps) {
  return (
    <div className="flex w-full shrink-0 items-center justify-between border-t border-gray-200 bg-white px-[72px] pt-[30px] pb-10 shadow-[4px_-2px_16px_0px_rgba(6,49,88,0.1)]">
      <p className="title-02 text-gray-900">
        <span className="text-primary-500">{cityName}</span>으로 시작해 볼까요?
      </p>
      <button
        type="button"
        onClick={onAddToRoadmap}
        className="flex h-12 w-[282px] items-center justify-center rounded-2 bg-primary-500 title-02 text-white"
      >
        로드맵에 추가하기
      </button>
    </div>
  );
}
