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

export default function RoadmapTimeline({ tasks, onTaskClick }: RoadmapTimelineProps) {
  return (
    <div className="relative flex w-[614px] flex-col gap-2">
      <div className="pointer-events-none absolute bottom-3.5 left-[23px] top-3.5 w-px rounded-full bg-gray-300" aria-hidden />
      {tasks.map((task, i) => (
        <TimeLineTaskCard key={`${task.title}-${i}`} {...task} onClick={() => onTaskClick?.(i)} />
      ))}
    </div>
  );
}
