type AlertCircleIconProps = {
  className?: string;
};

export default function AlertCircleIcon({ className }: AlertCircleIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="12" cy="12" r="10" fill="#FEE2E2" />
      <path d="M12 7V13" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="16.2" r="1.1" fill="#EF4444" />
    </svg>
  );
}
