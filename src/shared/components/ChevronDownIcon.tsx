interface ChevronDownIconProps {
  color?: string;
  className?: string;
  onClick?: () => void
}

export default function ChevronDownIcon({ color = '#94A0B4', className, onClick }: ChevronDownIconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} onClick={onClick}>
      <path d="M13 6L8 10L3 6" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
