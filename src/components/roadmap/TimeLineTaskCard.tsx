import statusIcon from '../../assets/icons/timeline-status.png';

type TimeLineTaskCardProps = {
  dDay: string;
  date: string;
  category: string;
  title: string;
  isCompleted?: boolean;
};

export default function TimeLineTaskCard({
  dDay,
  date,
  category,
  title,
  isCompleted = false,
}: TimeLineTaskCardProps) {
  return (
    <div className="flex w-[614px] items-center pl-[9px]">
      {isCompleted ? (
        <span className="size-icon-lg shrink-0 rounded-full bg-primary-500" aria-hidden />
      ) : (
        <img src={statusIcon} alt="" className="size-icon-lg shrink-0" />
      )}
      <div className="flex flex-1 flex-col items-start gap-2 rounded-4 border border-gray-50 bg-gray-50 px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="body-05 rounded-2 bg-gray-100 px-3 py-1 text-gray-300">D-{dDay}</span>
          <span className="body-03 text-gray-500">{date}</span>
        </div>
        <span className="body-05 rounded-2 bg-gray-100 px-3 py-1 text-gray-500">{category}</span>
        <p className={`title-02 text-gray-500 ${isCompleted ? 'line-through' : ''}`}>{title}</p>
      </div>
    </div>
  );
}
