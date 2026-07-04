import bagIcon from '../../assets/icons/empty-state-bag.png';

type EmptyStateIconProps = {
  iconSrc?: string;
  alt?: string;
};

export default function EmptyStateIcon({ iconSrc = bagIcon, alt = '' }: EmptyStateIconProps) {
  return (
    <div className="flex size-[70px] items-center justify-center overflow-hidden rounded-full bg-gray-50 p-3.5">
      <img src={iconSrc} alt={alt} className="size-icon-xl" />
    </div>
  );
}
