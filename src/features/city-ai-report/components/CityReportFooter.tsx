import { getDirectionParticle } from '../../roadmap/utils/korean';

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
    <div className="flex w-full shrink-0 items-center justify-between border-t border-gray-200 bg-white px-[72px] pt-[30px] pb-10 shadow-[4px_-2px_16px_0px_rgba(6,49,88,0.1)]">
      <div className="flex flex-col gap-1">
        <p className="title-02 text-gray-900">
          <span className="text-primary-500">{cityName}</span>
          {getDirectionParticle(cityName)} 시작해 볼까요?
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
        className="flex h-12 w-[282px] items-center justify-center rounded-2 bg-primary-500 title-02 text-white disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        {/* 이미 담은 도시도 문구는 그대로 두고 회색으로만 구분한다 (시안 기준) */}
        로드맵에 추가하기
      </button>
    </div>
  );
}
