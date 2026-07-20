import TimelineOngoingIcon from './icons/TimelineOngoingIcon';
import RemoveIcon from './icons/RemoveIcon';

type RoadmapRemovedToastProps = {
  cityName: string;
  onUndo?: () => void;
  onClose?: () => void;
};

export default function RoadmapRemovedToast({ cityName, onUndo, onClose }: RoadmapRemovedToastProps) {
  return (
    <div className="fixed left-1/2 top-6 z-[70] flex -translate-x-1/2 items-center gap-2 rounded-3 bg-gray-800 py-2 pl-4 pr-3 text-white shadow-02">
      <TimelineOngoingIcon className="size-icon-sm" />
      <p className="body-04 whitespace-nowrap">{cityName}가 나라별 로드맵에서 제거되었어요.</p>
      <button type="button" onClick={onUndo} className="title-03 whitespace-nowrap text-primary-300">
        실행 취소
      </button>
      <button type="button" onClick={onClose} aria-label="닫기" className="text-gray-400">
        <RemoveIcon className="size-icon-xs" />
      </button>
    </div>
  );
}
