import addIcon from '../../../assets/icons/icon-add.svg';

type RoadmapAddedToastProps = {
  cityName: string;
  onViewRoadmap?: () => void;
  onClose?: () => void;
};

export default function RoadmapAddedToast({ cityName, onViewRoadmap, onClose }: RoadmapAddedToastProps) {
  return (
    <div className="fixed left-1/2 top-6 z-[70] flex h-[50px] w-[670px] -translate-x-1/2 flex-col items-center justify-center gap-1 rounded-full border border-primary-100 bg-primary-50 px-5 py-1.5 shadow-[0_3px_8px_0_rgba(6,49,88,0.16)]">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={addIcon} alt="" style={{ width: '20px', height: '20px' }} />
          <p className="body-04 whitespace-nowrap text-gray-900">{cityName}이 로드맵에 추가되었어요.</p>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={onViewRoadmap} className="title-03 whitespace-nowrap text-primary-500">
            보러가기
          </button>
          <button type="button" onClick={onClose} aria-label="닫기" className="text-primary-300">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M14.75 0.75L0.75 14.75M0.75 0.75L14.75 14.75"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
