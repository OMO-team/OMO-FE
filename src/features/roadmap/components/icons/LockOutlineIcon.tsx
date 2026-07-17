type LockOutlineIconProps = {
  className?: string;
};

export default function LockOutlineIcon({ className }: LockOutlineIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7.5 10.5V7.5C7.5 5.29086 9.29086 3.5 11.5 3.5H12.5C14.7091 3.5 16.5 5.29086 16.5 7.5V10.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="15" r="1.4" fill="currentColor" />
    </svg>
  );
}
