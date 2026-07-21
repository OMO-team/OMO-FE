import TimelineOngoingIcon from './icons/TimelineOngoingIcon';
import RemoveIcon from './icons/RemoveIcon';

type RoadmapAddedToastProps = {
  cityName: string;
  onClose?: () => void;
};

export default function RoadmapAddedToast({ cityName, onClose }: RoadmapAddedToastProps) {
  return (
    <div className="fixed left-1/2 top-6 z-[70] flex -translate-x-1/2 items-center gap-2 rounded-3 bg-gray-800 py-2 pl-4 pr-3 text-white shadow-02">
      <TimelineOngoingIcon className="size-icon-sm" />
      <p className="body-04 whitespace-nowrap">{cityName}이 로드맵에 추가되었어요.</p>
      <button type="button" onClick={onClose} aria-label="닫기" className="text-gray-400">
        <RemoveIcon className="size-icon-xs" />
      </button>
    </div>
  );
}
