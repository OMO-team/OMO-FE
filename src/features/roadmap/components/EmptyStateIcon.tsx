import BagIcon from './icons/BagIcon';

type EmptyStateIconProps = {
  className?: string;
};

export default function EmptyStateIcon({ className }: EmptyStateIconProps) {
  return (
    <div className="flex size-[70px] items-center justify-center overflow-hidden rounded-full bg-gray-50 p-3.5">
      <BagIcon className={`size-icon-xl text-gray-400 ${className ?? ''}`} />
    </div>
  );
}
