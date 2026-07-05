import WarningIcon from './WarningIcon';
import TimelineSuccessIcon from './TimelineSuccessIcon';
import TimelineOngoingIcon from './TimelineOngoingIcon';
import TimelineUpcomingIcon from './TimelineUpcomingIcon';
import TimelineLockIcon from './TimelineLockIcon';

export type TimeLineTaskCardStatus = 'success' | 'ongoing' | 'upcoming' | 'lock';

const STATUS_ICON: Record<TimeLineTaskCardStatus, typeof TimelineSuccessIcon> = {
  success: TimelineSuccessIcon,
  ongoing: TimelineOngoingIcon,
  upcoming: TimelineUpcomingIcon,
  lock: TimelineLockIcon,
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
  const StatusIcon = STATUS_ICON[status];

  return (
    <div className="flex w-[614px] items-center pl-2">
      <StatusIcon className="size-icon-lg shrink-0" />
      <button
        type="button"
        onClick={onClick}
        className={`flex w-[578px] flex-col items-start gap-2 rounded-4 border bg-white px-5 py-4 text-left ${
          isOngoing ? 'border-primary-500 shadow-[0px_5px_16px_0px_rgba(21,93,252,0.2)]' : 'border-gray-100'
        }`}
      >
        <div className="flex w-full items-start gap-2">
          {dDay && <span className="body-05 rounded-md bg-primary-100 px-3 py-1 text-primary-600">D-{dDay}</span>}
          <span className="body-03 flex-1 text-primary-900">{date}</span>
          {isOngoing && stepsTotal !== undefined && (
            <span className="body-02 text-primary-500">
              {stepsCompleted}/{stepsTotal} 완료
            </span>
          )}
        </div>
        <div className="flex flex-col items-start gap-1.5">
          <span className="body-05 rounded-md bg-gray-100 px-3 py-1 text-gray-500">{category}</span>
          <p className={`title-02 text-gray-900 ${isSuccess ? 'line-through' : ''}`}>{title}</p>
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
