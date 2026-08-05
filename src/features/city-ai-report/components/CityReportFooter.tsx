interface CityReportFooterProps {
  cityName: string;
  onAddToRoadmap?: () => void;
  /** 추가가 끝났거나 진행 중이면 "로드맵에 추가됨" 상태로 바뀌어 중복 생성되지 않도록 막음 */
  isAddDisabled?: boolean;
  /** 추가에 실패했을 때 사용자에게 보여줄 문구 */
  errorMessage?: string | null;
}

export default function CityReportFooter({
  cityName,
  onAddToRoadmap,
  isAddDisabled = false,
  errorMessage,
}: CityReportFooterProps) {
  // 콜백이 없으면 눌러도 아무 일이 없으므로 비활성 상태로 취급
  const isAdded = isAddDisabled || !onAddToRoadmap;
  return (
    <div className="flex w-full shrink-0 items-center justify-between border-t border-gray-200 bg-white px-9 py-5">
      <div className="flex flex-col gap-1">
        <p className="title-02 text-gray-900">
          <span className="text-primary-500">{cityName}</span>으로 시작해 볼까요?
        </p>
        {errorMessage && (
          <p role="alert" className="body-04 text-red-500">
            {errorMessage}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={onAddToRoadmap}
        disabled={isAdded}
        className={`title-02 rounded-3 px-6 py-3 text-white disabled:cursor-not-allowed ${
          isAdded ? 'bg-gray-300' : 'bg-primary-500'
        }`}
      >
        {isAdded ? '로드맵에 추가됨' : '로드맵에 추가하기'}
      </button>
    </div>
  );
}
