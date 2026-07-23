import TimeLineTaskCard, { type TimeLineTaskCardStatus } from './TimeLineTaskCard';

type RoadmapTask = {
  status: TimeLineTaskCardStatus;
  dDay?: string;
  date: string;
  category: string;
  title: string;
  stepsCompleted?: number;
  stepsTotal?: number;
  prerequisiteWarning?: string;
};

type RoadmapTimelineProps = {
  tasks: RoadmapTask[];
  onTaskClick?: (index: number) => void;
};

/** "2026.04.15" 형식의 날짜 문자열을 로컬 Date로 변환 */
function parseTaskDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('.').map(Number);
  return new Date(year, month - 1, day);
}

/** 잠금/완료 상태는 그대로 두고, 진행중·예정 상태만 기한이 지났으면 '놓침'으로 전환 */
function getEffectiveStatus(task: RoadmapTask, today: Date): TimeLineTaskCardStatus {
  if (task.status !== 'ongoing' && task.status !== 'upcoming') return task.status;
  return parseTaskDate(task.date) < today ? 'missed' : task.status;
}

export default function RoadmapTimeline({ tasks, onTaskClick }: RoadmapTimelineProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="relative flex w-153.5 flex-col gap-2">
      <div className="pointer-events-none absolute bottom-3.5 left-5.75 top-3.5 w-px rounded-full bg-gray-300" aria-hidden />
      {tasks.map((task, i) => (
        <TimeLineTaskCard
          key={`${task.title}-${i}`}
          {...task}
          status={getEffectiveStatus(task, today)}
          onClick={() => onTaskClick?.(i)}
        />
      ))}
    </div>
  );
}
