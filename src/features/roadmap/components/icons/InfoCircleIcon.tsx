type InfoCircleIconProps = {
  className?: string;
};

export default function InfoCircleIcon({ className }: InfoCircleIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 8V12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="15.8" r="1.1" fill="currentColor" />
    </svg>
  );
}
