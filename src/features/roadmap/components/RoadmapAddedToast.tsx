import addIcon from '../../../assets/icons/icon-add.svg';

type RoadmapAddedToastProps = {
  cityName: string;
  onViewRoadmap?: () => void;
  onClose?: () => void;
};

export default function RoadmapAddedToast({ cityName, onViewRoadmap, onClose }: RoadmapAddedToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed left-1/2 top-6 z-[70] flex w-167.5 -translate-x-1/2 items-center justify-between gap-7.5 rounded-full border border-primary-100 bg-primary-50 px-5 py-1.5 shadow-[0_3px_8px_0_rgba(6,49,88,0.16)]"
    >
      <div className="flex items-center gap-4">
        <span className="flex items-center rounded-full bg-primary-100 p-1.5">
          <img src={addIcon} alt="" className="size-5" />
        </span>
        <p className="title-03 whitespace-nowrap text-primary-600">{cityName}이 로드맵에 추가되었어요.</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onViewRoadmap}
          className="title-03 whitespace-nowrap rounded-2 px-3 py-1.5 text-primary-600"
        >
          보러가기
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="flex items-center rounded-full p-1.5 text-primary-600"
        >
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
  );
}
