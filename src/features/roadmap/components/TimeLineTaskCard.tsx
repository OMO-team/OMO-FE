import WarningIcon from './icons/WarningIcon';
import TimelineSuccessIcon from './icons/TimelineSuccessIcon';
import TimelineOngoingIcon from './icons/TimelineOngoingIcon';
import TimelineUpcomingIcon from './icons/TimelineUpcomingIcon';
import TimelineLockIcon from './icons/TimelineLockIcon';
import TimelineMissedIcon from './icons/TimelineMissedIcon';

export type TimeLineTaskCardStatus = 'success' | 'ongoing' | 'upcoming' | 'lock' | 'missed';

const STATUS_ICON: Record<TimeLineTaskCardStatus, typeof TimelineSuccessIcon> = {
  success: TimelineSuccessIcon,
  ongoing: TimelineOngoingIcon,
  upcoming: TimelineUpcomingIcon,
  lock: TimelineLockIcon,
  missed: TimelineMissedIcon,
};

type TimeLineTaskCardProps = {
  status: TimeLineTaskCardStatus;
  /** 있으면 D-day 태그 표시 (예: "000"), 없으면 태그 자체를 숨김 */
  dDay?: string;
  date: string;
  category: string;
  title: string;
  /** ongoing 상태일 때만 표시되는 하위 단계 진행률 */
  stepsCompleted?: number;
  stepsTotal?: number;
  /** lock 상태일 때 표시할 경고 문구 */
  prerequisiteWarning?: string;
  onClick?: () => void;
};

export default function TimeLineTaskCard({
  status,
  dDay,
  date,
  category,
  title,
  stepsCompleted,
  stepsTotal,
  prerequisiteWarning = '선행 작업 완료 필요',
  onClick,
}: TimeLineTaskCardProps) {
  const isSuccess = status === 'success';
  const isOngoing = status === 'ongoing';
  const isLock = status === 'lock';
  const isMissed = status === 'missed';
  const isMuted = isSuccess || isMissed;
  const StatusIcon = STATUS_ICON[status];

  return (
    <div className="flex w-153.5 items-center pl-2">
      <StatusIcon className="size-icon-lg shrink-0" />
      <button
        type="button"
        onClick={onClick}
        className={`flex w-144.5 flex-col items-start gap-2 rounded-4 border px-5 py-4 text-left transition-colors ${
          isOngoing
            ? 'border-primary-500 bg-white shadow-[0px_5px_16px_0px_rgba(21,93,252,0.2)]'
            : isMuted
              ? 'border-gray-50 bg-gray-50 hover:bg-gray-100'
              : 'border-gray-100 bg-white hover:bg-gray-50'
        }`}
      >
        <div className="flex w-full items-start gap-2">
          {dDay && (
            <span
              className={`body-05 rounded-md px-3 py-1 ${
                isMuted ? 'bg-gray-100 text-gray-300' : 'bg-primary-100 text-primary-600'
              }`}
            >
              D-{dDay}
            </span>
          )}
          <span className={`body-03 flex-1 ${isMuted ? 'text-gray-400' : 'text-primary-900'}`}>{date}</span>
          {isOngoing && stepsTotal !== undefined && (
            <span className="body-02 text-primary-500">
              {stepsCompleted}/{stepsTotal} 완료
            </span>
          )}
        </div>
        <div className="flex flex-col items-start gap-1.5">
          <span className="body-05 rounded-md bg-gray-100 px-3 py-1 text-gray-500">{category}</span>
          <p className={`title-02 ${isSuccess ? 'text-gray-500 line-through' : isMissed ? 'text-gray-500' : 'text-gray-900'}`}>
            {title}
          </p>
          {isLock && (
            <span className="flex items-center gap-0.5 text-[9.16px] font-medium text-red-500">
              <WarningIcon className="size-4" />
              {prerequisiteWarning}
            </span>
          )}
        </div>
      </button>
    </div>
  );
}
