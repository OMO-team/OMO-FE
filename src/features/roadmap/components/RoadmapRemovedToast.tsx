import CheckCircleIcon from './icons/CheckCircleIcon';
import ToastCloseIcon from './icons/ToastCloseIcon';
import { getSubjectParticle } from '../utils/korean';

type RoadmapRemovedToastProps = {
  cityName: string;
  onUndo?: () => void;
  onClose?: () => void;
};

export default function RoadmapRemovedToast({ cityName, onUndo, onClose }: RoadmapRemovedToastProps) {
  return (
    <div className="fixed left-1/2 top-6 z-[70] flex -translate-x-1/2 items-center gap-4 rounded-full border border-primary-100 bg-primary-50 px-5 py-2 shadow-[0px_3px_4px_rgba(6,49,88,0.16)]">
      <div className="flex shrink-0 items-center gap-2">
        <CheckCircleIcon className="size-icon-sm shrink-0 text-primary-500" />
        <p className="body-02 w-60 whitespace-nowrap text-primary-500">
          {cityName}{getSubjectParticle(cityName)} 나라별 로드맵에서 제거되었어요.
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button type="button" onClick={onUndo} className="shrink-0 rounded-full bg-primary-100">
          <span className="body-04 block whitespace-nowrap rounded-2 px-3 py-1.5 text-primary-500">실행 취소</span>
        </button>
        <button type="button" onClick={onClose} aria-label="닫기" className="flex shrink-0 items-center rounded-full p-1 text-primary-300">
          <ToastCloseIcon className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
