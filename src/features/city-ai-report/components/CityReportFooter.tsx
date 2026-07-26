interface CityReportFooterProps {
  cityName: string;
  onAddToRoadmap?: () => void;
}

export default function CityReportFooter({
  cityName,
  onAddToRoadmap,
}: CityReportFooterProps) {
  return (
    <div className="flex w-full shrink-0 items-center justify-between border-t border-gray-200 bg-white px-9 py-5">
      <p className="title-02 text-gray-900">
        <span className="text-primary-500">{cityName}</span>으로 시작해 볼까요?
      </p>
      <button
        type="button"
        onClick={onAddToRoadmap}
        className="rounded-3 bg-primary-500 px-6 py-3 title-02 text-white"
      >
        로드맵에 추가하기
      </button>
    </div>
  );
}
