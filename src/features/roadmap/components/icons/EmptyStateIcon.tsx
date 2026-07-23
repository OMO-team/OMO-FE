import BagIcon from './BagIcon';

type EmptyStateIconProps = {
  className?: string;
};

export default function EmptyStateIcon({ className }: EmptyStateIconProps) {
  return (
    <div className="flex size-[70px] items-center justify-center overflow-hidden rounded-full bg-[#f1f8ff] p-3.5">
      <BagIcon className={`size-icon-xl text-primary-500 ${className ?? ''}`} />
    </div>
  );
}
