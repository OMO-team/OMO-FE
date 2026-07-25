import type { ReactNode } from 'react';

type RoadmapAlertCardProps = {
  icon: ReactNode;
  iconBgClassName?: string;
  iconColorClassName?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionClassName?: string;
};

export default function RoadmapAlertCard({
  icon,
  iconBgClassName = 'bg-gray-100',
  iconColorClassName = 'text-gray-500',
  title,
  description,
  actionLabel,
  onAction,
  actionClassName = 'bg-gray-700 text-white',
}: RoadmapAlertCardProps) {
  return (
    <div className="flex w-full flex-col items-center gap-4 rounded-4 border border-gray-100 bg-gray-20 px-6 py-10">
      <span className={`flex size-14 items-center justify-center rounded-3 ${iconBgClassName}`}>
        <span className={`flex size-icon-lg items-center justify-center ${iconColorClassName}`}>{icon}</span>
      </span>
      <div className="flex flex-col items-center gap-1">
        <p className="title-02 text-center text-gray-900">{title}</p>
        {description && <p className="body-04 text-center text-gray-500">{description}</p>}
      </div>
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className={`title-03 rounded-3 px-4 py-2 ${actionClassName}`}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
