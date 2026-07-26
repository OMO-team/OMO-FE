type ChevronDownIconProps = {
  className?: string;
};

export default function ChevronDownIcon({ className }: ChevronDownIconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M16 7L10 13L4 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
